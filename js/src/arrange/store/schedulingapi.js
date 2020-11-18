import { arrange as axios } from './api'
const url = '/arrange/'
const url2 = '/sob/'
// const url2 = '/warehouse/'
function getArrangeConfig (key) {
  return axios.post(url + 'ruleConfig/getRuleConfigByKey', { configKey: key })
}
function list (params) {
  return axios.post(url + 'resourceArrange/getResourceArrangeList', params)
    .then(result => {
      return result
    })
}
function del (id) {
  return axios.post(url + 'resourceArrange/delete', { id: id })
}

function enable (params) {
  return axios.post(url + 'timetrunk/new/enable', params)
}

function coutDeleteArrangeImpactAppointment (params) {
  return axios.post(url + 'resourceArrange/coutDeleteArrangeImpactAppointment', params)
}

function deleteResourceArrangeList (params) {
  return axios.post(url + 'resourceArrange/deleteResourceArrangeList', params)
}

function updateArrange (params) {
  let fun = params.id ? 'resourceArrange/update' : 'resourceArrange/add'
  return axios.post(url + fun, params)
}

function searchResource (code, deptId, organId) {
  return axios.post(url + 'resource/search', { resourceType: code, isValid: 1, deptId: deptId, organId: organId })
}

function getArrangeService (params) {
  return axios.post(url2 + 'service/arrangeServiceList', params)
}

function getResourceArrange (params) {
  return axios.post(url + 'resourceArrange/getArrangeListByTimetrunk', params)
}

function normalCopyArrange (params) {
  return axios.post(url + 'resourceArrange/normalCopyArrange', params)
}

function highCopyArrange (params) {
  return axios.post(url + 'resourceArrange/highCopyArrange', params)
}
// 获取机构和科室
function getOrgList (params) {
  return axios.post(url + 'resourceArrangeZz/getAllClinicList', params)
}

function updateServiceRelList (params) {
  return axios.post(url + 'arrangeBaseset/updateServiceRelList', params)
}

function getDeptData (params) {
  return axios.post(url + 'resourceArrangeZz/getAllDeptListByClinic', params)
}

function getRootDeptList (params) {
  return axios.post(url + 'dept/queryRootDeptsByClinicid', params)
}

function getChildDeptList (params) {
  return axios.post(url + 'dept/queryChildDepts', params)
}

function getAllDeptList (params) {
  return axios.post(url + 'dept/queryAll', params)
}

function resetArrangeList (params) {
  return axios.post(url + 'resourceArrangeZz/refreshOrganizationData', params)
}
function getAssistantArrangeList (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/searchAssistantResourceArrangeList', params)
}
function saveAssistantArrange (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/saveOrUpdateAssistantResourceArrange', params)
}

export default {
  list,
  del,
  updateArrange,
  searchResource,
  getOrgList,
  getArrangeService,
  getResourceArrange,
  normalCopyArrange,
  highCopyArrange,
  getDeptData,
  getRootDeptList,
  getChildDeptList,
  getAllDeptList,
  resetArrangeList,
  updateServiceRelList,
  coutDeleteArrangeImpactAppointment,
  deleteResourceArrangeList,
  getArrangeConfig,
  getAssistantArrangeList,
  saveAssistantArrange,
  enable
}
