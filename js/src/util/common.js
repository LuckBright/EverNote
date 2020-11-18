import moment from 'moment'
import sysvalue from '@/warehouse/store/sysvalueapi'
import storage from '@/util/storage'
import diction from '@/store/common'
import {
  remove,
  find,
  concat,
  union,
  groupBy,
  unionBy,
  clone,
  sortBy,
  keyBy,
  intersection,
  intersectionBy,
  pullAllBy,
  isEqual,
  get,
  has,
  fromPairs
} from 'lodash'
export * from './print'
export * from './socket'
export * from './warehouseconfig'
export * from './validate'
export * from './rcmconfig'
export * from './csaconfig' // 手术麻醉配置文件
export * from './otherconfig'
export * from './floattool'
export * from './assignment'
export const objRemove = remove
export const objFind = find
export const objConcat = concat
export const objUnion = union
export const objGroupBy = groupBy
export const objUnionBy = unionBy
export const objClone = clone
export const objSortBy = sortBy
export const objKeyBy = keyBy
export const objIntersection = intersection // 两个数组比较 得出数组中一样的值
export const objIntersectionBy = intersectionBy // 两个对象比较 得出对象中一样的值
export const objPullAllBy = pullAllBy // 对比两个数组对象  删除其中一样的值
export const objIsEqual = isEqual
export const objHas = has
export const objFromPairs = fromPairs
export const objGet = get // 根据 object对象的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。
import { Notification } from 'element-ui'
import globalUrlMap from '@/login/store/globalurls'

/**
 * 数组排序
 * @param property        对比字段                  required
 */
export function compare (property) {
  return function (a, b) {
    var value1 = a[property]
    var value2 = b[property]
    return value1 - value2
  }
}

export function messageFn (_this, res, succText, errText) {
  if (res.head.errCode === 0) {
    _this.$message({
      message: `${succText}`,
      type: 'success'
    })
  } else {
    _this.$message.error(`${errText}`)
  }
}

/**
 * 消息提示
 * @param _this         组件this
 * @param type          主题  success/warning/info/error
 * @param title         消息title
 * @param msg           消息内容

 * demo:
 this.$messageTips(this, 'warning', '没有结算单数据，dyd')
 */
export function messageTips (
  _this,
  type,
  msg,
  title,
  duration = 2500,
  dangerouslyUseHTMLString,
  closeFn,
  position
) {
  msg = msg || '网络开小差了！请稍后重试'
  title = title || '提示'
  _this.$notify({
    title: title,
    message: msg,
    type: type,
    duration,
    position,
    dangerouslyUseHTMLString,
    onClose: function () {
      closeFn && closeFn()
    }
  })
}

export function debounce (func, delay = 200) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      return func.apply(this, args)
    }, delay)
  }
}

export function debounce1 (func, delay = 200) {
  let timer
  return function (...args) {
    return new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        resolve(func.apply(this, args))
      }, delay)
    })
  }
}
/**
 * 设置schema 表单disable属性
 *
 * @param {Array} arr  schema'中需要设置的字段name属性
 * @param {Array} schema
 * @param {Boolean} disabled  是否设置可编辑
 * @returns schema
 */
const disabledSchema = function disabledSchema (arr, schema, disabled) {
  arr.forEach(function (item) {
    let tem = schema.filter(v => v.name === item)[0]
    if (tem.props) {
      tem.props.disabled = disabled
    } else {
      tem.disabled = disabled
    }
  })
  return schema
}
/**
 * 装饰disableSchema
 *
 * @export
 * @param {Array} arr
 * @param {Array} schema
 */
export function setDisabled (arr, schema) {
  return disabledSchema(arr, schema, true)
}

export function unDisabled (arr, schema) {
  return disabledSchema(arr, schema, false)
}

/**
 * uCloud 文件下载
 * @param filename    文件名
 * @param bucketName  bucket name
 * @param done        回调函数
 */
export const uCloudDownload = function (filename, bucketName, done) {
  Notification({
    type: 'error',
    message: 'uCloud相关功能已经下线，请切换到新的对象存储'
  })
  console.log('uCloud相关功能已经下线，请切换到新的对象存储')
}

