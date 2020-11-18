import axios from '@/util/http'
import {diction} from '@/store/common'
const url = diction.api

var login = axios.create({
  baseURL: url,
  withCredentials: true
})

login.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

login.interceptors.response.use(function (response) {
  return response.data
})

export {login}
