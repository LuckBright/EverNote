import axios from '@/util/http'
import { isNull, isEmptyObject } from '@/util/common'
import { diction } from '@/store/common'

const host = diction.api
let api = axios.create({
  baseURL: host,
  withCredentials: true
})

api.interceptors.request.use(config => {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
  if (response) {
    if (response.data.totalCount) {
      return {
        totalCount: response.data.totalCount,
        list: response.data.data.resultList
      }
    }
    if (response.data.head.errCode === 0) {
      let data
      if (response.data.data) {
        if (Array.isArray(response.data.data) || Array.isArray(response.data.data.resultList)) {
          data = response.data.data.resultList || response.data.data
        } else {
          data = response.data.data.resultList || response.data.data
          data = (!isNull(data) && !isEmptyObject(data)) ? data : true
        }
      } else {
        data = response.data
      }
      return data
    } else {
      return null
    }
  }
})

api.CancelToken = axios.CancelToken

export { api }
