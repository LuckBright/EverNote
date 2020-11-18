import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api

var auth = axios.create({
  baseURL: url,
  withCredentials: true
})

auth.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

auth.interceptors.response.use(function (response) {
  return response.data
})

export { auth }
