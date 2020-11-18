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

// 根据机构，获取科室
function getTenantSubjectListByCondition (params) {
  return api.post('/thc-platform-core/out/subject/getTenantSubjectListByCondition', params)
}

function getStaffListByCondition (data) {
  return api.post('/thc-platform-core/out/staff/getStaffListByCondition', data)
}
function queryService (data) {
  return api.post('/sob/service/queryService', data)
}
function getSurgeryTaskList (data) {
  return api.post('/sob/surgeryExecute/getSurgeryTaskList', data)
}

function getSurgeryExecuteList (data) {
  return api.post('/sob/surgeryExecute/getSurgeryExecuteList', data)
}

// 根据id查询手术安排信息
function getSurgeryExecuteById (data) {
  return api.post('/sob/surgeryExecute/getSurgeryExecuteById', data)
}

// 根据id更新手术安排信息
function updateSurgeryExecuteById (data) {
  return api.post('/sob/surgeryExecute/updateSurgeryExecuteById', data)
}

// 根据科室查询房间
function getRoomListByParam (data) {
  return api.post('/thc-platform-core/out/room/getRoomListByParam', data)
}

// 根据房间查询排班
function searchTimesliceByService (params) {
  return api.get('/arrange/appoint/arrangeInstance/searchTimesliceByService', {params})
}
// 手术安排
function arrangeSurgery (data) {
  return api.post('/sob/surgeryExecute/arrangeSurgery', data)
}
// 取消手术安排
function cancelArrangeSurgery (data) {
  return api.post('/sob/surgeryExecute/cancelArrangeSurgery', data)
}

// 手术交接
function handover (data) {
  return api.post('/sob/surgeryExecute/handoverSurgery', data)
}
// 手术交接
function getByPatientId (patientId) {
  return api.get(`/c-union/doctor/member/getByPatientId?patientId=${patientId}`)
}

export default {
  getByPatientId,
  handover,
  cancelArrangeSurgery,
  arrangeSurgery,
  searchTimesliceByService,
  getRoomListByParam,
  updateSurgeryExecuteById,
  getSurgeryExecuteById,
  getSurgeryExecuteList,
  getSurgeryTaskList,
  getTenantSubjectListByCondition,
  getStaffListByCondition,
  queryService
}
