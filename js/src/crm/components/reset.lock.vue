<template>
  <span>
    <el-popover
      placement="right"
      width="260"
      v-model="isVisible"
      trigger="click"
      class="custRecordPop">
      <el-row>
        <el-col :span="19">
          <el-input v-model="password" placeholder="重置密码"></el-input>
        </el-col>
        <el-col :span="2" align="right" style="height:36px;line-height:36px;text-align:left;margin-left:10px;">
          <el-button type="primary" @click="subimtSave">确定</el-button>
        </el-col>
      </el-row>
      <i slot="reference" @click="handleShow" class="iconfont icon-zhongzhi lock" v-if="$hasPermission('Auth_menu_crm_resetlock')"></i>
    </el-popover>
  </span>
</template>
<script>
import api from '@/crm/store/memberapi'
export default {
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
      api.updateSecret({'secret': this.password}).then(rs => {
        if (rs.head.errCode === 0) {
          this.isVisible = false
          this.password = ''
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
