import axios from '@/titancare/utils/http'
import { diction } from '@/store/common'

const baseURL = `${diction.apiIh}`

const getInstance = () => {
  let base = axios.create({
    baseURL,
    withCredentials: true
  })

  base.interceptors.request.use(function (config) {
    if (!config.data) {
      config.data = {}
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  base.interceptors.response.use(function (response) {
    return response.data
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

  let axiosCancel = {}
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

  base.CancelToken = axios.CancelToken

  return base
}

export { getInstance }
