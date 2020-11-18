import axios from './http'
import { diction } from '@/store/common'
// import { Loading } from 'element-ui'
// import router from '@/titancare/router'

let loading
// 使用Element loading-start 方法
// function startLoading () {
//   loading = Loading.service({
//     lock: true,
//     text: '加载中...',
//     background: 'rgba(0, 0, 0, 0.7)'
//   })
// }
// 使用Element loading-close 方法
function endLoading () {
  loading.close()
}
/**
 * 那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
 * 声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
 * 调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
 */
let needLoadingRequestCount = 0

// function showFullScreenLoading () {
//   if (needLoadingRequestCount === 0) startLoading()
//   needLoadingRequestCount++
// }

function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    setTimeout(_ => {
      endLoading()
    }, 300)
  }
}

const baseURL = diction.api + '/thc-platform-core/'
let base = axios.create({
  baseURL,
  withCredentials: true
})

base.interceptors.request.use(config => {
  if (!config.data) {
    config.data = {}
  }
  // showFullScreenLoading()
  return config
}, function (error) {
  return Promise.reject(error)
})

base.interceptors.response.use(function (response) {
  tryHideFullScreenLoading()
  if (response.data.data && response.data.data.totalCount) {
    return {
      totalCount: response.data.data.totalCount,
      list: response.data.data.resultList || response.data.data
    }
  }
  var data = (response.data.data && response.data.data.resultList) || response.data.data
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
