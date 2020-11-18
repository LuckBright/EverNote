import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api + '/c-union/doctor/'
const turl = diction.api + '/c-union/'
const purl = diction.api + '/c-union/'
const ourl = diction.gapi
const durl = diction.api
var crm = axios.create({
  baseURL: url
})
crm.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

crm.interceptors.response.use(function (response) {
  return response.data
})

crm.jsonToFormEncoded = function (obj) {
  var data = new URLSearchParams()
  for (var o in obj) {
    data.append(o, obj[o])
  }
  return data
}
let axiosCancel = {}
crm.CancelToken = axios.CancelToken
crm.notify = axios.notify
/**
 * 取消同一个接口之前未回调的请求
 * @params.url        接口地址
 * @params.params     接口请求参数
 */
crm.cancelPost = async (url, params) => {
  try {
    let key = new Date().getTime()
    const res = await crm.post(url, params, {
      cancelToken: new crm.CancelToken(function executor (c) {
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

export { crm, turl, purl, ourl, durl, diction }