// 获取日期所在自然周的日期. by lvjiangtao@everjiankang.com
// 返回值：
//   [{weekDate:'周一 10/01',date:'2018-10-01'},{weekDate:'周二 10/02',date:'2018-10-02'}]
export const getWeekDates = function (time) {
  const weeksName = ['一', '二', '三', '四', '五', '六', '日']
  const weeks = 7
  let _time = time || new Date()
  let _arrDate = []
  for (let i = 0; i < weeks; i++) {
    _arrDate.push({
      weekDate:
        '周' +
        weeksName[i] +
        ' ' +
        moment(_time)
          .weekday(i)
          .format('MM/DD'),
      date: moment(_time)
        .weekday(i)
        .format('YYYY-MM-DD')
    })
  }
  return _arrDate
}
// 获取日期的自然周（周日开始，周六结束）by zhenghongtao@everjiankang.com
// 返回值：
//   [{weekDate:'周日 08/11',date:'2019-08-11'},{weekDate:'周一 08/12',date:'2019-08-12'}，{weekDate:'周六 08/17',date:'2019-08-17'}]
export const getCurrWeekDays = function (changedate) {
  let date = []
  let time = changedate || new Date()
  let _weekdaysShort = moment(time)._locale.weekdaysShort()
  let weekday = moment(time).day()
  for (let i = 0; i < _weekdaysShort.length; i++) {
    let day = moment(time).subtract(weekday - i, 'days')
    date.push({
      weekDate: day.format('MM/DD') + ' ' + _weekdaysShort[i],
      date: day.format('YYYY-MM-DD')
    })
  }
  return date
}
// 获取传日期之后的七天的日期（包括当前日期）by liuyi@everjiankang.com
// 返回值：
//   [{weekDate:'周一 10/01',date:'2018-10-01'},{weekDate:'周二 10/02',date:'2018-10-02'}]
export const getSevenDates = function (time) {
  const weeksName = ['一', '二', '三', '四', '五', '六', '日']
  const weeks = 7
  let _time = time || new Date()
  let _arrDate = []
  for (let i = 0; i < weeks; i++) {
    let day = moment(_time).subtract(0 - i, 'days')
    _arrDate.push({
      weekDate: '周' + weeksName[day.weekday()] + ' ' + day.format('MM/DD'),
      date: day.format('YYYY-MM-DD')
    })
  }
  return _arrDate
}

// 时间格式化 by xiongzhiqing@everjiankang.com.cn
// params :
//  date: 需要格式化的时间
//  formate:  时间格式正则
//  type: 开始 或 结束时间 (开始：00:00:00, 结束：23:59:59)
// 返回值：
//   格式化之后的字符串
export const dateFormat = function (date, format, type) {
  if (!date) {
    return '--'
  }
  format = format || 'YYYY-MM-DD HH:mm:ss'
  let time
  if (date) {
    if (type) {
      if (type === 'startDay') {
        date = moment(date).startOf('day')
      } else if (type === 'endDay') {
        date = moment(date).endOf('day')
      }
    }
    if (format === 'unix') {
      time = Number(moment(date))
    } else if (format === 'week') {
      time = moment(date).weeks()
    } else if (format === 'year') {
      time = moment(date).years()
    } else {
      time = moment(date).format(format)
    }
  } else {
    time = moment().format(format)
  }
  return time
}

/*
 * 删除对象中为假的字段
 * @param data {object} 删除对象
 * @return object
 */

export const delObjIsNull = function (data) {
  for (let key in data) {
    if (typeof data[key] === 'string') {
      data[key] = Trim(data[key])
    }
    if (!data[key] && typeof data[key] !== 'number') delete data[key]
  }
  return data
}

/**
 * 获取当月第一天到当前时间
 * @param obj (startDate, endDate)              需转换数据                  required
 * @return obj                                  转换后数据
 */
export const searchDateMoment = function (obj, day) {
  obj.startDate = moment()
    .startOf('month')
    .format('YYYY-MM-DD HH:mm:ss')
  obj.endDate = day
    ? moment()
      .add(day, 'days')
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
    : moment()
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
  return obj
}

