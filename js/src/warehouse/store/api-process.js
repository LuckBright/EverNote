
import axios from '@/util/http'
import {diction} from '@/store/common'

const warehouseUrl = diction.api + '/process/'
var progress = axios.create({
  baseURL: warehouseUrl,
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

progress.interceptors.request.use(config => {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

progress.interceptors.response.use(function (response) {
  var url = response.config.url
  var method = getMethodType(url)
  var emptyResonse = method === 'list' ? [] : {}

  if (!response.data.data) {
    return emptyResonse
  }
  if (response.data.totalCount) {
    return {
      totalCount: response.data.totalCount,
      list: response.data.data
    }
  }
  var data = response.data.data.resultList || response.data.data
  return data
})

export {progress}
