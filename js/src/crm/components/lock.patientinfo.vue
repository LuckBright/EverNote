<template>
  <span>
    <el-popover
      placement="top-start"
      width="260"
      v-model="isVisible"
      trigger="click"
      class="custRecordPop">
      <el-row>
        <el-col :span="19">
          <el-input placeholder="解锁" v-model="password"></el-input>
        </el-col>
        <el-col :span="2" align="right" style="height:36px;line-height:36px;text-align:left;margin-left:10px;">
          <el-button type="primary" @click="subimtSave">确定</el-button>
        </el-col>
      </el-row>
      <i slot="reference" @click="handleShow" class="iconfont icon-jiema lock" v-if="$hasPermission('Auth_menu_crm_unlock')"></i>
    </el-popover>
  </span>
</template>
<script>
import api from '@/crm/store/memberapi'
export default {
  props: ['kinship'],
  data () {
    return {
      isVisible: false,
      password: ''
    }
  },
  methods: {
    handleShow () {
      this.password = ''
    },
    subimtSave () {
      api.unlockSecret({'secret': this.password}).then(rs => {
        if (rs.data) {
          this.isVisible = false
          this.password = ''
          this.$emit('update', true)
        } else {
          this.$notify({
            title: '提示',
            type: 'error',
            message: '密码错误',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .lock{font-size:14px;color:#aaa;}
</style>
