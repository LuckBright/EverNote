<template>
	<el-form
    :model="ruleForm2"
    :rules="rules"
    ref="ruleForm2"
    label-position="left"
    label-width="0px"
    class="demo-ruleForm custom-form">
    <el-form-item prop="username" class="not-required">
      <el-popover
        placement="top"
        width="234"
        trigger="manual"
        v-model="visible">
        <div>你已经很久没有修改密码，请 <router-link to="/reset" class="cBlue">修改密码</router-link></div>
        <el-input
          slot="reference"
          type="text"
          v-model="ruleForm2.username"
          size="large"
          auto-complete="on"
          :placeholder="$t('账号')"
          name="ever_username"
          maxlength="11">
          <template slot="prepend">
            <i class="icon iconfont icon-login-account"></i>
          </template>
        </el-input>
      </el-popover>
    </el-form-item>
    <el-form-item prop="password" class="not-required">
      <el-input
        type="password"
        v-model="ruleForm2.password"
        size="large"
        auto-complete="off"
        :placeholder="$t('密码')"
        maxlength="40">
        <template slot="prepend">
          <i class="icon iconfont icon-login-password"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="spe_item">
      <el-row>
        <el-col :span="12">
          <el-checkbox v-model="checked" checked>{{ $t('记住密码') }}</el-checkbox>
        </el-col>
        <el-col :span="12" class="alg_r">
          <router-link to="/forgot">{{ $t('忘记密码') }}</router-link>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="width:100%;">
      <el-button
        class="loginBtn"
        size="large"
        @click="handleSubmit2"
        @keyup.enter.native="handleSubmit2"
        :loading="logining"
        v-ever-click-once="disabled"
        :disabled="disabled"
        native-type="submit">{{ $t('登 录') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import staticVars from '@/store/staticvars.js'
import api from '@/auth/store/sessionapi'
import storage from '@/util/storage'
import i18n from '@/assets/locals/index'
import { JSEncrypt } from 'jsencrypt'
import CryptoJS from 'crypto-js'

const rules = {
  username: [
    { required: true, message: i18n.t('请输入用户名'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: i18n.t('请输入密码'), trigger: 'blur' }
  ]
}

export default {
  data () {
    return {
      disabled: false,
      logining: false,
      ruleForm2: {
        username: localStorage.getItem('devusername'),
        password: localStorage.getItem('devpassword'),
      },
      rules,
      checked: true,
      visible: false,
    }
  },
  created () {
    localStorage.removeItem('PASSWORD')
    if (this.checked) {
      this.ruleForm2.username = localStorage.getItem('USERNAME')
      this.ruleForm2.password = localStorage.getItem('encryPassword') ? this.jseDecode(localStorage.getItem('encryPassword')) : ''
    } else {
      this.ruleForm2.username = ''
      this.ruleForm2.password = ''
    }
    // todo先留着后面会补齐这块
    // var str = CryptoJS.enc.Utf8.parse('Aa111111!')
    // var base64 = CryptoJS.enc.Base64.stringify(str)
    // let a = this.jseEncode(base64)
    // console.log(a, 'dddd')
    // console.log(CryptoJS.MD5('Aa111111!').toString(), 'md222')
    // console.log(this.jseEncode('Aa111111'), 'encode')
    // console.log(this.jseDecode(this.jseEncode('Aa111111')), 'decode')
  },
  methods: {
    // / rsa+base64 解密(上线前要删掉,这是解密私钥)
    jseDecode (data) {
      let decoder = new JSEncrypt()
      let rsaPrivateKey = 'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAIc+xfiXhGiRaC6i+nK6nVisgRJEzqquq7ppn9nc50G+0nyU7e4W4+TBZfhmvBJwpIfQw9YEwOgLEHUql1lKxtoFpyRzfbeYXMTIWj9Cjn1TfKWJzNUK10YPZt8W3lOfzOQcaBeuPdBijunIYze6IKmjILjs1WF1uSaZwJNaXgFZAgMBAAECgYACbDdzqpMupFwvaa/+2iTzb7OoNh9Vo2dkIXxBlNl3rglrPee9Oh+++0/uUTjRQ79Ox4iajt89yOT0lFy9tr81Jc2VQkeMFVLZpddgO8NPmtvnN6D9sUZEvv1MBjm/skJVOqxHjgWPcEIzVELiNw2l/VSlq/tnR2DhNVuEnaNb4QJBAOdN7/x3ClIgdPRdqGjSKklTzKgMk2pe6RHBxpUOt1l5WXV0mLoiyTPjw9yL4C5n4CU1pzEhxpPv0hFAwcJkm90CQQCVr1MF5XP0CtGjymttPf0WemJcQQ76wTCrNapGHNHqTKzizmBcGBfLUBb+HJSdoeGza/DjJ1Y9xbabh6y1MxGtAkEAqz3ZCRj8TBb5XxyjnI7TfZwLrPI6hQqlFF9YbGwLs7MSVtGubEdqm/7otzPbEaAXopSZJdeykz1+UQWXLRqdBQJAf/WuWrcJhhGNn6CWb3/zkLi0xzrSrGhky6gH1QIkLVC45vcYBwKNrL/duAQExDC0OmbHOdjR7+LKNXEpoolyzQJBALg/rtdhAexD6SKlFVCIjkorzT4rv7BQ3Siupb051993v5JIAI03OUEcNQGTsMmcZPLF4Ad/8XYPlt9WGzlwgXQ='
      decoder.setPrivateKey(rsaPrivateKey)
      return decoder.decrypt(data)
    },
    jseEncode (data) {
      let encoder = new JSEncrypt()
      let rsaPublicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCHPsX4l4RokWguovpyup1YrIESRM6qrqu6aZ/Z3OdBvtJ8lO3uFuPkwWX4ZrwScKSH0MPWBMDoCxB1KpdZSsbaBackc323mFzEyFo/Qo59U3yliczVCtdGD2bfFt5Tn8zkHGgXrj3QYo7pyGM3uiCpoyC47NVhdbkmmcCTWl4BWQIDAQAB'
      encoder.setPublicKey(rsaPublicKey)
      return encoder.encrypt(data)
    },
    handleSubmit2 (ev) {
      storage.setLocalStorage('USERNAME', this.ruleForm2.username)
      if (this.checked) {
        localStorage.setItem('encryPassword', this.jseEncode(this.ruleForm2.password.toString()))
      }
      storage.removeSessionStorage('outpatientUrlParams')
      const _self = this
      this.$refs.ruleForm2.validate(async (valid) => {
        if (valid) {
          _self.logining = true
          let params = {
            name: this.ruleForm2.username,
            password: CryptoJS.MD5(this.ruleForm2.password).toString(),
            version: staticVars.version
          }
          let results = await api.loginRSA(params)
          if (!results || !results.head || results.head.errCode !== 0) {
            _self.logining = false
            // 需要修改密码的code
            if (results.head.errCode === 991100) {
              this.visible = true
            }
            return
          }
          // 登录已经完成，此时直接进入到当日患者界面，执行完成之后，将这个值清除掉
          storage.setLocalStorage('_loginDone', 1)
          storage.setStorageByClinic('TOKEN', results.data.token)
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
