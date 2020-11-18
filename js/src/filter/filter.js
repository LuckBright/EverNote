import Vue from 'vue'
import moment from 'moment'
import ever from '@/store/common'
import { string2Array, dateFormat, formatLang, formatDiagnosis } from '@/util/common'
import i18n from '@/assets/locals/index'
import { lgfixImgSrc } from '@/titancare/utils/common'
import { setName } from '@/titancare/utils/fn'

// 格式化时间组件
Vue.filter('formatDateByExp', function (value, exp) {
  return dateFormat(value, exp)
})

function getDays (year) {
  let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
    days[1] = 29
  }
  return days
}
// 出生日期，年龄大于0岁的情况，展示年龄样式为xx岁，如1岁，小于一岁仅展示月和天、小时
// 填写出生日期的情况，不支持单独修改年龄月份等信息
// param time(生日)
Vue.filter('birthdayComputed', function (birthday, currentTime = Date.now(), defaultVal = '--', IntegerAge = 0) {
  if (moment(birthday).isValid() && moment(currentTime).isValid()) {
    if (moment(currentTime).diff(birthday) < 0) return defaultVal
    let obj = {}
    let current = {
      minute: moment(currentTime).minute(),
      hour: moment(currentTime).hour(),
      date: moment(currentTime).date(),
      month: moment(currentTime).month() + 1,
      year: moment(currentTime).year()
    }
    let birth = {
      minute: moment(birthday).minute(),
      hour: moment(birthday).hour(),
      date: moment(birthday).date(),
      month: moment(birthday).month() + 1,
      year: moment(birthday).year()
    }
    if (current.minute - birth.minute >= 0) {
      obj.minute = current.minute - birth.minute
    } else {
      obj.minute = current.minute - birth.minute + 60
      current.hour--
    }
    if (current.hour - birth.hour >= 0) {
      obj.hour = current.hour - birth.hour
    } else {
      obj.hour = current.hour - birth.hour + 24
      current.date--
    }
    if (current.date - birth.date >= 0) {
      obj.date = current.date - birth.date
    } else {
      let days = getDays(moment(birthday).year())
      obj.date = days[birth.month - 1] + current.date - birth.date
      current.month--
    }
    if (current.month - birth.month >= 0) {
      obj.month = current.month - birth.month
    } else {
      obj.month = current.month - birth.month + 12
      current.year--
    }
    obj.year = current.year - birth.year
    let str = ''
    if (obj.year > IntegerAge) {
      return obj.year + i18n.t('岁')
    } else if (obj.year !== 0) {
      str = obj.year + i18n.t('岁')
    }
    if (obj.month > 0 && obj.date > 0) return str + obj.month + i18n.t('月') + obj.date + i18n.t('天')
    if (obj.date === 0 && obj.month > 0) return str + obj.month + i18n.t('月')
    if (obj.date > 0 && obj.month === 0) {
      str = str + obj.date + i18n.t('天') + obj.hour + i18n.t('小时')
    }
    if (obj.year === 0 && obj.month === 0 && obj.date === 0 && obj.hour !== 0) {
      str = str + obj.hour + i18n.t('小时') + obj.minute + i18n.t('分钟')
    }
    if (!str) str = '1小时'
    return str
  } else {
    return defaultVal
  }
})

// 双语格式化 by lvjiangtao@everjiankang.com
// demo: {{option | formatLang}} {{option | formatLang('name', true)}}
// option 为当前一条数据的obj tip：不是obj.name
// 参数：obj: 默认值 不用传
// key 需要展示数据的字段名
// bilingual 是否显示两种语言的混排，true 混排， false 只显示一种语言（英文）
Vue.filter('formatLang', function (obj, key, bilingual) {
  return formatLang(obj, key, bilingual)
})
// 诊断格式化 展示诊断的地方，需显示成“英文诊断 中文诊断(备注)?” ，?为待查 和formatLang配合使用

