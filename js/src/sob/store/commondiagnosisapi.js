import {workspace as axios} from '@/workspace/store/api'
const urlMap = {
  diseaseOrig: {
    searchOnTenant: 'platform-extend/disease/diseaseOrig/searchOnOrg',
    searchByRange: 'platform-extend/disease/diseaseOrig/searchByRange',
    getPageByRangeCodeAndGroupId: 'platform-extend/disease/diseaseOrig/getPageByRangeCodeAndGroupId',
    getProvListByDoctorId: 'platform-extend/disease/diseaseManager/getProvListByDoctorId',
  },
  diseaseGroup: {
    getByRangeCode: 'platform-extend/disease/diseaseGroup/getByRangeCode',
  },
}

// 获取科室或者个人的分组(rangeCode)
function getGroupcode (params) {
  return axios.post(urlMap.diseaseGroup.getByRangeCode, params)
}
// 诊断列表（suggest联想)集团
function searchOnTenant (params) {
  return axios.post(urlMap.diseaseOrig.searchOnTenant, params)
}
// 诊断列表（suggest联想)科室和个人
function searchByRange (params) {
  return axios.post(urlMap.diseaseOrig.searchByRange, params)
}
// 依据分组id获取分组详情
function getById (params) {
  return axios.post(urlMap.diseaseOrig.getPageByRangeCodeAndGroupId, params)
}
// 获取科室列表
function getProvList (params) {
  return axios.post(urlMap.diseaseOrig.getProvListByDoctorId, params)
}
export default {
  getGroupcode,
  searchOnTenant,
  searchByRange,
  getById,
  getProvList
}
