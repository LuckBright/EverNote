<template>
  <el-dialog
    class="refund-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="true" 
    :append-to-body="true"
    :title="'请输入授权密码'"
    :visible.sync="v"
    width="30%"
  >
    <span class="detail-log">
      <el-row>
        <el-col :span="24">
          <form action="" autocomplete="off">
            <el-input
              placeholder="请输入授权密码"
              type="password"
              v-model="userInputCode"
            ></el-input>
          </form>
        </el-col>
      </el-row>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitPassword" :disabled="btndisabled">提 交</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {getRefundAuthorize} from '@/rcm/store/outpatient/outpatient'
export default {
  props: ['dialogVisible', 'callback', 'userObj'],
  data () {
    return {
      authRizeCode: '',
      userInputCode: '',
      btndisabled: false
    }
  },
  created () {
    getRefundAuthorize('refund_authorize').then(res => {
      this.authRizeCode = res.data
    }).catch(_ => {
      this.$messageTips(this, 'error', '未获取到系统配置授权码，请稍后再试')
    })
  },
  computed: {
    v: {
      get () {
        if (this.dialogVisible) {
          this.userInputCode = ''
          this.btndisabled = false
        }
        return this.dialogVisible
      },
      set (val) {
        this.$emit('update:dialogVisible', val)
      }
    },
  },
  methods: {
    submitPassword () {
      this.btndisabled = true
      if (this.userInputCode === '') {
        this.$messageTips(this, 'error', '请输入退费授权码')
        this.btndisabled = false
        return false
      } else if (this.authRizeCode !== this.userInputCode) {
        this.$messageTips(this, 'error', '退费授权码不正确，请重新输入')
        this.btndisabled = false
        return false
      } else {
        this.$emit('AuthorizeSuccess', this.callback, this.userObj)
      }
    }
  }
}
</script>

