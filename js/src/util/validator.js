import { checkPhone, RuleIsRequired } from './common'

const validator = {
  checkInteger (rule, value, callback) {
    var __msg = arguments[0]
    var reg = /^\d*$/
    if (!reg.test(value)) {
      __msg.message = '数字必须为大于0的正正数数'
      callback(new Error())
    } else {
      callback()
    }
  },
  checkMoney (rule, value, callback) {
    var __msg = arguments[0]
    var reg = /^\d+(\.\d{1,2})?$/
    if (!reg.test(value)) {
      __msg.message = '数字必须为大于0的正数，最多保留两位小数'
      callback(new Error())
    } else {
      callback()
    }
  },
  checkMobile (rule, value, callback) {
    let __msg = arguments[0]
    if (!checkPhone(value)) {
      __msg.message = '请输入正确的手机号码格式'
      callback(new Error())
    } else {
      callback()
    }
  },
  checkSMSCode (rule, value, callback) {
    let __msg = arguments[0]
    if (!/^\d{6}$/gi.test(value)) {
      __msg.message = '手机验证码为6位数字'
      callback(new Error())
    } else {
      callback()
    }
  },
  checkPositiveNumber (rule, value, callback) {
    let params = {
      rule,
      value,
      callback,
      PATTERN: /^[1-9]\d*(\.\d+)?$/,
      errReqMsg: '请输入正数 例如：1.23或10'
    }
    RuleIsRequired(params)
  }
}

export default validator
