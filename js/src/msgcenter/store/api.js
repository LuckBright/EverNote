import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api

var msg = axios.create({
  baseURL: url,
  withCredentials: true
})

msg.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

msg.interceptors.response.use(function (response) {
  if (response.data.data && response.data.data.totalCount) {
    response.data.totalCount = response.data.data.totalCount
  }
  return response.data
})

export { msg }
