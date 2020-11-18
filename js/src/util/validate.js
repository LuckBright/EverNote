export const MOBILE_PATRN = /^(0|86|17951)?(1[3456789])[0-9]{9}$/
const POSITIVE_INTEGER_PATRN = /^[0-9]*[1-9][0-9]*$/
const NON_NEGATIVE_INTEGER_PATRN = /^(0|[0-9]*[1-9][0-9]*)$/

const POSITIVE_FLOAT_PATRN = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
const EMAILL_PATTERN = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
export const CARD_ID_PATTERN = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
const TELAUTOGRAM_PATTERN = /^(\d{3,4})?\d{7,8}$/
const UNIFIED_SOCIAL_CREDIT_CODE = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/
const ENGLISH_NAME = /^([A-Za-z]+\s?)*[A-Za-z]{2,40}$/
export const CERTIFICATE_OF_PRACTICE = /^(?![a-zA-Z]+$)[0-9A-Za-z]{1,40}$/
const PASSPORT = /^[a-zA-Z0-9]{9}$/
const TAIWAN = /^[0-9]{8}$/
const ENGLIST_INTRODUCE = /[^\u4e00-\u9fa5]$/
// const PASSWORD_PATTERN = new RegExp(/^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&\(\)_=\.><,\/"'\{\}+\-*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&\(\)_=\.><,\/"'\{\}+\-*]+$)(?![\d!@#$%^&\(\)_=\.><,\/"'\{\}+\-*]+$)[a-zA-Z\d!@#$%^&\(\)_=\.><,\/"'\{\}+\-*]{8,20}$/)
const TELEPHONE = /^0\d{2,3}-?\d{7,8}$/
const TELEPHONE_MEMBER = /^0\d{2,3}-\d{7,8}$/
const NONNEGATIVE_INTEGER = /^[0-9]{1,10}$/
const URL_PATREN = /^(https?):\/\/.+$/
export const MOBILE_PATRN_MEMBER = /^1[3456789]\d+|-$/
import i18n from '@/assets/locals/index'

// ip地址正则表达式
// var ipReg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

/**
 * 金额精读(小数点后几位)
 * @returns {array || null}
 */
export const checkAmountIntensiveReading = function ({ num = 2, price }) {
  let reg = price.match(`^\\d*(\\.?\\d{0,${num}})$`)
  return reg
}

/**
 * 非负整数（正整数 + 0）
 * @param num
 * @returns {boolean}
 */
export const checkNonNegativeInteger = function (num) {
  return NONNEGATIVE_INTEGER.test(num)
}

/**
 * 手机号验证
 * @param phone
 * @returns {boolean}
 */
export const checkPhone = function (phone) {
  if (phone) {
    return MOBILE_PATRN.test(phone)
  } else {
    return false
  }
}

/**
 * 表单 -- url验证
 * 使用：
 * 1、import {validateURL} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateURL, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateURL = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: URL_PATREN,
    errMsg: i18n.t('网址不能为空'),
    errReqMsg: i18n.t('请输入正确的网址')
  }
  _ruleIsRequired(params)
}

/**
 * 表单 -- 手机号验证
 * 使用：
 * 1、import {validatePhone} from '@/util/common'
 * 2、phone: [{ required: true, validator: validatePhone, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validatePhone = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: MOBILE_PATRN,
    errMsg: i18n.t('手机号码不能为空'),
    errReqMsg: i18n.t('请输入11位数手机号码 例如：13012345678')
  }
  _ruleIsRequired(params)
}

/**
 * 表单 -- 固话验证
 * 使用：
 * 1、import {validateTelePhone} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateTelePhone, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateTelePhone = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: TELEPHONE,
    errMsg: '固话号码不能为空',
    errReqMsg: '请输入区号+号码，区号以0开头，3位或4位 0955-7777777'
  }
  _ruleIsRequired(params)
}

/**
 * 表单 -- 固话验证
 * 使用：
 * 1、import {validateMemberTelePhone} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateMemberTelePhone, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateMemberTelePhone = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: TELEPHONE_MEMBER,
    errMsg: '固话号码不能为空',
    errReqMsg: '请输入区号+号码，区号以0开头，3位或4位 0955-7777777'
  }
  _ruleIsRequired(params)
}

/**
 * 表单 -- 邮箱验证
 * 使用：
 * 1、import {validateEmail} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateEmail, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateEmail = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: EMAILL_PATTERN,
    errMsg: '',
    errReqMsg: '请输入正确的邮箱号码 例如：lisi@everjiannkang.com'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 身份证验证
 * 使用：
 * 1、import {validateCardId} from '@/util/common'
 * 2、idNo: [{ required: true, validator: validateCardId, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateCardId = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: CARD_ID_PATTERN,
    errMsg: '身份证号不能为空',
    errReqMsg: '请输入正确的身份证号码 如:330326197001019296(X)'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 传真验证
 * 使用：
 * 1、import {validateTelautogram} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateTelautogram, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateTelautogram = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: TELAUTOGRAM_PATTERN,
    errMsg: '传真号不能为空',
    errReqMsg: '请输入正确的传真号码 例如：51985125379'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 统一社会信用代码验证
 * 使用：
 * 1、import {validateCreditCodeTest} from '@/util/common'
 * 2、 let _this = this
 * let validateCreditCode = (rule, value, callback) => {
 *       validateCreditCodeTest(_this, rule, value, 'unifiedCode', supplierapi, callback)
 *     }
 * 3、phone: [{ required: true, validator: validateCreditCode, trigger: 'blur' }]
 * 4、无需添加参数
 */