/**
 * 获取保险过期状态（是否快到期，有骗保嫌疑）
 * @param obj (endDate)
 * @return boolean
 */
export const isInsuranceExpiring = function (endDate) {
  let _diff = moment(moment(new Date()) - moment(endDate)).valueOf()
  if (parseInt(_diff / (1000 * 3600 * 24)) < 30) {
    return true
  } else {
    return false
  }
}

export const Trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * 产品年龄显示
 * @param data   patient  object
 * @returns {*}
 */
export const ageShow = data => {
  let html = ''
  if (data && data.birthday) {
    if (data.age) {
      html = `${data.age}岁`
    } else {
      if (data.isMonth) html = `${data.isMonth}月`
      if (data.isDay) html += `${data.isDay}天`
      if (data.isHour && !data.isMonth) html += `${data.isHour}小时`
      if (!data.isMonth && !data.isHour && !data.isDay) html = `0天` // 月日天全为false
    }
  }
  return html
}

/**
 * 空对象判断
 * @param obj
 * @returns {boolean}
 */
export const isEmptyObject = function (obj) {
  for (let key in obj) {
    return !1
  }
  return !0
}

/**
 * 生成二维码支持中文
 * @param {string} str    待生成二维码的字符串
 * @returns out           处理过后的字符串
 */
export const utf16to8 = str => {
  let out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i)
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
    }
  }
  return out
}

/**
 * Create a random string
 *
 * @param len          string length
 * @param radix        radix < CHARS.length
 * @returns {string}
 */
export const randomString = (len, radix) => {
  const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
    ''
  )
  let chars = CHARS
  let uuid = []
  let i
  radix = radix || chars.length
  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * 指定区域外点击 触发回调
 * @param cname                   require           点击区域最外层dom class name
 * @param done                    require           区域外点击执行回调
 */
export const domClickHandle = (cname, done) => {
  try {
    document.addEventListener('click', function (e) {
      let classNameArr = []
      for (let item of e.path) {
        item.className && classNameArr.push(item.className)
      }
      if (!String(classNameArr).includes(cname)) {
        if (done) done()
      }
    })
  } catch (err) {
    console.log('domClickHandle:error', err)
  }
}

// 诊断格式化展示诊断的地方，需显示成“英文诊断 中文诊断(备注)?” ，?为待查 和formatLang配合使用
export const formatDiagnosis = (obj, val) => {
  let comment = ''
  let isChecked = ''
  if (val.comment) {
    comment = `(${val.comment})`
  }
  if (val.diagnoseType === 2) {
    isChecked = '?'
  }
  return obj + comment + isChecked
}

/**
// 双语格式化 by lvjiangtao@everjiankang.com
// demo: {{obj | formatLang}} {{obj | formatLang('name', true)}}
// obj 为当前一条数据的obj tip：不是obj.name
// 参数：obj: 默认值 不用传
// key 需要展示数据的字段名
// bilingual 是否显示两种语言的混排，true 混排， false 只显示一种语言（英文）
同filter/filter.js内的格式化方法。
 */
export const formatLang = (obj, key, bilingual) => {
  key = key || 'name'
  if (bilingual) {
    return (obj[`${key}En`] || '') + ' ' + (obj[key] || '')
  } else {
    if (obj[`${key}En`] && storage.getLocalStorage('LANG') === 'en') {
      return obj[`${key}En`] || ''
    } else {
      return obj[key] || ''
    }
  }
}

// 格式化boolean的值 如果是 1 显示为 '是' 如果是 0 显示未 '否'
export const formatBoolean = item => {
  if (item === 1 || item === '1') {
    return '是'
  } else {
    return '否'
  }
}

// string 是否是json
export const isJsonString = function (str) {
  try {
    if (typeof JSON.parse(str) === 'object' && str !== null) {
      return true
    }
    return false
  } catch (e) {
    return false
  }
}
/**
 *  图片本地下载
 * @param {*} selector      选择器，代表img标签
 * @param {*} name          保存图片名称，可选
 */
