<template>
  <el-dialog
    title="授权"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="true"
    :append-to-body="true"
    :width="width"
    @close="handleClose"
  >
    <ever-form2
      :schema="schema"
      v-model="obj"
      :rules="rules"
      :nosubmit="true"
      ref="form"
      :span="24"
      :info="true"
      labelWidth="80px"
      label-position="right"
    ></ever-form2>
    <div slot="footer">
      <el-button type="primary" size="small" @click="handleSure">确定</el-button>
      <el-button size="small" @click="handleClose()">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import api from '@/rcm/store/outpatient/auth.manage.api.js'
let schema = [
  {
    label: '用户账号',
    name: 'userName'
  },
  {
    label: '登录密码',
    name: 'passWord',
    props: {
      type: 'password',
      autocomplete: 'new-password'
    }
  },
  {
    label: '授权密码',
    name: 'authCode',
    props: {
      type: 'password',
      placeholder: '请输入6位数字或字母',
      maxlength: 6,
      autocomplete: 'new-password'
    }
  }
]
let rules = {
  userName: [{ required: true, message: '请输入用户账号', trigger: 'change' }],
  passWord: [{ required: true, message: '请输入用户密码', trigger: 'change' }],
  authCode: [{ required: true, message: '请输入授权密码', trigger: 'change' }]
}
export default {
  props: ['callbackVal', 'callbackValue', 'visitNumber', 'patientId', 'typeCode', 'authSettlementid', 'width'],
  data () {
    let obj = this.$ever.createObjFromSchema(schema)
    // obj.userName = '13241497979'
    // obj.passWord = 'Aa111111!'
    // obj.authCode = '111111'
    return {
      api,
      obj,
      schema,
      rules,
      visible: false,
      closeFlag: false
    }
  },
  methods: {
    handleSure () {
      this.$refs.form.$refs.form.validate(valid => {
        if (valid) {
          let params = {
            userName: this.obj.userName,
            passWord: this.obj.passWord,
            authCode: this.obj.authCode,
            typeCode: this.typeCode,
            patientId: this.patientId,
            visitNumber: this.visitNumber
          }
          if (this.authSettlementid) {
            params['settlementid'] = this.authSettlementid
          }
          api.checkAuth(params).then(rs => {
            if (rs.head && rs.head.errCode === 0) {
              let authorizerId = rs.data
              this.closeFlag = true
              this.$messageTips(this, 'success', '授权成功')
              this.$emit('confirmCallback', { callbackVal: this.callbackVal, value: this.callbackValue, authInfo: { ...this.obj, authorizerId } })
              this.visible = false
            } else {
              this.$messageTips(this, 'error', '授权失败，稍后再试')
            }
          })
        }
      })
    },
    // 关闭授权弹窗 确定和取消都会触发 handleClose,添加逻辑
    // 1.点确定发请求改状态值，不需要抛出cancle方法，
    // 2.点叉号或者取消 状态值为假 抛出cancle方法
    handleClose () {
      this.visible = false
      if (!this.closeFlag) {
        this.$emit('cancleAuth')
      }
    }
  },
  watch: {
    'visible': {
      handler (val) {
        if (!val) {
          this.$refs.form.$refs.form.resetFields()
        } else {
          this.closeFlag = false
        }
      }
    }
  }
}
</script>