export const validateCreditCodeTest = function (_this, rule, value, key, api, callback) {
  let params = {
    api,
    rule,
    value,
    key,
    callback,
    PATTERN: UNIFIED_SOCIAL_CREDIT_CODE,
    errMsg: '统一社会信用代码不能为空',
    errReqMsg: '请输入正确的统一社会信用代码 例如：91110113MA017BXN0G',
    callBackMsg: '您输入的统一信用代码重复，请重新输入',
    _this
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 英文名验证
 * 使用：
 * 1、import {validateEnglishName} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateEnglishName, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateEnglishName = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: ENGLISH_NAME,
    errMsg: '',
    errReqMsg: '请输入规范的英文名'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 英文介绍验证
 * 使用：
 * 1、import {validateEnglishIntroduce} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateEnglishIntroduce, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateEnglishIntroduce = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: ENGLIST_INTRODUCE,
    errMsg: '',
    errReqMsg: '请输入规范的英文描述'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 执业证书验证
 * 使用：
 * 1、import {validateCertified} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateCertified, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateCertified = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: CERTIFICATE_OF_PRACTICE,
    errMsg: '',
    errReqMsg: '请输入规范的证书编号，仅支持数字和字母录入'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 护照验证
 * 使用：
 * 1、import {validatePassPost} from '@/util/common'
 * 2、phone: [{ required: true, validator: validatePassPost, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validatePassPost = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: PASSPORT,
    errMsg: '',
    errReqMsg: '请输入正确的护照编号 例如：G28233515'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 台胞证验证
 * 使用：
 * 1、import {validateTaiWan} from '@/util/common'
 * 2、phone: [{ required: true, validator: validateTaiWan, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validateTaiWan = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: TAIWAN,
    errMsg: '',
    errReqMsg: '请输入正确的台胞证 例如：28233515'
  }
  _ruleIsRequired(params)
}
/**
 * 表单 -- 密码验证
 * 使用：
 * 1、import {validatePassword} from '@/util/validate'
 * 2、phone: [{ required: true, validator: validatePassword, trigger: 'blur' }]
 * 3、无需添加参数
 */
export const validatePassword = function (rule, value, callback) {
  let zimu = /[a-zA-Z]/
  let shuzi = /[\d]/
  let testzifu = /[~\!@#\$\%\^\&\*\(\)_\+\{\}\:\"\|\-\+\[\]\/\=\-\?\,\.\<\>]/
  if (zimu.test(value) && shuzi.test(value) && testzifu.test(value) && value.length < 21 && value.length > 7) {
    callback()
  } else {
    callback(new Error('密码为8-20位，必须包含字母、数字和特殊符号'))
  }
}

export const validateAge = function (rule, value, callback) {
  let params = {
    rule,
    value,
    callback,
    PATTERN: /^\d+$/,
    errMsg: '请输入正确的年龄',
    errReqMsg: '请输入正确的年龄'
  }
  _ruleIsRequired(params)
}
/**
 * ruleIsRequired               校验字段是否必填
 * @param data
 * @param data._this
 * @param data.value            输入值
 * @param data.rule             校验规则
 * @param data.key              接口key值
 * @param data.api              查询接口
 * @param data.PATTERN          校验正则
 * @param data.errMsg           必填错误信息
 * @param data.errReqMsg        输入错误提示信息
 * @returns {callback}
 */
function _ruleIsRequired (data) {
  data.errMsg = data.errMsg || '必填'
  data.errReqMsg = data.errReqMsg || '填写错误'
  if (data.rule.required) {
    if (!data.value) {
      return data.callback(new Error(data.errMsg))
    } else if (data.api) {
      const old = data._this['old' + data.key.substr(0, 1).toUpperCase() + data.key.substr(1)]
      if (!data.PATTERN.test(data.value)) {
        return data.callback(new Error(data.errReqMsg))
      } else if (data._this.objId && old === data.value) {
        return data.callback()
      } else {
        data.api.validation({ [data.key]: data.value }).then(res => {
          res && res === true ? data.callback() : data.callback(new Error(data.callBackMsg))
        })
      }
    } else {
      if (data.PATTERN.test(data.value)) {
        return data.callback()
      } else {
        if (data.value > data.rule.maxValue || data.value < data.rule.minValue) {
          return data.callback(new Error('请输入' + data.rule.minValue + '之间' + data.rule.maxValue + '的值'))
        } else {
          return data.callback(new Error(data.errReqMsg))
        }
      }
    }
  } else {
    if (data.value === '' || data.value === null) {
      return data.callback()
    } else {
      if (data.PATTERN.test(data.value)) {
        return data.callback()
      } else {
        if (data.value > data.rule.maxValue || data.value < data.rule.minValue) {
          return data.callback(new Error('请输入' + data.rule.minValue + '之间' + data.rule.maxValue + '的值'))
        } else {
          return data.callback(new Error(data.errReqMsg))
        }
      }
    }
  }
}

export const RuleIsRequired = _ruleIsRequired

export function validater (_this, value, key, msg, api, callback) {
  if (value === '') {
    callback(new Error('必填项'))
    return false
  }
  const old = _this['old' + key.substr(0, 1).toUpperCase() + key.substr(1)]
  if (_this.objId && old === value) {
    callback()
  } else {
    api.validation({ [key]: value }).then(res => {
      res === true ? callback() : callback(new Error(msg))
    })
  }
}
// 校验正整数
export function formCheckPositiveInt (rule, value, callback) {
  if (!rule.required && !value) {
    callback()
  } else {
    let patrn = POSITIVE_INTEGER_PATRN
    if (!patrn.test(Number(value))) {
      callback(new Error('请输入正整数'))
    } else if (rule.minValue && value < rule.minValue) {
      callback(new Error('请输入大于' + rule.minValue + '的数'))
    } else if (rule.maxValue && value > rule.maxValue) {
      callback(new Error('请输入小于' + rule.maxValue + '的数'))
    } else {
      callback()
    }
  }
}

// 校验非负整数
export function formCheckNonnegativeInt (rule, value, callback) {
  if (!rule.required && !value) {
    callback()
  } else {
    let patrn = NON_NEGATIVE_INTEGER_PATRN
    if (!patrn.test(value)) {
      callback(new Error('请输入非负整数'))
    } else if (rule.minValue && value < rule.minValue) {
      callback(new Error('请输入大于' + rule.minValue + '的数'))
    } else if (rule.maxValue && value > rule.maxValue) {
      callback(new Error('请输入小于' + rule.maxValue + '的数'))
    } else {
      callback()
    }
  }
}

export function formCheckFloat (rule, value, callback) {
  if (!rule.required && !value) {
    callback()
  } else {
    let patrn = POSITIVE_FLOAT_PATRN
    if (!patrn.test(value)) {
      callback(new Error('输入格式有问题'))
    } else if (rule.minValue && value < rule.minValue) {
      callback(new Error('请输入大于' + rule.minValue + '的数'))
    } else if (rule.maxValue && value > rule.maxValue) {
      callback(new Error('请输入小于' + rule.maxValue + '的数'))
    } else {
      callback()
    }
  }
}

export let validateIden = function (rule, value, callback) {
  if (!value) {
    callback()
  } else if (value && !CARD_ID_PATTERN.test(value)) {
    callback('身份证格式不正确')
  } else {
    callback()
  }
}

export let validatePassConfirm = function (rule, value, oldValue, callback) {
  if (!value) {
    callback(new Error('请再次输入密码'))
  } else if (value !== oldValue) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
