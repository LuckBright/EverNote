<template>
  <div style="min-height: 400px">
    <el-steps class="ever_steps_01" :active="current" align-center>
      <el-step title="输入绑定手机号" v-if="flag !== 'reset'">
        <template slot="icon">
          <i class="iconfont icon-phone" @click="chgReset()"></i>
        </template>
      </el-step>
      <el-step title="设置新密码">
        <template slot="icon">
          <i class="iconfont icon-password"></i>
        </template>
      </el-step>
      <el-step title="设置成功">
        <template slot="icon">
          <i class="iconfont icon-complete"></i>
        </template>
      </el-step>
    </el-steps>
    <div class="pwd_form_box">
      <!-- <transition name="el-fade-in"> -->
      <el-form
        v-if="current === 1 && flag === 'reset'"
        class="pwd_form"
        ref="resetForm"
        :rules="resetRules"
        :model="resetForm"
        label-width="80px">
        <el-form-item label="用户名" prop="loginName">
          <el-input
            v-model="resetForm.loginName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="resetForm.oldPassword"
            :maxlength="pwdLenMax"
            placeholder="请输入旧密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="resetForm.newPassword"
            :maxlength="pwdLenMax"
            placeholder="密码8-20位，必须包含字母、数字和字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input
            type="password"
            v-model="resetForm.checkPwd"
            :maxlength="pwdLenMax"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="mt40">
          <el-button
            class="el-button-01"
            type="primary"
            :disabled="resetFormDisable"
            @click="updatePasswordByOldPassword()"
          >确定</el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-if="current == 1  && flag !== 'reset'"
        class="pwd_form"
        :rules="smsRules"
        ref="smsForm"
        :model="smsForm"
        label-width="80px">
        <el-form-item label="手机号码" prop="mobile">
          <el-input
            class="spe_mobile_inp"
            type="tel"
            :maxlength="11"
            v-model="smsForm.mobile"
            placeholder="手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="smscode">
          <el-row>
            <el-col :span="14">
              <el-input
                type="tel"
                :maxlength="6"
                v-model="smsForm.smscode"
                placeholder="请输入6位手机验证码"
              ></el-input>
            </el-col>
            <el-col :span="8" :offset="1">
              <el-button
                class="el-button-02"
                :disabled="smsCodeDisable"
                @click="getLoginSmsCode"
              >{{!smsCodeIng ? '获取验证码' : computedTime + 's'}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="mt40">
          <el-button
            class="el-button-01"
            type="primary"
            @click="submitSmsForm()"
            :disabled="smsFormDisable"
          >完成验证</el-button>
        </el-form-item>
      </el-form>
      <el-form
        v-if="current == 2"
        class="pwd_form"
        ref="pwdForm"
        label-width="80px"
        :rules="pwdRules"
        :model="pwdForm">
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            v-model="pwdForm.password"
            :maxlength="pwdLenMax"
            placeholder="密码8-20位，必须包含字母、数字和字符"
          ></el-input>
          <pwd-strength v-model="pwdForm.password" :min="pwdLenMin" :max="pwdLenMax"></pwd-strength>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input
            type="password"
            v-model="pwdForm.checkPwd"
            :maxlength="pwdLenMax"
            placeholder="请再次输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item class="mt40">
          <el-button
            class="el-button-01"
            type="primary"
            :disabled="pwdFormDisable"
            @click="submitPwdForm()"
          >确定</el-button>
        </el-form-item>
      </el-form>
      <div class="pwd_success alg_c" v-if="current == 3">
        <span class="mt10">
          密码设置成功，
          <router-link to="/login">{{type == 1 ? '立即登录' : '重新登录'}}</router-link>
        </span>
      </div>
      <!-- </transition> -->
    </div>
    <div class="alg_r pb20" v-if="type == 1 && current != 3">
      <router-link to="/login" class="login_link f14">立即登录</router-link>
    </div>
  </div>
</template>
<script>
import api from '@/auth/store/sessionapi'
import { checkPhone } from '@/util/common'
import validator from '@/util/validator'
import pwdStrength from '@/login/page/password/pwdStrength'
import { validatePassword, validatePassConfirm } from '@/util/validate'
import urlMap from '@/login/store/urls'
import { request } from '@/util/req'

export default {
  data () {
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validatePass = (rule, value, callback) => {
      validatePassConfirm(rule, value, this.resetForm.newPassword, callback)
    }
    return {
      current: 1,
      logining: false,
      smsForm: {
        mobile: null,
        smscode: null
      },
      pwdForm: {
        password: null,
        checkPwd: null
      },
      resetForm: {
        loginName: '',
        oldPassword: '',
        newPassword: '',
        checkPwd: '',
      },
      pwdLenMin: 8,
      pwdLenMax: 20,
      pwdFormDisable: true,
      smsCodeDisable: true,
      smsFormDisable: true,
      resetFormDisable: true,
      smsCodeIng: false,
      computedTime: 60,
      smsRules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validator.checkMobile, trigger: 'blur' }
        ],
        smscode: [
          { required: true, message: '请输入6位手机验证码', trigger: 'blur' },
          { validator: validator.checkSMSCode, trigger: 'blur' }
        ]
      },
      pwdRules: {
        password: [
          { required: true, validator: validatePassword, min: 8, max: 20, trigger: 'blur' }
        ],
        checkPwd: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      resetRules: {
        loginName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        checkPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      api
    }
  },
  props: {
    'type': {
      type: Number,
      default: 1
    },
    'flag': {
      type: String,
      default: ''
    }
  },
  components: {
    pwdStrength
  },
  methods: {
    chgReset () {
      this.current = 1
      // this.flag = 'reset'
    },
    // 短信验证码提交
    async submitSmsForm () {
      this.$refs.smsForm.validate(async (valid) => {
        if (valid) {
          this.smsFormDisable = true
          let result = await api.verificationMsg({ telephoneNumber: this.smsForm.mobile, verificationCode: this.smsForm.smscode })
          this.smsFormDisable = false
          if (result.head.errCode === 0) {
            this.current = 2
          }
        }
      })
    },
    // 填写新密码提交
    async submitPwdForm () {
      this.$refs.pwdForm.validate(async (valid) => {
        if (valid) {
          this.pwdFormDisable = true
          let result = await api.modifyPassword({ telephoneNumber: this.smsForm.mobile, password: this.pwdForm.password })
          this.pwdFormDisable = false
          if (result.head.errCode === 0) {
            this.current = 3
          }
        }
      })
    },
    // 获取验证码相关交互
    async getLoginSmsCode () {
      const _self = this
      if (_self.smsForm.mobile && !_self.smsCodeDisable && !_self.smsCodeIng) {
        _self.computedTime = 60
        _self.smsCodeIng = !_self.smsCodeIng
        _self.timer = setInterval(() => {
          _self.computedTime--
          if (_self.computedTime === 0) {
            _self.smsCodeIng = !_self.smsCodeIng
            clearInterval(_self.timer)
          }
        }, 1000)
        try {
          const res = await api.sendSmsCode({ telephoneNumber: _self.smsForm.mobile })
          if (res.head.errCode === 0 && res.data) {
            this.$messageTips(this, 'success', '短信验证码发送成功！')
          } else {
            _self.smsCodeIng = !_self.smsCodeIng
            clearInterval(_self.timer)
          }
        } catch (err) {
          this.$messageTips(this, 'error')
          _self.smsCodeIng = !_self.smsCodeIng
          clearInterval(_self.timer)
        }
      }
    },
    // 修改密码提交方法
    updatePasswordByOldPassword () {
      request(urlMap.myBench.updatePasswordByOldPassword, this.resetForm).then(res => {
        if (res.head.errCode === 0) {
          this.current = 3
          this.$messageTips(this, 'success', '密码设置成功')
        }
      })
    }
  },
  watch: {
    'smsForm.mobile': function (cur, old) {
      if (checkPhone(cur)) {
        this.smsCodeDisable = false
      } else {
        this.smsCodeDisable = true
      }
    },
    'smsForm': {
      handler (cur, old) {
        if (cur && cur.mobile && cur.smscode) {
          this.$refs['smsForm'].validate((valid) => {
            if (valid) {
              this.smsFormDisable = false
            } else {
              this.smsFormDisable = true
            }
          })
        }
      },
      deep: true
    },
    'pwdForm': {
      handler (cur, old) {
        if (cur && cur.password && cur.checkPwd) {
          this.$refs['pwdForm'].validate((valid) => {
            if (valid) {
              this.pwdFormDisable = false
            } else {
              this.pwdFormDisable = true
            }
          })
        }
      },
      deep: true
    },
    'resetForm': {
      handler (cur, old) {
        if (cur && cur.loginName && cur.oldPassword && cur.newPassword && cur.checkPwd) {
          this.$refs['resetForm'].validate((valid) => {
            if (valid) {
              this.resetFormDisable = false
            } else {
              this.resetFormDisable = true
            }
          })
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.ever_steps_01 {
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}
.pwd_form_box {
  // position: relative;
  width: 66%;
  min-height: 253px;
  margin-left: 80px;
  // .pwd_form {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  // }
}
.el-form.pwd_form {
  width: 100%;
  padding: 40px 0 0;
  .el-form-item {
    margin-right: 0;
    /deep/ .el-input {
      .el-input__inner {
        height: 40px;
        font-size: 14px;
      }
    }
    /deep/ .spe_mobile_inp.el-input {
      position: relative;
      .el-input__inner {
        padding-left: 50px;
      }
      &:before {
        content: '+ 86';
        position: absolute;
        top: 0;
        left: 0;
        height: 40px;
        line-height: 42px;
        padding: 0 10px;
        font-size: 14px;
      }
    }
    .el-button {
      padding: 12px 0;
      font-size: 14px;
    }
    .el-button.is-disabled,
    .el-button.is-disabled:hover,
    .el-button.is-disabled:focus {
      border-color: #eef0f6;
    }
    .el-button-01 {
      width: 100%;
    }
    .el-button-02 {
      width: 112px;
      border-color: #ddd;
      &:hover,
      &:focus {
        border-color: #1c7bef;
      }
    }
  }
}

.el-step.is-horizontal /deep/ .el-step__line {
  top: 24px;
}
.el-step.is-horizontal /deep/ .el-step__icon {
  width: 50px;
  height: 50px;
  .iconfont {
    font-size: 20px;
  }
}
.pwd_success {
  margin: 20px 0 20px 20px;
  padding-top: 120px;
  font-size: 14px;
  color: #666;
  background: url('../../../assets/img/icon_complete.svg') center no-repeat;
  background-size: 100px;

  a {
    color: #1c7bef;
  }
  span {
    display: block;
  }
}
.login_link {
  // position: absolute;
  // bottom: 40px;
  // right: 40px;
  text-decoration: none;
  color: #1c7bef;
}
.el-form /deep/ .el-form-item__label {
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}
</style>