export const downloadIamge = function (selector, name) {
  var image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function () {
    var canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    var url = canvas.toDataURL('image/png')

    // 生成一个a元素
    var a = document.createElement('a')
    // 创建一个单击事件
    var event = new MouseEvent('click')

    // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
    a.download = name || '下载图片名称'
    // 将生成的URL设置为a.href属性
    a.href = url

    // 触发a的单击事件
    a.dispatchEvent(event)
  }
  image.src = document.querySelector(selector).src
}

export const conversionGetDPI = function () {
  var arrDPI = []
  if (window.screen.deviceXDPI) {
    arrDPI[0] = window.screen.deviceXDPI
    arrDPI[1] = window.screen.deviceYDPI
  } else {
    var tmpNode = document.createElement('DIV')
    tmpNode.style.cssText =
      'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden'
    document.body.appendChild(tmpNode)
    arrDPI[0] = parseInt(tmpNode.offsetWidth)
    arrDPI[1] = parseInt(tmpNode.offsetHeight)
    tmpNode.parentNode.removeChild(tmpNode)
  }
  return arrDPI
}

// px转mm
export const pxConversionMm = function (value) {
  // var inch = value / conversionGetDPI()[0]
  var cValue = value / 3.78
  return cValue
}

// mm转px
export const mmConversionPx = function (value) {
  // var inch = value / 25.4
  var cValue = value * 3.78
  return cValue
}

// 自动获取第一个错误元素得焦点
export const formAutofocus = function () {
  setTimeout(() => {
    var isError = document.getElementsByClassName('is-error')
    if (isError.length) {
      isError[0].querySelector('input').focus()
    }
  }, 1)
}
/**
 * 获取list中目标值
 * @param list 原list
 * @param value 根据value 获取
 * @param key 根据的value对应的key
 * @param destKey 目标key
 * @example 例如：已知 list = [{id: 1, name: '男'}, {id: 2, name: '女'}];
 * 现在要获取id为2时对应的name，可以使用该方法
 */
export const listDestValue = function (
  list,
  value,
  key = 'id',
  destKey = 'name'
) {
  if (value === null || value === undefined) {
    return ''
  }
  if (
    typeof list === 'object' &&
    Object.prototype.toString
      .call(list)
      .toLowerCase()
      .includes('array')
  ) {
    const destValue = list.find(item => item[key] === value)
    if (destValue) {
      return destValue[destKey]
    }
  }
  return ''
}

/**
 * treeNodes tree结构数据，opt 对应的key
 */
export const treeToList = function (treeNodes, opt) {
  if (!opt) {
    opt = {}
    opt.key = 'id'
    opt.parent = 'pid'
    opt.children = 'children'
  }
  var NodeList = []
  function appenChildren (nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i]
      // 如果没有上层节点那么就是根节点
      if (!node.hasParent) {
        node.Level = 0
        node[opt.parent] = 0
      }
      // 判断是否有子节点
      // console.log(node[opt.children].length, 'node[opt.children]')
      if (node[opt.children] && node[opt.children].length > 0) {
        // 所有子节点
        for (var k = 0; k < node.children.length; k++) {
          node[opt.children][k][opt.parent] = node[opt.parent]
          node[opt.children][k].Level = node.Level + 1
          node[opt.children][k].parentNode = node
        }
        appenChildren(node.children)
      } else {
        return []
      }
      if (node.hasOwnProperty('parentNode')) {
        delete node.parentNode
      }
      if (node.hasOwnProperty(opt.children)) {
        delete node[opt.children]
      }
      NodeList.push(node)
    }
  }
  appenChildren(treeNodes)
  return NodeList
}

/**
 * 通过集code和值val获取值name
 * @param {*} code
 * @param {*} val
 */
export const getSysValueName = async (code, val) => {
  if (!code || !val) return ''
  let itemsList = await sysvalue.listOnce(code)
  if (!itemsList || !itemsList.length) return ''
  let obj = find(itemsList, { id: val })
  let name = obj && obj.name ? obj.name : ''
  if (storage.getLocalStorage('LANG') === 'en') {
    name = obj && obj.nameEn ? obj.nameEn : ''
  }
  return name
}

