import { arrange as axios } from './api'
const url = '/arrange/'
// const url2 = '/sob/'
const url2 = '/warehouse/'
// 班次列表
function list (params) {
  return axios.post(url + 'appointment/getAppointmentDayCntListZhuozheng/', params)
    .then(result => {
      return result
    })
}

function getArrangeResource (params) { // 获取 排班医生接口：支持多科室
  return axios.post(url + 'resourceArrange/getArrangeResource', params)
}

function getAppointmentById (params) {
  return axios.post(url + 'appointment/getAppointmentById', params)
}

function createAppoint (params) {
  return axios.post(url + 'appointment/savePatientAndCreateAppoinmet/', params)
}

function createNumber (params) {
  return axios.post(url + 'appointment/create/', params)
}

function getRuleConfigByKey (params) {
  return axios.post(url + 'ruleConfig/getRuleConfigByKey/', params)
}

function getAppointmentRuleConfig (params) {
  return axios.post(url + 'ruleConfig/getAppointmentRuleConfig', params)
}

function updateAppointmentRuleConfig (params) {
  return axios.post(url + 'ruleConfig/updateAppointmentRuleConfig', params)
}

function changeAppoint (params) {
  return axios.post(url + 'appointment/changeAppointment', params)
}

function addAppointment (params) {
  return axios.post(url + 'appointment/addAppointmentRecord/', params)
}

function createAppointWait (params) {
  return axios.post(url + 'appointment/creatWaitAppoint/', params)
}

// 获取机构和科室
function getOrgList (params) {
  return axios.post('/warehouse/clinic/getAllClinicSectionList/', params)
}

function getWarehouseDeptList (params) {
  return axios.post('/warehouse/localSectionRecord/getLocalSectionVoListForService/', params)
}

function getWarehouseResourceList (params) {
  return axios.post('/warehouse/staff/getStaffListByRelationType/', params)
}

function listServiceRange (params) {
  return axios.post(url + 'resourceArrange/getArrangeServiceList/', params).then((response) => {
    return response
  })
}

function confirmAppoint (params) {
  return axios.post(url + 'appointment/confirm/', params)
}

function cannelAppoint (params) {
  return axios.post(url + 'appointment/cancel/', params)
}

function cannelAppointRecord (params) {
  return axios.post(url + 'appointment/cancelRecord/', params)
}

function getWeeksCount (params) {
  return axios.post(url + 'appointment/getAppointmentDayCntListByDates/', params)
}

function getArrangeDepts (params) {
  return axios.post(url + 'resourceArrange/getArrangeDepts/', params)
}

function lockArrangeByParam (params) {
  return axios.post(url + 'resourceArrange/lockArrangeByParam/', params)
}

function changeWaitSort (params) {
  return axios.post(url + 'appointment/changeWaitAppointmentsSort/', params)
}

function getAppointToDate (params) {
  return axios.post(url + 'appointment/getResouceAppointmentDetaliByDate/', params)
}

function queryAppointList (params) {
  return axios.post(url + 'appointment/queryRecordList/', params)
}

function getNumberSource (params) {
  return axios.post(url + 'resourceArrange/getServiceArrangeCnt', params)
}

function getArrangeTime (params) {
  return axios.post(url + 'resourceArrange/getServiceTimeslieList', params)
}

function getArrangeResourceList (params) {
  return axios.post(url + 'resourceArrange/getCanAppointResourceArrangeList', params)
}

function getArrangeResourceItem (params) {
  return axios.post(url + 'resourceArrange/getArrangeResource', params)
}

function getLatestTimeslice (params) {
  return axios.post(url + 'appointment/getLatestTimesliceByAppointment', params)
}

function getNumberList (params) {
  return axios.post(url + 'appointment/queryList', params)
}

function getServicePrice (id, clinicId, feeType, insuranceOrgId) {
  let params = {
    clinicId: clinicId,
    data: [{ itemId: id }]
  }
  if (feeType) {
    params.feeType = feeType
  }
  if (insuranceOrgId) {
    params.insuranceOrgId = insuranceOrgId
  }
  return axios.post('/pricemanage/sale/priceQuery/getPrice', params)
}

function updatePatientInfo (params) {
  return axios.post('/c-union/doctor/patient/outpatientRegister', params)
}

function createRecordBookRcm (params) {
  return axios.post('/c-union/doctor/visitCard/saveOrderFromRegister', params)
}

function bindVisitCardNo (params) {
  return axios.post('/c-union/doctor/patient/changeVisitNo', params)
}

function bindVisitCardNoPay (params) {
  return axios.post('/c-union/doctor/visitCard/createVisitNoAndPay', params)
}

function cannelVisitCardNoPay (params) {
  return axios.post('/c-union/doctor/visitCard/deleteByOrderId', params)
}
function getVisitCardType (params) {
  return axios.get('/c-union/doctor/category/getAllVisitCardType', { params })
}

