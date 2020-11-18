import { arrange as axios } from './api'
const url = '/arrange/'
const thcurl = '/thc-platform-core/'
function list (params) {
  return axios.post(url + 'appt/ruleUse/queryList/', params)
}
function getDeptType (params) {
  return axios.post(url + 'appt/ruleUse/queryDeptTypes/', params)
}
function getResourcetType (params) {
  return axios.post(url + 'appt/ruleUse/queryResourceTypes/', params)
}
function getServiceType (params) {
  return axios.post(url + 'appt/ruleUse/queryServiceTypes/', params)
}
function getOrganCity (params) {
  return axios.post(thcurl + 'out/organization/getOrgCityList/', params)
}
function getOrganTree (params) {
  return axios.post(thcurl + 'out/organization/getOrgListByCondition/', params)
}
function getAllDeptList (params) {
  return axios.post(thcurl + 'out/subject/getTenantSubjectListByCondition', params)
}
function getResourceList (params) {
  return axios.post(thcurl + 'out/staff/getStaffListByCondition/', params)
}
function getOrganList (params) {
  return axios.post(thcurl + 'out/organization/getOrgListHasSubjectByCondition/', params)
}
function getServiceClass (params) {
  return axios.post(thcurl + 'valueSetItem/getValueSetItemByCode/', params)
}

function getServiceList (params) {
  if (!params.serviceClassificationList || !params.serviceClassificationList[0]) {
    params.serviceClassificationList = []
  }
  return axios.post('/sob/service/queryService/', params)
}

function saveRules (params) {
  let aciton = params.id ? 'update' : 'save'
  return axios.post(url + 'appt/ruleUse/' + aciton + '/', params)
}

function setRulesStatus (params) {
  let aciton = params.status ? 'enable' : 'disable'
  return axios.post(url + 'appt/ruleUse/' + aciton + '/', params)
}

export default {
  list,
  getDeptType,
  getResourcetType,
  getServiceType,
  getOrganCity,
  getOrganTree,
  getAllDeptList,
  getResourceList,
  getOrganList,
  getServiceClass,
  getServiceList,
  saveRules,
  setRulesStatus
}
