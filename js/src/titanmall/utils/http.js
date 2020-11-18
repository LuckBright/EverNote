import axios from 'axios'
import { Notification } from 'element-ui'

function create (options) {
  let instance = axios.create(options)

  /**
   * 请求拦截器
   */
  instance.interceptors.request.use(
    function (config) {
      // 请求前操作
      let arr = config.url.split('/')
      let text = arr[arr.length - 2] + arr[arr.length - 1]
      const mallShopId = localStorage.getItem('MALLSHOPID')
      if (location.hostname === 'localhost') {
        if (text !== 'shoplist' && text !== 'shopcreate') {
          config.headers['x-mall-shop-id'] = mallShopId
        }
        config.headers['x-tenant-id'] = '5000'
      } else {
        if (text !== 'shoplist' && text !== 'shopcreate') {
          config.headers['x-mall-shop-id'] = mallShopId
        }
        config.headers['x-tenant-id'] = localStorage.getItem('TENANTID')
      }
      config.headers['x-access-token'] = localStorage.getItem('TOKEN')
      config.headers['x-org-id'] = localStorage.getItem('CLINICID')
      config.headers['x-tenant-id'] = localStorage.getItem('TENANTID')
      return config
    },
    function (error) {
      return Promise.reject(error)
    },
  )

  /**
   * 响应拦截器
   */
  instance.interceptors.response.use(
    function (response) {
      // 数据相应
      if (response.data.errCode === 0) {
        return response.data.data
      } else if (['401', '403', '901191', '901192'].includes(response.data.errCode)) {
        showError(response.data.errCode, response.data.errMsg)
        window.open(`${window.location.origin}/web/#/login`, '_self')
      } else if (response.config.responseType) {
        // 导出excel数据
        if (response.data.type.includes('json')) {
          showError('-1', '导出失败')
        } else {
          let obj = {
            data: response.data,
            fileName: response.headers['content-disposition'],
          }
          return obj
        }
      } else {
        showError(response.data.errCode, response.data.errMsg)
      }
    },
    function (error) {
      window.open(`${window.location.origin}/web/#/login`, '_self')
      return Promise.reject(error)
    },
  )
  return instance
}

/**
 * 错误弹框
 * @param {*} errCode
 * @param {错误信息} errMsg
 */
// eslint-disable-next-line no-unused-vars
function showError (errCode, errMsg) {
  if (!errMsg) { return }
  if (!showError.timer) {
    showError.timer = {}
  }
  let existTimer = showError.timer[String(errCode)]
  if (existTimer) clearTimeout(existTimer)
  showError.timer[String(errCode)] = setTimeout(() => {
    Notification.error(errMsg + '')
  }, 1000)
}

export default {
  create,
}