Vue.filter('formatDiagnosis', function (obj, val) {
  return formatDiagnosis(obj, val)
})
// 数字转 财务计数法 （三位一逗号，后面两个零）
Vue.filter('formatToFinacial', function (money, n) {
  if (!money) {
    money = 0
  }
  money = parseFloat(money)
  let absicon = ''
  if (parseFloat(money) !== Math.abs(money) && money !== Math.abs(money) && money !== 0 && money !== '0.00') {
    absicon = '-'
  }
  if (n === 0) {
    money = parseFloat((money + '').replace(/[^\d.]/g, '')) + ''
  } else {
    if (!n) {
      n = 2
    }
    n = n > 0 && n <= 20 ? n : 2
    let arr = String(money).split('.')
    if (arr[1]) {
      if (arr[1].substring(n) && arr[1].substring(n) === '5') {
        money = money > 0 ? parseFloat(arr[0] + '.' + arr[1].substring(0, n)) + parseFloat(Math.pow(0.1, n).toFixed(n)) : parseFloat(arr[0] + '.' + arr[1].substring(0, n)) - parseFloat(Math.pow(0.1, n).toFixed(n))
      } else {
        money = money.toFixed(n)
      }
    } else {
      money = money.toFixed(n)
    }
    money = parseFloat((money + '').replace(/[^\d.]/g, '')).toFixed(n) + ''
  }
  var l = money.split('.')[0].split('').reverse()
  var r = money.split('.')[1] ? money.split('.')[1] : '00'
  var t = ''
  for (var i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? ',' : '')
  }
  let returnResult = t.split('').reverse().join('') + '.' + r
  if (returnResult === '0.00') {
    absicon = ''
  }
  return absicon + t.split('').reverse().join('') + '.' + r
})

Vue.filter('formatSex', function (value, defaultVal = '--') { // 添加null值为 --
  if (value === '0' || value === 0) {
    return '未知'
  } else if (value === '1' || value === 1) {
    return '男'
  } else if (value === '2' || value === 2) {
    return '女'
  } else if (value === '9' || value === 9) {
    return '未说明'
  }
  return defaultVal
})

Vue.filter('formatMoney', function (value) {
  if (value) {
    return parseFloat(value).toFixed(2)
  } else {
    return '0.00'
  }
})

// 修正打包传的域名后面斜杠的问题，给图片设置默认图片的filter
// by lvjiangtao@everjiankang.com.cn
// 参数 type 类型/场景
//  1：上传头像  2：上传文件  3：？？ 4：上传doc??  5：商城默认图片
// demo <img :src="item.dataMap.productImages | fixImgSrc(5)"/>
//   <img :src="'' | fixImgSrc(5)" class="imgconatiner">
// fullUrl 是否全地址，新的对象存储返回完整地址，不用格式url
Vue.filter('fixImgSrc', function (picVal, type, fullUrl) {
  let _defaultImg = ''
  switch (type) {
    case 1:
      _defaultImg = 'static/assets/facebg.png'
      break
    case 2:
      _defaultImg = 'static/assets/uploadbg.png'
      break
    case 3:
      _defaultImg = 'static/assets/smile.png'
      break
    case 4:
      _defaultImg = 'static/assets/template.png'
      break
    case 5:
      _defaultImg = 'static/assets/mall.png'
      break
    default:
      _defaultImg = 'static/assets/avtarbg.png'
  }
  if (picVal) {
    if (fullUrl) {
      return picVal
    } else {
      if (picVal.split(',').length > 0) {
        picVal = picVal.split(',')[0]
      }
      var _imgHost = ever.imgurl
      if (_imgHost.charAt(_imgHost.length - 1) !== '/') {
        _imgHost += '/'
      }
      return _imgHost + picVal
    }
  } else {
    return _defaultImg
  }
})