// 计算两个时间差 by lvjiangtao@everjiankang.com
// 时间格式支持 YYYY-MM-DD hh:mm:ss
// date1 起始时间
// date2 截止时间，不传为 now()
// realDayFlag 是否计算到真实天数（7.12天）true，返回7.12天 false 返回7天2小时10秒 默认fasle
// demo：
// import { dateDiff } from '@/util/common'
//  let time = '2019-09-17 18:12:10'
//  let time1 = '2019-10-17 18:12:10'
//  console.log(dateDiff(time))
//  console.log(dateDiff(time, time1))
//  console.log(dateDiff(time, '', true))
export const dateDiff = function (date1, date2, realDayFlag) {
  date1 = new Date(date1).getTime()
  if (!date2) {
    date2 = new Date().getTime()
  } else {
    date2 = new Date(date2).getTime()
  }
  var date3 = Math.abs(date2 - date1)
  return dateDiffBymsecond(date3, realDayFlag)
}

// 有些后端会把时间差返回回来（可能是秒，也可能是毫秒）可以直接调用这个 接收参数单位为毫秒
export const dateDiffBymsecond = function (millisecond, realDayFlag) {
  var date3 = millisecond
  // 计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000))
  // 计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))
  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)

  let res
  if (realDayFlag) {
    // 将小时、分钟、秒 转换为天
    let hours1 = hours / 24
    let minutes1 = minutes / (24 * 60)
    let seconds1 = seconds / (24 * 60 * 60)
    res = days + hours1 + minutes1 + seconds1
  } else {
    res =
      (days ? days + '天' : '') +
      (hours ? hours + '小时' : '') +
      (minutes ? minutes + '分钟' : '') +
      (seconds ? seconds + '秒' : '')
  }
  return res
}

export const editorBaseOpts = {
  image: {
    resName: 'fileId',
    uploadURL: diction.api + '/' + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.prefix + globalUrlMap.phoneMapping.uploadAndCreatePhoneInfo.url,
    imgUrl: `${diction.fileUrl}${diction.filePath}`,
  },
  videoSignatureUrl: `${diction.api}/${globalUrlMap.tencentcloud.getUploadSignature.prefix}${globalUrlMap.tencentcloud.getUploadSignature.url}?type=thcVideo&tenantId=${storage.getStorageByClinic('TENANTID')}&className=`,
  videoPathName: '富文本编辑器',
  globalUrl: diction.fileUrl,
  tenantId: storage.getStorageByClinic('TENANTID'),
  api: `${diction.api}/`,
  token: storage.getStorageByClinic('TOKEN'),
}

const prefixSystem = '/form-engine/doctor/system/config/'
const queryParam = { pagesize: 100, offset: 1, status: 1 }
export const MEDICAL_EDITOR_OPTIONS = {
  valueSetApi: {
    url: 'thc-platform-core/valueSetItem/getValueSetItemByCode',
    codeKey: 'setCode',
    props: '{"id":"code"}'
  },
  systemInsert: [
    {
      type: 'Base',
      api: `${prefixSystem}patientInfo/search`,
      params: { ...queryParam }
    },
    {
      type: 'Diagnostic',
      api: `${prefixSystem}diagnose/search`,
      params: { ...queryParam }
    },
    {
      type: 'Paragraph',
      api: `${prefixSystem}paragraph/search`,
      params: { ...queryParam }
    },
    {
      type: 'Sign',
      api: `${prefixSystem}sings/search`,
      params: { ...queryParam }
    },
    {
      type: 'Other',
      api: `${prefixSystem}other/search`,
      params: { ...queryParam }
    },
    {
      type: 'Yanke',
      name: '眼科信息',
      api: `${prefixSystem}yanke/search`,
      params: { ...queryParam }
    },
    {
      type: 'Pinggu',
      name: '评估信息',
      api: `${prefixSystem}pinggu/search`,
      params: { ...queryParam }
    },
    {
      type: 'Shoushu',
      name: '手术信息',
      api: `${prefixSystem}shoushu/search`,
      params: { ...queryParam }
    }
  ]
}
export const editorParams = {
  templateName: '',
  element: '',
  editable: true,
  formTemplateId: '',
  templateId: '',
  pageSettings: {
    paperName: 'A4',
    paperWidth: 210,
    paperHeight: 297,
    portrait: true,
    pagePadding: []
  }
}
// 判断操作系统
export const detectOS = function () {
  var isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows')
  var isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel')
  if (isWin) {
    return 'Win'
  } else if (isMac) {
    return 'Mac'
  } else {
    return 'Win'
  }
}

