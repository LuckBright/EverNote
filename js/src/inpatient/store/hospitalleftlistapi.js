import {inpatient as axios} from './sobapi'

// 查询待入科患者列表
function getWaittingList (params) {
  return axios.post('/workbench/ipPatient/getWaittingList', params)
}

// 查询病区患者列表（护士站）
function getAreaPatientList (params) {
  return axios.post('/workbench/ipPatient/getAreaPatientList', params)
}
// 查询已出科患者列表（护士站）
function getAreaOutPatientList (params) {
  return axios.post('/workbench/ipPatient/getAreaOutPatientList', params)
}
// 查询我的患者列表（护士站）
function getDoctorInpatientList (params) {
  return axios.post('/workbench/ipPatient/getDoctorInpatientList', params)
}
// 查询科室患者列表（护士站）
function getProviderInpatientList (params) {
  return axios.post('/workbench/ipPatient/getProviderInpatientList', params)
}
function getListInfo (distribute, params) {
  return axios.post('/workbench/ipPatient/' + distribute, params)
}

export default {
  getWaittingList,
  getAreaPatientList,
  getAreaOutPatientList,
  getDoctorInpatientList,
  getProviderInpatientList,
  getListInfo
}
