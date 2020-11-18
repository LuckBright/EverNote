import axios from '@/util/http'
import { diction } from '@/store/common'
const residentUrl = diction.api
let resident = axios.create({
  baseURL: residentUrl,
  withCredentials: true
})
resident.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

resident.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

// 新生儿回显
function getNeonateById (data) {
  return resident.post('/workbench/ipNeonate/getNeonateById', data)
}

// 取消新生儿登记
function unregister (data) {
  return resident.post('/workbench/ipNeonate/unregister', data)
}

export default {
  getNeonateById,
  unregister,
}
