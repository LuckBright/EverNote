import axios from '@/titancare/util/http'
// import { Notification } from 'element-ui'
import { diction } from '@/store/common'
import moment from 'moment'
import storage from '@/util/storage'

const drugUrl = diction.api
var drug = axios.create({
  baseURL: drugUrl,
  withCredentials: true
})

var getReg = /^get\w*Info$/i
var listReg = /^get\w*List$/i
var stockReg = /^get\w*Stock$/i
var queryReg = /^query\w*List$/i
var regs = [
  {
    reg: getReg,
    method: 'get'
  },
  {
    reg: queryReg,
    method: 'list'
  },
  {
    reg: listReg,
    method: 'list'
  },
  {
    reg: stockReg,
    method: 'list'
  }
]

function getMethodType (url) {
  url = url.split('/').filter(v => v).pop()
  for (let i in regs) {
    if (regs[i].reg.test(url)) {
      return regs[i].method
    }
  }
}

drug.interceptors.request.use(config => {
  const IHTENANTID = storage.getLocalStorage('IHTENANTID')
  if (IHTENANTID && config.url && config.url.indexOf('api-ih') > -1) {
    config.headers['x-tenant-id'] = IHTENANTID
  }
  if (!config.data) {
    config.data = {}
  }
  if (config.url && config.url.indexOf('api-ih') > -1) { // 互联网接口要求，单独在headers加上x-channel:GLOBAL-PLATFORM-MANAGEMENT
    config.headers['x-channel'] = 'GLOBAL-PLATFORM-MANAGEMENT'
  }
  if (config.data.enableDate || config.data.disableDate) {
    config.data.enableDate = config.data.enableDate ? moment(config.data.enableDate).hours(0).minutes(0).seconds(0).valueOf() : ''
    config.data.disableDate = config.data.disableDate ? moment(config.data.disableDate).hours(23).minutes(59).seconds(59).valueOf() : ''
  }
  if (config.data.startDate || config.data.endDate) {
    config.data.startDate = config.data.startDate ? moment(config.data.startDate).hours(0).minutes(0).seconds(0).valueOf() : ''
    config.data.endDate = config.data.endDate ? moment(config.data.endDate).hours(23).minutes(59).seconds(59).valueOf() : ''
  }
  if (config.data.startTime || config.data.endTime) {
    config.data.startTime = config.data.startTime ? moment(config.data.startTime).hours(0).minutes(0).seconds(0).valueOf() : ''
    config.data.endTime = config.data.endTime ? moment(config.data.endTime).hours(23).minutes(59).seconds(59).valueOf() : ''
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

drug.interceptors.response.use(function (response) {
  var url = response.config.url
  var method = getMethodType(url)
  var emptyResonse = method === 'list' ? [] : {}
  if (response.data.head.errCode !== 0) {
    // if (response.data.head.errCode !== 204) {
    //   // Notification.error(response.data.head.errMsg)
    //   return false
    // }
    return emptyResonse
  }

  if (!response.data.data) {
    return emptyResonse
  }
  if (response.data.totalCount) {
    return {
      totalCount: response.data.totalCount,
      list: response.data.data.resultList || response.data.data
    }
  }
  if (response.data.data.totalCount) {
    return {
      totalCount: response.data.data.totalCount,
      list: response.data.data.resultList
    }
  }
  var data = response.data.data.resultList || response.data.data
  return data
})

export { drug }
