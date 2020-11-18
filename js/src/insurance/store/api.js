import axios from '@/util/http'
// import { Notification } from 'element-ui'
import { diction } from '@/store/common'
const url = diction.api
var insurance = axios.create({
  baseURL: url,
  withCredentials: true
})

insurance.axiosCancel = {}
insurance.CancelToken = axios.CancelToken

function isWrite (url) {
  url = url.split('/').filter(v => v).pop()
  return (['create', 'update', 'delete'].indexOf(url) > -1) && ('dimensionRules/delete'.indexOf(url) === -1)
}
insurance.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  // 如果重复调用，就把原来的接口先取消
  let source = insurance.axiosCancel[config.url]
  if (source) source.cancel()
  // 然后生成新的，放进对象中
  source = insurance.CancelToken.source()
  insurance.axiosCancel[config.url] = source
  config.cancelToken = source.token
  return config
}, function (error) {
  return Promise.reject(error)
})

insurance.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  var url = response.config.url
  // 接口成功返回之后，把取消标志清除
  delete insurance.axiosCancel[url]
  if (isWrite(url) && response.data.head && response.data.head.errCode === 0) {
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

export default insurance
