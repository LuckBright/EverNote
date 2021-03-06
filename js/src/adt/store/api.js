import axios from '@/util/http'
import { diction } from '@/store/common'
import storage from '@/util/storage'

const url = diction.api

var adt = axios.create({
  baseURL: url,
  withCredentials: true
})

adt.interceptors.request.use(config => {
  const TICKET = storage.getStorageByClinic('x-ticket-code')
  if (!config.data) {
    config.data = {}
  }
  if (TICKET) {
    config.headers['x-ticket-code'] = TICKET
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

adt.interceptors.response.use(function (response) {
  if (response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

adt.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}
adt.jsonToFormData = function (obj) {
  var data = new FormData()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}

let axiosCancel = {}
adt.CancelToken = axios.CancelToken
/**
 * 取消同一个接口之前未回调的请求
 * @params.url        接口地址
 * @params.params     接口请求参数
 */
adt.cancelPost = async (url, params) => {
  try {
    let key = new Date().getTime()
    const res = await adt.post(url, params, {
      cancelToken: new adt.CancelToken(function executor (c) {
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

export { adt }
