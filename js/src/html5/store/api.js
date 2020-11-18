// c-nurse/nursing/getTemplateByCode
import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api

var html5 = axios.create({
  baseURL: url,
  withCredentials: true
})

html5.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

html5.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data[0]
})

export {html5}
