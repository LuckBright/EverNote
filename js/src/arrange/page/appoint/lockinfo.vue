<template>
  <el-popover
    v-model="show"
    :open-delay="500"
    placement="right"
    :width="353"
    trigger="click">
    <div class="mainbox">
      <h2>要解除锁定吗？</h2>
      <el-form label-width="80px"  label-position="right" ref="lockform">
        <el-form-item label="医生：">
          <span>{{data.resourceName}}</span>
        </el-form-item>
        <el-form-item label="时间：">
          <span>{{data.lockDateStr}} {{data.lockStartTimeStr}} ({{data.timeLength}} 分钟)</span>
        </el-form-item>
        <el-form-item label="备注：">
          <span>{{data.description}}</span>
        </el-form-item>
        <el-form-item>
          <div style="padding: 20px 0;">
            <el-button type="primary" @click="show=false">关闭</el-button>
            <el-button type="primary" plain="" @click="cannelLock">解除锁定</el-button>
          </div>
        </el-form-item>           
      </el-form>      
    </div>
    <div slot="reference" class="area" :style="{display: inline ? 'inline-block': 'block'}">
      <slot></slot>
    </div>      
  </el-popover>
</template>
<script>
import api from '@/arrange/store/appointmentapi'
export default {
  props: ['data', 'inline'],
  data () {
    return {
      api,
      show: false
    }
  },
  watch: {
    show (val) {
      if (val) {
        this.$bus.$emit('appoint:showinfo', true)
      }
    }
  },
  methods: {
    cannelLock () {
      this.api.cancelLockAppoint({id: this.data.id}).then(rs => {
        if (!rs.head.errCode) {
          this.show = false
          this.$bus.$emit('appoint:success', true)
        }
      })
    }
  }
}
</script>

<style scoped>
  .mainbox h2 {text-align: center;}
  .area{height: 100%;}
  .mainbox .el-form-item {margin-bottom: 0; font-size: 14px; color: #000; }
  .mainbox /deep/ .el-form-item__content {line-height: 32px;}
</style>