// 初始化友盟统计方法
export const renderYoumeng = function () {
  // 友盟统计添加
  const script = document.createElement('script')
  // 该路径为点击统计代码后，页面中第一个 文字统计 script代码
  script.src = 'https://v1.cnzz.com/z_stat.php?id=1279117529'
  script.language = 'JavaScript'
  document.body.appendChild(script)
  // document.write(unescape('%3Cspan style="display:none" id="cnzz_stat_icon_1279117529"%3E%3C/span%3E%3Cscript src="https://v1.cnzz.com/z_stat.php%3Fid%3D1279117529" type="text/javascript"%3E%3C/script%3E'))
}

// 格式化IM聊天时间
export const imTimeFormat = (timestamp, mustIncludeTime) => {
  timestamp = timestamp * 1000
  // 当前时间
  var currentDate = new Date()
  var currentYear = currentDate.getFullYear()
  var currentMonth = currentDate.getMonth() + 1
  var currentDateD = currentDate.getDate()
  // 目标判断时间
  var srcDate = new Date(parseInt(timestamp))
  var srcYear = srcDate.getFullYear()
  var srcMonth = srcDate.getMonth() + 1
  var srcDateD = srcDate.getDate()
  // 结果
  var ret = ''
  // 要额外显示的时间分钟
  var timeExtraStr = mustIncludeTime ? ' ' + _formatDate(srcDate, 'hh:mm') : ''
  // 当年
  if (currentYear === srcYear) {
    var currentTimestamp = currentDate.getTime()
    var srcTimestamp = timestamp
    // 相差时间（单位：毫秒）
    var deltaTime = currentTimestamp - srcTimestamp
    // 当天（月份和日期一致才是）
    if (currentMonth === srcMonth && currentDateD === srcDateD) {
      if (deltaTime < 60 * 1000) { // 时间相差60秒以内
        ret = '刚刚'
      } else { // 否则当天其它时间段的，直接显示“时:分”的形式
        ret = _formatDate(srcDate, 'hh:mm')
      }
    } else { // 当年 && 当天之外的时间（即昨天及以前的时间）
      // 昨天（以“现在”的时候为基准-1天）
      var yesterdayDate = new Date()
      yesterdayDate.setDate(yesterdayDate.getDate() - 1)
      // 前天（以“现在”的时候为基准-2天）
      var beforeYesterdayDate = new Date()
      beforeYesterdayDate.setDate(beforeYesterdayDate.getDate() - 2)
      // 用目标日期的“月”和“天”跟上方计算出来的“昨天”进行比较，是最为准确的（如果用时间戳差值
      // 的形式，是不准确的，比如：现在时刻是2019年02月22日1:00、而srcDate是2019年02月21日23:00，
      // 这两者间只相差2小时，直接用“deltaTime/(3600 * 1000)” > 24小时来判断是否昨天，就完全是扯蛋的逻辑了）
      if (srcMonth === (yesterdayDate.getMonth() + 1) && srcDateD === yesterdayDate.getDate()) {
        ret = '昨天' + timeExtraStr // -1d
      } else if (srcMonth === (beforeYesterdayDate.getMonth() + 1) && srcDateD === beforeYesterdayDate.getDate()) { // “前天”判断逻辑同上
        ret = '前天' + timeExtraStr // -2d
      } else {
        // 跟当前时间相差的小时数
        var deltaHour = (deltaTime / (3600 * 1000))
        // 如果小于或等 7*24小时 并且是在本周范围内 就显示星期几
        if (isWeek(timestamp) && deltaHour <= 7 * 24) {
          var weekday = new Array(7)
          weekday[0] = '星期日'
          weekday[1] = '星期一'
          weekday[2] = '星期二'
          weekday[3] = '星期三'
          weekday[4] = '星期四'
          weekday[5] = '星期五'
          weekday[6] = '星期六'
          // 取出当前是星期几
          var weedayDesc = weekday[srcDate.getDay()]
          ret = weedayDesc + timeExtraStr
        } else { // 否则直接显示完整日期时间
          ret = _formatDate(srcDate, 'yyyy年M月d日') + timeExtraStr
        }
      }
    }
  } else { // 往年
    ret = _formatDate(srcDate, 'yyyy年M月d日') + timeExtraStr
  }
  return ret
}

