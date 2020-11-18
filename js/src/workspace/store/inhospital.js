import {workspace as axios} from './api'
// import moment from 'moment'
// import { Notification } from 'element-ui'

// 获取科室医生接口
function getStaffListByCondition (data) {
  return axios.post('/thc-platform-core/out/staff/getStaffListByCondition', data)
}

// 获取科室接口
function getTenantSubjectListByCondition (data) {
  return axios.post('/thc-platform-core/out/subject/getTenantSubjectListByCondition', data)
}

// 获取科室的模版id
function getTemplateByCode (data) {
  return axios.post('/medical-record/doctor/templateManage/getTemplateByCode', data)
}

// 获取诊断
function getFormData (data) {
  return axios.post('/medical-record/doctor/medicalRecord/getFormData', data)
}

// 收住院申请
function create (params) {
  return axios.post('/adt/doctor/apply/create', params)
}

// 获取医嘱信息
function getPatientHistoryDoctorAdviceAndDiagnosis (params) {
  return axios.post('/workbench/adverseDrugReactionController/getPatientHistoryDoctorAdviceAndDiagnosis', params)
}

// 查询物资列表
function queryService (params) {
  return axios.post('/sob/service/queryService', params)
}

// 动态查询收费项目
function queryServiceVariable (params) {
  return axios.post('/sob/service/queryServiceVariable', params)
}

// 不良药品-查询所有
function getAdverseDrugReaction (params) {
  return axios.post('/workbench/adverseDrugReactionController/getAdverseDrugReaction', params)
}

// 不良药品-根据 localMaterialId(批量)查询 物资list
function getSourceByLocalSettingListByIdsForService (params) {
  return axios.post('/warehouse/localSetting/getLocalSettingListForService/', params)
}

// 不良药品-新增/修改
function createAdverseDrugReaction (params) {
  return axios.post('/workbench/adverseDrugReactionController/createAdverseDrugReaction', params)
}

// 不良药品-批量删除
function delAdverseDrugReactionByIds (params) {
  return axios.post('/workbench/adverseDrugReactionController/delAdverseDrugReactionByIds', params)
}

// 不良药品-根据id查询
function getAdverseDrugReactionById (params) {
  return axios.post('/workbench/adverseDrugReactionController/getAdverseDrugReactionById', params)
}

export default {
  createAdverseDrugReaction,
  getPatientHistoryDoctorAdviceAndDiagnosis,
  delAdverseDrugReactionByIds,
  getAdverseDrugReactionById,
  queryService,
  getAdverseDrugReaction,
  getSourceByLocalSettingListByIdsForService,
  queryServiceVariable,
  getTenantSubjectListByCondition,
  getStaffListByCondition,
  getTemplateByCode,
  getFormData,
  create
}
