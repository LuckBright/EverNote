import axios from 'axios'
import storage from '@/util/storage'
import { Notification } from 'element-ui'

const CancelToken = axios.CancelToken
function create (options) {
  let instance = axios.create(options)
  // 添加请求拦截器
  instance.interceptors.request.use(function (config) {
    // 发送请求前
    const TOKEN = storage.getLocalStorage('TOKEN')
    if (TOKEN) {
      config.headers['x-access-token'] = TOKEN
    }
    const TENANTID = storage.getLocalStorage('TENANTID')
    if (TENANTID) {
      config.headers['x-tenant-id'] = TENANTID
    }
    if (config['x-org-id']) {
      config.headers['x-org-id'] = config['x-org-id']
    } else if (config.headers['x-org-id']) {
      config.headers['x-org-id'] = config.headers['x-org-id']
    } else {
      const CLINICID = localStorage.getItem('CLINICID')
      if (CLINICID) {
        config.headers['x-org-id'] = CLINICID
      }
    }
    config.headers['x-channel'] = 'THC-PLATFORM-MANAGEMENT'
    return config
  }, function (err) {
    // 请求错误
    return Promise.reject(err)
  })
  // 添加响应拦截器
  instance.interceptors.response.use(function (response) {
    let responseData = response.data || null
    if (responseData.errCode === 401) {
      if (window.location.host.indexOf('192.168.') === -1) {
        if (window.location.hostname !== 'localhost') {
          showError(responseData.errCode, '认证超时，请重新登录', 'error')
          window.open(`${window.location.origin}/web/#/login`, '_self')
        }
      }
    }
    // 明修栈道暗度陈仓，切换互联网医院的接口到global接口 临时兼容数据机构
    if (responseData.head) {
      responseData.errCode = responseData.head.errCode
    }
    if (![0, 204, 1002, 401].includes(+responseData.errCode)) {
      if (window.location.hostname === 'localhost') {
        console.error('出错了：', response.request.responseURL, response)
      }
      showError(
        responseData.errCode,
        responseData.errMsg || '网络请求失败，请稍后再试'
      )
    }
    return response
  }, function (err) {
    return Promise.reject(err)
  })
  return instance
}
function showError (errCode, errMsg) {
  if (!showError.timer) {
    showError.timer = {}
  }
  let existTimer = showError.timer[String(errCode)]
  if (existTimer) {
    clearTimeout(existTimer)
  }
  showError.timer[String(errCode)] = setTimeout(() => {
    Notification.error(errMsg + '')
    // bus.$emit('onError')
  }, 1000)
}

export default {
  create,
  CancelToken
}
