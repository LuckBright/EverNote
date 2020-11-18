import { phr as axios, purl } from '../api'
const url = 't02OutpatientVisit/v3.2/'
const durl = 't03diagnosis/v3.2/'

// 查询历史视图
function list (params) {
  return axios.post(url + 'searchByCondition', params)
}
function create (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function del (params) {
  return axios.get(url + 'delete', { params: params })
    .then((response) => {
      return response
    })
}

// 查询诊断信息 住院
function getInDiagInfo (params) {
  return axios.post(durl + 'getInDiagInfo', params)
}
// 查询诊断信息 门诊
function getOutDiagInfo (params) {
  return axios.post(durl + 'getOutDiagInfo', params)
}
// 病历信息
function getmedicalInfo (params) {
  return axios.post(purl + 'medicalRecord/getOutPatientMedicalRecordByVisitId', params)
}
// 其他医嘱
function getTreatItem (params) {
  return axios.post('t05Treatment/v3.2/getHisTreatmentByVisitSn', params)
}
// 其他医嘱
function getdocOrder (params) {
  return axios.post('t22OtherAdvice/v3.2/getHisOtherAdviceByVisitSn', params)
}
// 检查医嘱信息
function getExamItem (params) {
  return axios.post('t11Examine/v3.2/getHisExamineByVisitSn', params)
}
// 检验医嘱信息
function getInspItem (params) {
  return axios.post('t12Inspect/v3.2/getHisInspectByVisitSn', params)
}
// 费用信息 门诊
function costoutInfo (params) {
  return axios.post('csSettlement/v3.2/getByVisitSn', params)
}
// 费用信息 住院
function costinInfo (params) {
  return axios.post('ipSettlement/v3.2/getByVisitSn', params)
}
// 用药医嘱 门诊
function getOutDrug (params) {
  return axios.post('t04drug/v3.2/getOutDrugInfo', params)
}
// 用药医嘱 住院
function getInDrug (params) {
  return axios.post('t04drug/v3.2/getInDrugInfo', params)
}
// 手术
function getOperation (params) {
  return axios.post('t09SurgeryNotice/v3.2/getHisSurgeryByVisitSn', params)
}
// 病历文书
function getMedicalRecord (params) {
  return axios.post(purl + 'medicalRecord/getHisMedicalRecord', params)
}
export default {
  list,
  create,
  del,
  getInDiagInfo,
  getOutDiagInfo,
  getmedicalInfo,
  getTreatItem,
  getdocOrder,
  getExamItem,
  getInspItem,
  costoutInfo,
  costinInfo,
  getOutDrug,
  getInDrug,
  getOperation,
  getMedicalRecord
}
