import axios from '@/util/http'
// import { Notification } from 'element-ui'
import { diction } from '@/store/common'

const drugUrl = diction.api
var base = axios.create({
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

base.interceptors.request.use(config => {
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
  if (response.data.head.errCode !== 0) {
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
      list: response.data.data.resultList || response.data.data
    }
  }
  var data = response.data.data.resultList || response.data.data
  return data
})

base.CancelToken = axios.CancelToken
let axiosCancel = {}
/**
 * 取消同一个接口之前未回调的请求
 * @params.url        接口地址
 * @params.params     接口请求参数
 */
base.cancelPost = async (url, params) => {
  try {
    let key = new Date().getTime()
    const res = await base.post(url, params, {
      cancelToken: new base.CancelToken(function executor (c) {
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
export { base }
