import {inpatient as axios} from './api'
const url = '/phr/doctor/'
const urlService = '/phr-service/doctor/'
const tchPhr = '/thc-phr/doctor/'

function createOrUpdate (params, code) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(`${url}${code}/${action}`, params)
}

function getByHosNumber (params, code) {
  return axios.post(`${url}${code}/getByHosNumber`, params)
}

function deleteById (params, code) {
  return axios.post(`${url}${code}/delete`, params)
}

function getAlert (params) {
  return axios.post(`${url}alert/getAlert`, params)
}

function getSurgical (name) {
  return axios.post(`${urlService}surgical/search`, {name: name})
}

function getPosition (id) {
  return axios.post(`${urlService}surgicalPosition/getBySurgicalId`, {surgicalId: id})
}

function getById (id, code) {
  return axios.post(`${url}${code}/getById`, {id: id})
}

function getAllAdviceList (params) {
  return axios.get(`${url}doctorAdvice/getByHospitalizedNumber`, {params: params}).then(result => {
    return result
  })
}

function getExecutedAdvices (params) {
  return axios.post(`${url}adviceExecute/getExecutedAdvices`, params).then(result => {
    return result
  })
}
// 费用清单
function getByIsEntrustInAndAdviceTypeIn (params) {
  return axios.post(`${url}adviceExecute/getByIsEntrustInAndAdviceTypeIn`, params).then(result => {
    return result
  })
}

// 查询医嘱
function getByIsEntrustInAndStatus (params) {
  return axios.post(`${url}doctorAdvice/getByIsEntrustInAndStatus`, params).then(result => {
    return result
  })
}

function queryHospitalAdviceByHospitalNumber (params) {
  return axios.post(`/sob/medicalOrder/queryHospitalAdviceByHospitalNumber`, params).then(result => {
    return result
  })
}

// 获取已提交医嘱
function getDoctorAdviceByMessage (params) {
  params = params || {}
  return axios.post('/sob/recipe/getRecipeAvailable', params).then(result => {
    return result
  })
}
// 检查(更改后的接口)
function getAllExamine (params) {
  return axios.post(`${tchPhr}examineView/listFinished`, params).then(result => {
    return result
  })
}
// 获取全部检验信息
function getAllInspection (params) {
  return axios.post(`${tchPhr}/inspection/getAll`, params).then(result => {
    return result
  })
}

// 门诊获取检查检验结果
function getByExec (params) {
  return axios.post(`${url}doctorAdvice/v3.3/getByExec`, params)
}

// 批量体温单的患者获取
function getAllPatient (params) {
  return axios.post('/medical-record/doctor/temperatureRecord/getAllPatient', params)
}
// 批量体温单的患者获取
function batchInsert (params) {
  return axios.post('/medical-record/doctor/temperatureRecord/batchInsert', params)
}

// 个人体温单历史
function getByVisitId (params) {
  // return axios.post('/medical-record/doctor/temperatureRecord/getByVisitId', params)
  // 1130改的体征录入新接口
  return axios.post('/medical-record/doctor/temperatureRecord/search', params)
}
// 根据日期返显
function getByCodeAndVisitId (params) {
  return axios.post('medical-record/doctor/medicalRecord/getByCodeAndVisitId', params)
}

// 修改病历打印状态
function modifyPrintState (params) {
  return axios.post('/medical-record/doctor/medicalRecord/updatePrintStatus', params)
}
// 修改病历打印状态
function mulBatchCreate (params) {
  return axios.post('/medical-record/doctor/medicalRecord/batchCreate', params)
}

function getSobConfigDetailById (params) {
  return axios.post('/sob/sobconfig/getSobConfigDetailById', params)
}

// 体征信息非标准曲线
function getSignChart (params) {
  return axios.post(`/medical-record/doctor/signsCurve/getData`, params)
}
// 体征信息标准曲线
// /childrenSignStandard/getData
function getStandardSignChart (params) {
  return axios.post(`/medical-record/doctor/childrenSignStandard/getData`, params)
}
// phr检验信息带基线
function getSignChartWithBaseLine (params) {
  return axios.post(`${tchPhr}inspection/chart`, params)
}
// 获取患者信息
function getPatientInfo (patientId) {
  return axios.get('/c-union/doctor/patient/getLessById?id=' + patientId)
}

export default {
  getPatientInfo,
  getSobConfigDetailById,
  getAllPatient,
  batchInsert,
  getByVisitId,
  getAllAdviceList,
  getExecutedAdvices,
  getByHosNumber,
  createOrUpdate,
  deleteById,
  getSurgical,
  getById,
  getAlert,
  getPosition,
  getByIsEntrustInAndAdviceTypeIn,
  getByIsEntrustInAndStatus,
  getAllExamine,
  getAllInspection,
  queryHospitalAdviceByHospitalNumber,
  getByExec,
  getByCodeAndVisitId,
  modifyPrintState,
  mulBatchCreate,
  getSignChart,
  getStandardSignChart,
  getSignChartWithBaseLine,
  getDoctorAdviceByMessage
}
