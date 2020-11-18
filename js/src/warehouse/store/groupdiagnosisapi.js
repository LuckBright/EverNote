import { workspace as axios } from '@/workspace/store/api'
const urlMap = {
  diseaseOrig: {
    searchOnTenant: 'platform-extend/disease/diseaseOrig/searchOnTenant',
    searchOnOrg: 'platform-extend/disease/diseaseOrig/searchOnOrg',
    create: 'platform-extend/disease/diseaseOrig/create',
    delete: 'platform-extend/disease/diseaseOrig/delete',
    update: 'platform-extend/disease/diseaseOrig/update',
    getCodeCategoryOnTenant: 'platform-extend/disease/diseaseOrig/getCodeCategoryOnTenant',
  },
  diseaseManager: {
    create: 'platform-extend/disease/diseaseManager/create',
    deleteByDiseaseOrigIdAndGroupId: 'platform-extend/disease/diseaseManager/deleteByDiseaseOrigIdAndGroupId',
    removeOneByRangeCode: 'platform-extend/disease/diseaseManager/removeOneByRangeCode',
  },
  diseaseGroup: {
    create: 'platform-extend/disease/diseaseGroup/create',
    delete: 'platform-extend/disease/diseaseGroup/delete',
    updateName: 'platform-extend/disease/diseaseGroup/updateName',
    getByRangeCode: 'platform-extend/disease/diseaseGroup/getByRangeCode',
    deleteByRangeModeOne: 'platform-extend/disease/diseaseGroup/deleteByRangeModeOne',
    deleteByRangeModeTwo: 'platform-extend/disease/diseaseGroup/deleteByRangeModeTwo',
  },
}

function list (params) {
  return axios.post(urlMap.diseaseOrig.searchOnTenant, params)
}
function orglist (params) {
  return axios.post(urlMap.diseaseOrig.searchOnOrg, params)
}
// 创建单条病种诊断数据记录
function createDiagnosis (params) {
  return axios.post(urlMap.diseaseOrig.create, params)
}
// 删除单条病种诊断数据记录
function deleteDiagnosis (params) {
  return axios.post(urlMap.diseaseOrig.delete, params)
}
// 编辑更新单条病种诊断数据记录
function updateDiagnosis (params) {
  return axios.post(urlMap.diseaseOrig.update, params)
}
// 添加诊断
function addDiagnosis (params) {
  return axios.post(urlMap.diseaseManager.create, params)
}
// 创建分组
function createGroup (params) {
  return axios.post(urlMap.diseaseGroup.create, params)
}
// 重命名分组（集团、科室、个人）
function updateName (params) {
  return axios.post(urlMap.diseaseGroup.updateName, params)
}
// 删除分组
function deleteGroup (params) {
  return axios.post(urlMap.diseaseGroup.delete, params)
}
// 获取分组(集团)
// function getGroup (params) {
//   return axios.post(url + 'diseaseGroup/v2.0/getByTenantId', params)
// }
// 获取分组(集团)
function getGroup (params) {
  return axios.post(urlMap.diseaseGroup.getByRangeCode, params)
}
// 获取诊断编码分类名称
function getCode (params) {
  return axios.post(urlMap.diseaseOrig.getCodeCategoryOnTenant, params)
}

// 删除分组以及分组的诊断
function deleteByRangeModeOne (params) {
  return axios.post(urlMap.diseaseGroup.deleteByRangeModeOne, params)
}

// 只删除分组
function deleteByRangeModeTwo (params) {
  return axios.post(urlMap.diseaseGroup.deleteByRangeModeTwo, params)
}

// 移出分组
function removeDisease (params) {
  return axios.post(urlMap.diseaseManager.deleteByDiseaseOrigIdAndGroupId, params)
}

// 在全部分组中删除
function deleteAll (params) {
  return axios.post(urlMap.diseaseManager.removeOneByRangeCode, params)
}

export default {
  list,
  orglist,
  createDiagnosis,
  deleteDiagnosis,
  updateDiagnosis,
  addDiagnosis,
  createGroup,
  updateName,
  deleteGroup,
  getGroup,
  getCode,
  deleteByRangeModeOne,
  deleteByRangeModeTwo,
  removeDisease,
  deleteAll
}
