// import UCloudUFile from 'assets/ufile/ufile.js'
// import config from '@/titancare/store/config'
import moment from 'moment'
import { diction } from '@/store/common'
export * from './homemanagecommon'

// 时间格式化
// params :
//  date: 需要格式化的时间
//  formate:  时间格式正则
//  type: startDay | endDay
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

export const lgfixImgSrc = function (val) {
  if (val && val !== '') {
    if (val.indexOf('http') > -1) {
      return val
    } else {
      return diction.fileUrl2 + val
    }
  }
}

export function debounce (func, delay = 400) {
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

// 查找数组中存在的数据 返回索引
export const _findIndex = function (tableData, id, name) {
  name = name || 'id'
  let index = tableData.findIndex(item => {
    return item[name] === id
  })
  return index
}
