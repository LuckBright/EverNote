import { arrange as axios } from './api'
const url = '/arrange/'
const passurl = '/c-union/'
const thcurl = '/thc-platform-core/'
const insuranceurl = '/insurance/'
const soburl = '/sob/'

function list (params) {
  return axios.post(url + 'appointment/clinic/queryAppointDayBoard/', params)
}
function getAppointList (params) {
  return axios.post(url + 'appt/clinic/queryAppointDayBoard', params)
}
function getAppointStates (params) {
  return axios.get(url + 'enum/getApptStates/', {params})
}
function getOrgList (params) {
  return axios.post(thcurl + 'out/organization/getOrgListHasSubjectByCondition/', params)
}
function getOrgInfo (params) {
  return axios.post(thcurl + 'out/organization/getOrgListByIdList/', params)
}
function getArrangeDepts (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchDeptByDate/', {params})
}
function getArrangeService (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchServiceByDate/', {params})
}
function getArrangeResource (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchResourceByDate/', {params})
}

function getArrangeTimeslice (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchTimesliceByService/', {params})
}

function getOrganCity (params) {
  return axios.post(thcurl + 'out/organization/getOrgCityList/', params)
}
function getPaitentRepeats (params) {
  return axios.get(passurl + 'doctor/patient/getRepeats/', {params})
    .then(result => {
      return result
    })
}
function getAppointData (params) {
  return axios.post(url + 'appointment/getById/', params)
}
function createAppoint (params) {
  return axios.post(url + 'appt/clinic/asstAddAppointmet/', params)
}
function createRegister (params) {
  return axios.post(url + 'appointment/register/', params)
}
function createQuickRegister (params) {
  return axios.post(url + 'appointment/quickRegister/', params)
}