const _formatDate = (date, fmt) => {
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return fmt
}

// 判断是否在本周
const isWeek = time => {
  let flag = true // 在本周
  // 当前时间
  var timestamp = Date.parse(new Date())
  var serverDate = new Date(timestamp)
  // 本周周日的的时间
  var sundayTiem = timestamp + ((7 - serverDate.getDay()) * 24 * 60 * 60 * 1000)
  var SundayData = new Date(sundayTiem)
  // 年
  var tomorrowY = SundayData.getFullYear()
  // 月
  var tomorrowM = (SundayData.getMonth() + 1 < 10 ? '0' + (SundayData.getMonth() + 1) : SundayData.getMonth() + 1)
  // 日
  var tomorrowD = SundayData.getDate() < 10 ? '0' + SundayData.getDate() : SundayData.getDate()
  // 本周周一的时间
  var mondayTime = timestamp - ((serverDate.getDay() - 1) * 24 * 60 * 60 * 1000)
  var mondayData = new Date(mondayTime)
  // 年
  var mondayY = mondayData.getFullYear()
  // 月
  var mondayM = (mondayData.getMonth() + 1 < 10 ? '0' + (mondayData.getMonth() + 1) : mondayData.getMonth() + 1)
  // 日
  var mondayD = mondayData.getDate() < 10 ? '0' + mondayData.getDate() : mondayData.getDate()
  // 当前时间
  var currentData = new Date(time)
  // 年
  var currentY = currentData.getFullYear()
  // 月
  var currentM = (currentData.getMonth() + 1 < 10 ? '0' + (currentData.getMonth() + 1) : currentData.getMonth() + 1)
  // 日
  var currentD = currentData.getDate() < 10 ? '0' + currentData.getDate() : currentData.getDate()
  var sundayDay = tomorrowY + tomorrowM + tomorrowD
  var mondayDay = mondayY + mondayM + mondayD
  var currentDay = currentY + currentM + currentD
  if (parseInt(currentDay) >= parseInt(mondayDay)) {
    if (parseInt(currentDay) <= parseInt(sundayDay)) {
      flag = true
    } else {
      flag = false
    }
  } else {
    flag = false
  }
  return flag
}

// 把json转成字符串，通常用来url传参
export const urlEncode = function (param, key, encode) {
  if (param == null) return ''
  var paramStr = ''
  var t = typeof (param)
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += '&' + key + '=' + ((encode === null || encode) ? encodeURIComponent(param) : param)
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i)
      paramStr += urlEncode(param[i], k, encode)
    }
  }
  return paramStr
}

// 打开手机端预览页面 by lvjiangtao (由于权限问题，不能完全模拟手机页面，暂无调用，)
export const prviewSimulationMobile = function (url, title = '互联网医院') {
  var iWidth = 400
  var iHeight = 600
  var iTop = (window.screen.height - 30 - iHeight) / 2
  var iLeft = (window.screen.width - 30 - iWidth) / 2 + 200
  window.open(url, title, 'height=' + iHeight + ',,innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no')
}

// 判断当前设备是pc还是手机
export const isPc = function () {
  let ua = navigator.userAgent
  let isWindowsPhone = /(?:Windows Phone)/.test(ua)
  let isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  let isAndroid = /(?:Android)/.test(ua)
  let isFireFox = /(?:Firefox)/.test(ua)
  let isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  let isPhone = /(?:iPhone)/.test(ua) && !isTablet
  let isPc = !isPhone && !isAndroid && !isSymbian
  return isPc
}

