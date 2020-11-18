import axios from '@/titancare/utils/http'
import { diction } from '@/store/common'
// import { prefix } from '@/titancare/utils/urls.js'

const baseURL = `${diction.api}`
let base = axios.create({
  baseURL,
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

base.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

base.interceptors.response.use(function (response) {
  var url = response.config.url
  var method = getMethodType(url)
  var emptyResonse = method === 'list' ? [] : {}
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
}, err => {
  if (err && err.response && err.response.status === 401) {
    if (window.location.host.indexOf('192.168.') === -1) {
      if (window.location.hostname !== 'localhost') {
        return window.open(`${window.location.origin}/web/#/login`, '_self')
      }
    }
  }
  return Promise.reject(err)
})
base.CancelToken = axios.CancelToken
export { base }
