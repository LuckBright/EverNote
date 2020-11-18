import axios from '@/util/http'
import {diction} from '@/store/common'
import storage from '@/util/storage'

const inpatientUrl = diction.api
let inpatient = axios.create({
  baseURL: inpatientUrl,
  withCredentials: true
})

inpatient.interceptors.request.use(config => {
  const TICKET = storage.getStorageByClinic('x-ticket-code')
  if (!config.data) {
    config.data = {}
  }
  if (TICKET) {
    config.headers['x-ticket-code'] = TICKET
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

inpatient.interceptors.response.use(function (response) {
  if (response) {
    if (!response.data.data) {
      response.data.data = {}
      return response.data
    }
    if (response.data.totalCount) {
      return {
        totalCount: response.data.totalCount,
        list: response.data.data.resultList || response.data.data
      }
    }
    if (!response.data.totalCount) {
      return response.data
    }
    let data = response.data.data.resultList || response.data.data
    return data
  }
})

inpatient.CancelToken = axios.CancelToken

export {inpatient}
