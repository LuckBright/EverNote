import axios from '@/util/http'
import {diction} from '@/store/common'
const url = diction.api
let CancelToken = axios.CancelToken
let pending = []
// 过滤参数
let removePending = (config) => {
  if (!config) return // 解决没有config报错
  if (!config.isfilter) {
    return false
  }
  for (let p in pending) {
    if (pending[p].u === `${config.url}&${config.method}`) {
      pending[p].f()
      pending.splice(p, 1)
    }
  }
}

var rcm = axios.create({
  baseURL: url,
  withCredentials: true
})

function isWrite (url) {
  url = url.split('/').filter(v => v).pop()
  return (['create', 'update', 'delete'].indexOf(url) > -1) && ('dimensionRules/delete'.indexOf(url) === -1)
}
rcm.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  removePending(config)
  config.cancelToken = new CancelToken((c) => {
    pending.push({ u: `${config.url}&${config.method}`, f: c })
  })

  return config
}, function (error) {
  return Promise.reject(error)
})

rcm.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  removePending(response.config)
  var url = response.config.url
  if (isWrite(url) && response.data.head && response.data.head.errCode === 0) {
    // if (response && response.data && response.data.data && response.data.data.tradeMsg && (response.data.data.tradeMsg === '生成二维码成功!' || response.data.data.tradeSuccess === false)) {

    // } else if (!response.data.data) {

    // } else {
    //   Notification.success(response && response.data && response.data.data && response.data.data.tradeMsg || '操作成功')
    // }
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

export default rcm
