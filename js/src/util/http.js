import axios from 'axios'
import store from '../store/index'
import bus from './eventbus'
import { Notification } from 'element-ui'
import { baseHost, isLocalHost } from '@/store/basehost'
import staticvars from '@/store/staticvars'

// import config from '@/store/config'
const CancelToken = axios.CancelToken
// 某些接口(登录及之前的接口) 请求的时候是不能带token 和 rid 的，过滤一下
function checkNoRequireAuth (url) {
  let urlArr = [
    'thc-platform-core/unify/getGlobalUrl/',
    'internal/tenant/getWebConfig',
    'keyValueInfo/getKeyValueInfosDetails/',
    'unify/userLoginNew',
    'unify/resetPasswordBytelephoneNumber',
    'unify/sendVerificationMsg',
    'unify/getVerificationMsg',
    'global-platform/internal/tenant/getWebConfig',
    'global-platform/tcm/tenant-it-data/getByTenantId',
    'thc-platform-core/unify/getEvnId/'
  ]
  let flag = false
  urlArr.forEach(item => {
    if (url.includes(item)) {
      flag = true
    }
  })
  return flag
}

// 把废弃接口提示出来，让大家切换 by lvjiangtao@everjiankang.com
function checkNeedChangeUrlArr (url) {
  let arr = [
    'staffRecord/getStaffRecordVoListForService',
    'localSectionRecord/getLocalSectionVoBySearch',
    'localSectionRecord/getLocalSectionVoListForService',
    'doctor/templateScopeCategory/getCategoryTree',
    'supplierLocal/getAllSupplierLocalProduct'
  ]
  let flag = false
  arr.forEach(item => {
    if (url.includes(item)) {
      flag = true
    }
  })
  return flag
}

function create (options) {
  let instance = axios.create(options)
  instance.interceptors.request.use(
    function (config) {
      if (window.location.hostname === 'localhost') {
        if (checkNeedChangeUrlArr(config.url)) {
          notify('error', '原接口' + config.url + '废弃,请尽快切换到平台新的接口', 30000, '提示')
        }
      }

      config.url = renderDebugUrl(config)
      let noNeedLoginFlag = checkNoRequireAuth(config.url)
      if (sessionStorage.getItem('x-rid') && !noNeedLoginFlag) {
        config.headers['x-rid'] = sessionStorage.getItem('x-rid')
      }
      if (localStorage.getItem('TOKEN') && !noNeedLoginFlag) {
        config.headers['x-access-token'] = localStorage.getItem('TOKEN')
      }
      if (localStorage.getItem('TENANTID')) {
        config.headers['x-tenant-id'] = localStorage.getItem('TENANTID')
      }
      if (localStorage.getItem('CLINICID')) {
        config.headers['x-org-id'] = localStorage.getItem('CLINICID')
      }
      if (localStorage.getItem('LANG')) {
        config.headers['lang'] = localStorage.getItem('LANG')
      }
      if (localStorage.getItem('x-user-ip')) {
        config.headers['x-user-ip'] = localStorage.getItem('x-user-ip')
      }
      if (options.channelType === 'api-ih') {
        config.headers['x-channel'] = 'THC-PLATFORM-MANAGEMENT'
      }
      store.commit('setPending', 1)
      return config
    },
    function (error) {
      store.commit('setPending', -1)
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    function (response) {
      store.commit('setPending', -1)
      // store.commit('setUpdating', response.headers['app-status'])
      // 100: 维护中，外部访问，后端接口，动作: 添加app-status头信息，所有接口返回 {'errURL':www.baidu.com} (测试数据可以修改)
      // 101: 维护中, 外部访问, 前端，动作: 添加app-status头信息，跳到维护页面
      // 110: 维护中，内部访问，后端接口，动作: 没有特殊动作，只添加app-status头信息
      // 111: 维护中，内部访问，前端，动作: 没有特殊动作，只添加app-status头信息
      let tenStu = String(response.headers['x-app-status'])
      store.commit('setTenantStatus', tenStu)
      if (tenStu === '100' || tenStu === '101') {
        window.location = staticvars.prefix + '/#/upgrade'
      }
      store.commit('setVersionHash', response.headers['version_info'])
      if (response.request.responseURL.includes('api-ih')) {
        response.data.head = {
          errCode: response.data.errCode,
          errMsg: response.data.errMsg
        }
      }
      if (!response || !response.data || !response.data.head) {
        notify('error', '网络请求失败，请稍后再试')
      } else {
        // 2000 login user's tenantId is null
        if ([901191, 901192, 2000].includes(+response.data.head.errCode)) {
          showError(response.data.head.errCode, '认证超时，或该账号已被其他设备注销，请重新登录', 'error')
          // 后端有些接口会莫名其妙的返回这些值，然后导致自动跳转到登录页，页面跳转了，日志看不到，所以打了补丁 by lvjiangtao@everjiankang.com
          if (!localStorage.getItem('debug')) {
            window.location = staticvars.prefix + '/#/login'
          } else {
            console.error(response, '接口错误触发返回登录逻辑')
          }
        } else {
          if (![0, 204, 901102, 903600, 991100, 300001].includes(+response.data.head.errCode)) {
            if (window.location.hostname === 'localhost') {
              console.error('出错了：', response.request.responseURL, response)
            }
            // 部分接口不需要提示
            if (response.request.responseURL.includes('/extend/patientHeadInfo')) {
              return
            }
            showError(
              response.data.head.errCode,
              response.data.head.errMsg,
              response.data.head.errShowType
            )
          }
        }
      }
      return response
    },
    function (error, res) {
      store.commit('setPending', -1)
      return Promise.reject(error)
    }
  )
  return instance
}

// http://api.dev4.everjiankang.com.cn/thc-platform-core/common/param/getClinicConfig/
// http://192.168.251.13:8080/thc-platform-core/common/param/getClinicConfig/
// 为了调试方便修改XX开头的请求转发到到后端开发机器 by lvjiangtao@everjiankang.com.cn
function renderDebugUrl (config) {
  let fullUrl = config.url
  // if (!fullUrl.includes('http://') || !fullUrl.includes('https://')) {
  //   if (!config.baseURL.endsWith('/') && !config.url.startsWith('/')) {
  //     fullUrl = config.baseURL + '/' + config.url
  //   } else if (config.baseURL.endsWith('/') && config.url.startsWith('/')) {
  //     fullUrl = config.baseURL + config.url.substring(1, config.url.length)
  //   } else {
  //     fullUrl = config.baseURL + config.url
  //   }
  // }
  if (isLocalHost()) {
    var debugArr = baseHost.debugHostList
    for (var i = 0; i < debugArr.length; i++) {
      if (fullUrl.includes(debugArr[i].postModel)) {
        let re = /\/\/([^/]+)/i
        fullUrl = fullUrl.replace(re, ('//' + debugArr[i].debugHost))
        fullUrl = fullUrl.replace('/api', '')
      }
    }
  }
  return fullUrl
}

function showError (errCode, errMsg, errShowType) {
  if (!errMsg) return
  if (!showError.timer) {
    showError.timer = {}
  }
  let existTimer = showError.timer[String(errCode)]
  if (existTimer) {
    clearTimeout(existTimer)
  }
  showError.timer[String(errCode)] = setTimeout(() => {
    notify(errShowType, errMsg)
    bus.$emit('onError')
  }, 1000)
}

function notify (type = 'warning', message, duration = 2500, title = '提示') {
  Notification({
    type,
    title,
    message,
    duration
  })
}
export default {
  create,
  CancelToken,
  notify,
  renderDebugUrl
}
