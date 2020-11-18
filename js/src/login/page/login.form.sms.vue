<template>
  <el-form
    :model="ruleForm2"
    :rules="rules"
    ref="ruleForm2"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm custom-form">
    <el-form-item prop="telephoneNumber" class="not-required">
      <el-popover
        placement="top"
        width="234"
        trigger="manual"
        v-model="visible">
        <div>你已经很久没有修改密码，请 <router-link to="/reset" class="cBlue">修改密码</router-link></div>
        <el-input
          slot="reference"
          type="text"
          v-model="ruleForm2.telephoneNumber"
          size="large"
          auto-complete="on"
          :placeholder="$t('手机号')"
          maxlength="11">
          <template slot="prepend">
            <i class="icon iconfont icon-login-account"></i>
          </template>
        </el-input>
      </el-popover>
    </el-form-item>
    <el-form-item prop="verificationCode" class="not-required">
      <el-input
        type="tel"
        :maxlength="6"
        v-model="ruleForm2.verificationCode"
        :placeholder="$t('动态码')"
        size="large">
        <template slot="prepend">
          <i class="icon iconfont icon-login-password"></i>
        </template>
        <template slot="append">
          <span :class="['smsCode f12 cGray6', {'notallow': smsCodeIng}]" @click="getSmsCode">
            {{!smsCodeIng ? '获取验证码' : computedTime + 's'}}
          </span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="spe_item">
      <el-row>
        <el-col :span="12">
          <el-checkbox v-model="checked" disabled checked>{{ $t('记住密码') }}</el-checkbox>
        </el-col>
        <el-col :span="12" class="alg_r">
          <router-link to="/forgot" disabled>{{ $t('忘记密码') }}</router-link>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button
        class="loginBtn"
        size="large"
        @keyup.enter.native="handleSubmit2"
        @click="handleSubmit2"
        :loading="logining"
        v-ever-click-once="disabled"
        :disabled="disabled"
        native-type="submit">{{ $t('登 录') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { checkPhone } from '@/util/common'
import api from '@/auth/store/sessionapi'
import storage from '@/util/storage'
import i18n from '@/assets/locals/index'

const rules = {
  telephoneNumber: [
    { required: true, message: i18n.t('请输入手机号'), trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: i18n.t('请输入动态码'), trigger: 'blur' }
  ]
}

export default {
  data () {
    return {
      disabled: false,
      logining: false,
      ruleForm2: {
        telephoneNumber: '',
        verificationCode: ''
      },
      rules,
      checked: true,
      visible: false,
      smsCodeDisable: false,
      computedTime: 60,
      smsCodeIng: false,
      timer: ''
    }
  },
  created () {
    // this.ruleForm2.telephoneNumber = ''
    this.ruleForm2.verificationCode = ''
  },
  watch: {
    'ruleForm2.mobile': function (cur, old) {
      if (checkPhone(cur)) {
        this.smsCodeDisable = false
      } else {
        this.smsCodeDisable = true
      }
    },
  },
  methods: {
    // 获取验证码 点击之后发送请求，文案倒计时，禁用点击事件改ui样式
    async getSmsCode () {
      if (this.ruleForm2.telephoneNumber && !this.smsCodeDisable && !this.smsCodeIng) {
        this.computedTime = 60
        this.smsCodeIng = !this.smsCodeIng
        this.timer = setInterval(() => {
          this.computedTime--
          if (this.computedTime === 0) {
            this.smsCodeIng = !this.smsCodeIng
            clearInterval(this.timer)
          }
        }, 1000)
        try {
          const res = await api.sendVerificationMsg({
            telephoneNumber: this.ruleForm2.telephoneNumber
          })
          if (res.head.errCode === 0 && res.data) {
            this.$messageTips(this, 'success', '短信验证码发送成功！')
          } else {
            this.smsCodeIng = !this.smsCodeIng
            clearInterval(this.timer)
          }
        } catch (err) {
          this.$messageTips(this, 'error')
          this.smsCodeIng = !this.smsCodeIng
          clearInterval(this.timer)
        }
      }
    },
    handleSubmit2 (ev) {
      storage.removeSessionStorage('outpatientUrlParams')
      const _self = this
      this.$refs.ruleForm2.validate(async (valid) => {
        if (valid) {
          _self.logining = true
          let params = {
            telephoneNumber: this.ruleForm2.telephoneNumber,
            verificationCode: this.ruleForm2.verificationCode,
          }
          let results = await api.loginBySms(params)
          if (!results || !results.head || results.head.errCode !== 0) {
            _self.logining = false
            // 需要修改密码的code
            if (results.head.errCode === 991100) {
              this.visible = true
            }
            return
          }
          storage.setStorageByClinic('TOKEN', results.data)
          this.$store.commit('setResources', results.data.rIDList)

          let res = await api.user()
          if (res) {
            res.name = res.displayName
            this.$store.commit('setUser', res)
            storage.setLocalStorage('USERID', res.userId)
            this.$router.push('/myclinic')
          } else {
            _self.logining = false
            return false
          }
        } else {
          _self.logining = false
          return false
        }
      })
    },
  }
}
</script>
<style scoped>
.smsCode{cursor: pointer}
.smsCode.notallow{cursor: not-allowed}
</style>
