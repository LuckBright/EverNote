
import axios from '@/util/http'
import {diction} from '@/store/common'
const url = diction.api + '/sob/'

var sob = axios.create({
  baseURL: url,
  withCredentials: true
})

var getReg = /^get\w*Info/
var listReg = /^get\w*List/
var regs = [
  {
    reg: getReg,
    method: 'get'
  },
  {
    reg: listReg,
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
sob.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
sob.interceptors.response.use(function (response) {
  var url = response.config.url

  var method = getMethodType(url)
  var emptyResonse = method === 'list' ? [] : {}
  if (response.data.head.errCode !== 0) {
    return emptyResonse
  }

  // if (response.data.totalCount) {
  //   return {
  //     totalCount: response.data.totalCount,
  //     list: response.data.data.resultList
  //   }
  // }
  // var data = response.data.data.resultList || response.data.data
  return response.data
})

export {sob}