// 这个filter 用途是：把后端一般返回的值 从一个枚举类里把对应的汉字查出来
// demo: {{ sow..rp.status| formateValueToName({
//    list: XXXList,
//    valueKey: 'id',
//    showKey: 'name',
//    defaultFnt: '',
//    separator: ','
// )}}
// demo ： {{ scope.row.status | formateValueToFnt({
//  list: FULL_STATE.outstock
// }) }}
// list： 枚举数据集合
// valueKey: 后端匹配的字段名（默认为id）
// showKey：需要展示的字段名（默认为name）
// defaultFnt： 如果没有匹配到显示的字符串（默认为'')
Vue.filter('formateValueToFnt', function (val, {
  list, valueKey = 'id', showKey = 'name', defaultFnt = '', separator = ','
}) {
  if (!Array.isArray(list)) {
    return '检查枚举值'
  }
  // 如果val是字符串数据或者本身就是数组string2Array会返回一个Array
  let _arr = string2Array(val)
  let _resArr = []
  _arr.forEach(item => {
    const current = list.find(data => String(data[valueKey]) === String(item))
    current && _resArr.push(current[showKey])
  })
  return _resArr.join(separator) || defaultFnt
})

// 金额数字转大写
Vue.filter('intToChinese', function (num) {
  let extend = ''
  num = parseFloat(num)
  if (num === 0) {
    return '零'
  }
  if (num < 0) {
    num = Math.abs(num)
    extend = '负'
  }
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(num)) return '数据非法'
  let unit = '仟佰拾亿仟佰拾万仟佰拾元角分'
  let str = extend + ''
  num += '00'
  let point = num.indexOf('.')
  if (point >= 0) num = num.substring(0, point) + num.substr(point + 1, 2)
  unit = unit.substr(unit.length - num.length)
  for (let i = 0; i < num.length; i++) {
    str += '零壹贰叁肆伍陆柒捌玖'.charAt(num.charAt(i)) + unit.charAt(i)
  }
  return str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(兆|万|亿|元)/g, '$1').replace(/(兆|亿)万/g, '$1').replace(/(京|兆)亿/g, '$1').replace(/(京)兆/g, '$1').replace(/(京|兆|亿|仟|佰|拾)(万?)(.)仟/g, '$1$2零$3仟').replace(/^元零?|零分/g, '').replace(/^负(元零|元|零)/g, '负').replace(/(元|角)$/g, '$1整')
})

// 格式化小数（去掉小数点后面的0）
Vue.filter('subZeroAndDot', function (num) {
  var _num = num.toString()
  var _tmp = _num.match(/\.\d+0+/)[0].replace(/0+$/, '')
  return parseFloat(_num.toString().replace(/\.\d+0+/, _tmp))
})

// titancare 中的filter

Vue.filter('lgfixImgSrc', function (val) {
  return lgfixImgSrc(val)
})

// 格式化性别
Vue.filter('formatSex2', function (value) { // 添加null值为 --
  if (value === '1' || value === 1) {
    return '男'
  } else if (value === '2' || value === 2) {
    return '女'
  } else {
    return '--'
  }
})
// 格式化时间组件
Vue.filter('formatDate', function (value, exp) {
  return dateFormat(value, exp)
})
// 通过出生日期计算年龄
Vue.filter('formatAge', function (value) {
  var birthday = new Date(value.replace(/-/g, '/'))
  var d = new Date()
  var age = (d.getFullYear() - birthday.getFullYear() - ((d.getMonth() < birthday.getMonth()) || (d.getMonth() === birthday.getMonth() && d.getDate() < birthday.getDate()) ? 1 : 0))
  return age
})

Vue.filter('formatSetName', function (value, data, showNew, other) {
  return setName(data, value, showNew, other)
})

// 格式化时间 显示为 几分钟前 几小时 几天
Vue.filter('timeset', function (time) {
  if (!time) {
    return ''
  }
  let newtime = moment(time)
  let nowtime = moment()
  let dura = nowtime.diff(newtime, 'minute')
  let lasttest = ''
  if (dura === 0) {
    lasttest = '刚刚'
  } else if (dura >= 1 && dura <= 60) {
    lasttest = dura + '分钟前'
  } else if (dura > 60 && dura <= 60 * 24) {
    lasttest = parseInt(dura / 60) + '小时前'
  } else {
    lasttest = moment(time).format('MM月DD日')
  }
  return lasttest
})

export default {}
