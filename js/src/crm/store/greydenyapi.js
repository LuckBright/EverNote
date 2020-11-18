import {crm as axios, durl} from './api'

// 创建灰名单
function create (params) {
  return axios.post(durl + '/c-union/doctor/patientGreyDeny/create', params)
}
// 编辑灰名单
function modify (params) {
  return axios.post(durl + '/c-union/doctor/patientGreyDeny/modify', params)
}
// 条件查询
function list (params) {
  return axios.get(durl + '/c-union/doctor/patientGreyDeny/search', { params: params })
    .then((response) => {
      return response
    })
}
// 查询详情
function getByPatientId (params) {
  return axios.get(durl + '/c-union/doctor/patientGreyDeny/getByPatientId', { params: params })
    .then((response) => {
      return response
    })
}
// 获取详情
function getById (params) {
  return axios.get(durl + '/c-union/doctor/patientGreyDeny/getById', { params: params })
    .then((response) => {
      return response
    })
}
// 按集团维度查询人员
function getStaffList (params) {
  return axios.post(durl + '/thc-platform-core/out/staff/getStaffListByCondition/', params)
}
// 停用规则
function stop (params) {
  return axios.post(durl + '/c-union/doctor/patientGreyDeny/terminate', params)
}
// searchfuzzy
function searchfuzzy (params) {
  return axios.get(durl + '/c-union/doctor/patient/searchFuzzy', { params: params })
    .then((response) => {
      return response
    })
}
export default {
  create,
  modify,
  list,
  getByPatientId,
  getById,
  getStaffList,
  stop,
  searchfuzzy
}
