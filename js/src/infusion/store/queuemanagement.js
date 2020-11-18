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

// 看诊队列
function getQueue (data) {
  return api.post('/thc-queue/doctor/queue/getQueue', data)
}

// 历史患者
function getHistoryQueue (data) {
  return api.post('/thc-queue/doctor/queue/getHistoricalPatientsByDoctorId', data)
}

// 叫号
function getQueueCall (data) {
  return api.post('/thc-queue/doctor/queue/call', data)
}

// 过号
function getQueueNext (data) {
  return api.post('/thc-queue/doctor/queue/next', data)
}
// 接诊
function receiveTriageQueueByStationId (data) {
  return api.post('/thc-queue/triageQueue/receiveTriageQueueByStationId', data)
}

// 快速接诊
function findPatientList (data) {
  return api.post('/thc-queue/doctor/queue/quickDiagnosis', data)
}

export default {
  getQueue,
  getQueueCall,
  getQueueNext,
  receiveTriageQueueByStationId,
  findPatientList,
  getHistoryQueue
}
