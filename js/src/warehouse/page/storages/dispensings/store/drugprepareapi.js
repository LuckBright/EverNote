import { warehouse as axios } from '@/warehouse/store/api'
const url = '/prepareRelation/'

// 药房登记列表查询（getPrepareRelationList）
function getPrepareRelationList (params) {
  return axios.post(url + 'getPrepareRelationList/', params)
}

// 查询在院患者（getPrepareRelationPatientList）
function getPrepareRelationPatientList (params) {
  return axios.post(url + 'getPrepareRelationPatientList/', params)
}

// 创建登记患者信息（createPrepareRelation）
function createPrepareRelation (params) {
  return axios.post(url + 'createPrepareRelation/', params)
}

// 更新/删除 患者登记信息（updatePrepareRelation）
function updatePrepareRelation (params) {
  return axios.post(url + 'updatePrepareRelation/', params)
}

// 药房登记患者物资列表（getPrepareRelationItemList）
function getPrepareRelationItemList (params) {
  return axios.post(url + 'getPrepareRelationItemList/', params)
}

// 创建登记药品（createPrepareRelationItem）
function createPrepareRelationItem (params) {
  return axios.post(url + 'createPrepareRelationItem/', params)
}

// 更新/删除登记药品信息
function updatePrepareRelationItem (params) {
  return axios.post(url + 'updatePrepareRelationItem/', params)
}

export default {
  getPrepareRelationList,
  getPrepareRelationPatientList,
  createPrepareRelation,
  updatePrepareRelation,
  getPrepareRelationItemList,
  createPrepareRelationItem,
  updatePrepareRelationItem
}
