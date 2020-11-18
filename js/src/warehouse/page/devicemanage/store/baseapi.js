import axios from '@/util/http'
import { diction } from '@/store/common'

var base = axios.create({
  baseURL: diction.api,
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
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

export {base}