function getAppointmentSymptom (params) {
  return axios.post(url + 'appointmentSymptom/queryList', params)
}

function updateSymptom (params) {
  return axios.post(url + 'appointmentSymptom/saveOrUpdate', params)
}

function deleteSymptom (params) {
  return axios.post(url + 'appointmentSymptom/deleteById', params)
}

function getPatientDiscounts (params) {
  return axios.get('/market/doctor/memberCardBatch/getDiscounts', { params })
}

function getBasesetArrangeResource (params) {
  return axios.post(url + 'arrangeBaseset/getArrangeBasesetResourceDetailByParam', params)
}

function coutWeekArrangeImpactAppointment (params) {
  return axios.post(url + 'arrangeBaseset/coutWeekArrangeImpactAppointment', params)
}

function publishWeekArrange (params) {
  return axios.post(url + 'arrangeBaseset/publishWeekArrange', params)
}
// 号别规则
function search (params) {
  return axios.post(url + 'arrangeResourceService/search', params)
}

function getServiceOrderList (params) {
  return axios.post('/rcm/ar/accountbill/getBenAndCardHistory', params)
}

function getServiceSetList (params) {
  return axios.post('market/doctor/setmealOrder/getTaoCanHao', params)
}

function getDiagnosisList (params) {
  return axios.post(url + 'appointment/getPatientHisDiagnosis', params)
}

function getQueueList (params) {
  return axios.post(url + 'appointment/getDoctorAptCntList', params)
}

function getAppointSettlementInfo (params) {
  return axios.post(url + 'appointment/getAppointSettlementInfo', params)
}
function getDoctor (params) {
  return axios.post('/warehouse/staffRecord/getLocalSectionStaffRecordVoListForService/', params)
}
function getVisitTypes (params = {}) {
  return axios.post(`${url}enum/getVisitTypes`, params)
}

function getAppointSmsType (params) {
  return axios.post(url + 'ruleConfig/getAppointSmsType', params)
}

function setAppointSmsType (params) {
  return axios.post(url + 'ruleConfig/setAppointSmsType', params)
}
function getToDayAppointList (params) {
  return axios.post(url + 'appointment/queryTodayRecordList', params)
}
function appointValidate (params) {
  return axios.post(url + 'appointmentCondition/checkByCondition', params)
}
function registerPay (params) {
  return axios.post(url + 'appointmentPay/registerPay', params)
}
function registerNotPay (params) {
  return axios.post(url + 'appointmentPay/registerNotPay', params)
}
function refundRegisterPay (params) {
  return axios.post(url + 'appointmentPay/refundRegisterPay', params)
}
function refundRegisterNotPay (params) {
  return axios.post(url + 'appointmentPay/refundRegisterNotPay', params)
}
function getStaffInfo (params) {
  return axios.post(url2 + 'staff/getStaffInfo/', params)
}
function exportAppointList (params) {
  return axios.post(url + 'appointment/exportQueryList', params)
}
function getApolloValue (params) {
  return axios.post('/thc-platform-core/apollo/getValue', params)
}

export default {
  getVisitTypes,
  getDoctor,
  list,
  getOrgList,
  listServiceRange,
  getArrangeResourceList,
  createAppoint,
  createNumber,
  changeAppoint,
  addAppointment,
  createAppointWait,
  confirmAppoint,
  cannelAppoint,
  changeWaitSort,
  getWeeksCount,
  lockArrangeByParam,
  getAppointToDate,
  queryAppointList,
  getNumberSource,
  getArrangeTime,
  getLatestTimeslice,
  getNumberList,
  getServicePrice,
  updatePatientInfo,
  createRecordBookRcm,
  bindVisitCardNo,
  getVisitCardType,
  getArrangeDepts,
  cannelAppointRecord,
  getAppointmentSymptom,
  updateSymptom,
  deleteSymptom,
  getPatientDiscounts,
  getBasesetArrangeResource,
  getServiceOrderList,
  getWarehouseDeptList,
  getWarehouseResourceList,
  getServiceSetList,
  getDiagnosisList,
  getQueueList,
  getAppointSettlementInfo,
  getArrangeResourceItem,
  getAppointSmsType,
  setAppointSmsType,
  getToDayAppointList,
  appointValidate,
  registerPay,
  registerNotPay,
  refundRegisterPay,
  refundRegisterNotPay,
  getArrangeResource,
  coutWeekArrangeImpactAppointment,
  publishWeekArrange,
  getStaffInfo,
  getRuleConfigByKey,
  getAppointmentById,
  bindVisitCardNoPay,
  cannelVisitCardNoPay,
  search,
  getAppointmentRuleConfig,
  updateAppointmentRuleConfig,
  exportAppointList,
  getApolloValue
}
