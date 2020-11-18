
import { arrange as axios } from '@/arrange/store/api.js'
const urlarrange = '/arrange'
function getClinicCityList (params) {
  return axios.post('/warehouse/clinic/getClinicCityList/', params).then(result => {
    return result
  })
}

function queryGroupClinics (params) {
  return axios.post(urlarrange + '/dept/queryGroupClinics', params).then(result => {
    return result
  })
}

function queryCityGroupClinics (params) {
  return axios.post(urlarrange + '/dept/queryCityGroupClinics', params).then(result => {
    return result
  })
}

function queryGroupDepts (params) {
  return axios.post(urlarrange + '/dept/queryGroupDepts', params).then(result => {
    return result
  })
}
// 平台机构拉平数据
function getTreeNodesByClinicId (params) {
  return axios.post('/thc-platform-core/out/organization/getOrgListByCondition', params).then(result => {
    return result
  })
}

function getClinicByCityCodeList (params) {
  return axios.post('/warehouse/clinic/getClinicByCityCodeList/', params).then(result => {
    return result
  })
}
// 平台查询科室
function getTenantSubjectListByCondition (params) {
  return axios.post('/thc-platform-core/out/subject/getTenantSubjectListByCondition', params).then(result => {
    return result
  })
}
function searchChilds (params) {
  return axios.post(urlarrange + '/resource/searchChilds', params).then(result => {
    return result
  })
}
function getServce (params) {
  return axios.post('/warehouse/staffRecord/getStaffRecordVoListByOrgIdAndSectionId/', params).then(result => {
    return result
  })
}

export default {
  getClinicCityList,
  queryGroupClinics,
  queryCityGroupClinics,
  queryGroupDepts,
  getTreeNodesByClinicId,
  getClinicByCityCodeList,
  getTenantSubjectListByCondition,
  searchChilds,
  getServce
}
