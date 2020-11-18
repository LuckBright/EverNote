
import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api + '/BI/'
const url2 = diction.api

let bi = axios.create({
  baseURL: url
})
let bi2 = axios.create({
  baseURL: url2
})
bi.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

bi.interceptors.response.use(function (response) {
  if (response.config.method === 'post') {
    if (response.data.head.errCode === 0) {
      // Notification.success('操作成功')
    }
  }
  return response.data
})

bi2.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

bi2.interceptors.response.use(function (response) {
  return response.data
})

export { bi, bi2, diction }