function createAppointRegister (params) {
  return axios.post(url + 'appointment/appoint/', params)
}
function updateAppointRegister (params) {
  return axios.post(url + 'appointment/changeAppoint/', params)
}
function updateAppoint (params) {
  return axios.post(url + 'appt/clinic/change/', params)
}
function changeAppoint (params) {
  return axios.post(url + 'appointment/apptToRegister/', params)
}
function cannelAppoint (params) {
  return axios.post(url + 'appointment/cancel/', params)
}
function confirmAppoint (params) {
  return axios.post(url + 'appt/clinic/confirm/', params)
}
function updateShowStyle (params) {
  return axios.post(url + 'appt/clinic/updateShowStyle/', params)
}
function createLockAppoint (params) {
  return axios.post(url + 'resourceLocking/createResourceLocking/', params)
}
function cancelLockAppoint (params) {
  return axios.post(url + 'resourceLocking/deleteResourceLocking/', params)
}
function getDoctorInfo (params) {
  return axios.post(url + 'resource/getDoctorInfoAndSliceRule/', params)
}
function getNumberTime (params) {
  return axios.post(url + 'appt/clinic/getLatestTimesliceByStarttime/', params)
}
function setEditor (params) {
  return axios.post(url + 'appt/clinic/setEditor/', params)
}
function deleteEditor (params) {
  return axios.post(url + 'appt/clinic/deleteEditor/', params)
}
function getOrderSet (params) {
  return axios.post('market/doctor/setmealOrder/selectOrderByPatient/', params)
}
function getUseRules (params) {
  return axios.post(url + 'appt/ruleUse/matchRuleConfg/', params)
}
function getServicePrice (clinicId, id, name, insuranceOrgId) {
  let params = {
    orgId: clinicId,
    scene: insuranceOrgId ? [insuranceOrgId] : [],
    itemList: [{ itemId: id, name, urgent: false }]
  }
  return axios.post('/pricemanage/pricing/query/sale', params)
}
function getPriceType (params) {
  return axios.post('/pricemanage/sale/priceQuery/getFeeTypePrice/', params)
}
function getServiceSetList (params) {
  return axios.post('market/doctor/setmealOrder/getTaoCanHao/', params)
}
function getPatientDiscounts (params) {
  return axios.get('market/doctor/memberCardBatch/getDiscounts/', { params })
}
function getSettlementInfo (params) {
  return axios.post(url + 'appointment/getAppointSettlementInfo/', params)
}
function getRcmData (params) {
  return axios.post('/rcm/ar/settlement/getSettlementByOrderId/', params)
}
function getDoctorArrangeInfo (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchServiceFrequencyByDate/', {params})
}
function getResourceList (params) {
  return axios.post(thcurl + 'out/staff/getStaffListByCondition/', params)
}
function isOpenScene (params) {
  return axios.post(url + 'ruleConfig/platform/getValue/', params)
}
function getChannelList (params) {
  return axios.get(passurl + 'doctor/memberChannel/searchTrees/', {params})
}
function getExecuteAppoint (params) {
  return axios.post(url + 'appt/advice-execute/queryList/', params)
}
function getPatientInfo (params) {
  return axios.get(passurl + 'doctor/member/getByPatientId', {params})
}
function getServiceItem (params) {
  return axios.post('/sob/service/queryService/', params)
}
function getServiceTime (params) {
  return axios.get(url + 'appoint/arrangeInstance/searchTimeslice/', {params})
}
function getArrangeExecuteList (params) {
  return axios.post(url + 'appt/advice-execute/getAdviceExecuteList/', params)
}
function createExecuteAppoint (params) {
  return axios.post(url + 'appt/advice-execute/create/', params)
}
function updateExecuteAppoint (params) {
  return axios.post(url + 'appt/advice-execute/update/', params)
}
function cancelExecuteAppoint (params) {
  return axios.post(url + 'appt/advice-execute/cancel/', params)
}
function getPatientParams (params) {
  return axios.get(passurl + 'doctor/patientRequireParam/getParam/', {params})
}
function getInsuranceOrg (params) {
  return axios.post(insuranceurl + 'insuranceOrg/getList1/', params)
}
function getInsuranceProduct (params) {
  return axios.post(insuranceurl + 'insurProduct/getListByOrgId/', params)
}
function getCancalAppoint (params) {
  return axios.post(url + 'appointment/getByIdList/', params)
}
function getValidAppointments (params) {
  return axios.post(url + 'appointment/getValidAppointments/', params)
}
function getLatestVisit (params) {
  return axios.post(url + 'appointment/getLatestVisit/', params)
}
function queryHasValidAdvice (params) {
  return axios.post(soburl + 'doctorAdviceController/queryHasValidAdvice/', params)
}
function getLatestDateOutCall (params) {
  return axios.get(url + 'arrangeInstance/getLatestDateOutCall/', {params})
}
function getApolloValue (params) {
  return axios.post('/thc-platform-core/apollo/getValue', params)
}
export default {
  list,
  getPaitentRepeats,
  createAppoint,
  updateAppoint,
  changeAppoint,
  createRegister,
  createAppointRegister,
  createQuickRegister,
  updateAppointRegister,
  getOrgList,
  getOrgInfo,
  getArrangeDepts,
  getArrangeService,
  getArrangeResource,
  getArrangeTimeslice,
  getAppointData,
  cannelAppoint,
  getOrganCity,
  updateShowStyle,
  createLockAppoint,
  cancelLockAppoint,
  getDoctorInfo,
  getNumberTime,
  setEditor,
  deleteEditor,
  getOrderSet,
  getAppointList,
  getUseRules,
  getServicePrice,
  getServiceSetList,
  getPatientDiscounts,
  getSettlementInfo,
  getDoctorArrangeInfo,
  getResourceList,
  confirmAppoint,
  isOpenScene,
  getChannelList,
  getExecuteAppoint,
  getServiceItem,
  getServiceTime,
  getArrangeExecuteList,
  createExecuteAppoint,
  getPatientInfo,
  updateExecuteAppoint,
  cancelExecuteAppoint,
  getPatientParams,
  getInsuranceOrg,
  getInsuranceProduct,
  getCancalAppoint,
  getValidAppointments,
  getLatestVisit,
  queryHasValidAdvice,
  getPriceType,
  getLatestDateOutCall,
  getAppointStates,
  getRcmData,
  getApolloValue
}
