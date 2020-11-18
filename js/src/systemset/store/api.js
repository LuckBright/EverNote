import axios from '@/util/http'
import { diction } from '@/store/common'
// const CancelToken = axios.CancelToken
// let source = ''
const url = diction.api
let api = axios.create({
  baseURL: url
})
api.interceptors.request.use(function (config) {
  if (!config.data) {
    config.data = {}
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

api.interceptors.response.use(function (response) {
  if (!response) {
    return Promise.reject()
  }
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data
})

// 同步医嘱

function inspectBatchService (data) {
  return api.post('/thc-data/sob/service/inspectBatch', data)
}

// 人员同步接口

function syncStaffToThird (data) {
  return api.post('/thc-platform-core/out/staff/syncStaffToThird', data)
}

// 科室同步接口

function syncDeptToThird (data) {
  return api.post('/thc-platform-core/out/subject/syncDeptToThird', data)
}

export default {
  inspectBatchService,
  syncStaffToThird,
  syncDeptToThird
}
