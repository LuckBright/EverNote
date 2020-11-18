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
  var emptyResonse = method === 'list' ? [] : {success: 0}
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
let axiosCancel = {}
sob.CancelToken = axios.CancelToken
/**
 * 取消同一个接口之前未回调的请求
 * @params.url        接口地址
 * @params.params     接口请求参数
 */
sob.cancelPost = async (url, params) => {
  try {
    let key = new Date().getTime()
    const res = await sob.post(url, params, {
      cancelToken: new sob.CancelToken(function executor (c) {
        if (!axiosCancel[url]) {
          axiosCancel[url] = {}
        }
        axiosCancel[url][key] = c
      })
    })
    if (axiosCancel[url]) {
      for (let item in axiosCancel[url]) {
        // 取消本次请求之前未回调的请求 阻断其他未返回结果的接口
        if (axiosCancel[url][item] && Number(item) < key) {
          axiosCancel[url][item]()
          delete axiosCancel[url][item]
        }
      }
      delete axiosCancel[url][key]
    }
    return res
  } catch (err) {
    return null
  }
}

export {sob}
