import { warehouse as axios } from '@/warehouse/store/api'
import { auth } from '@/auth/store/api.js'
import treedata from './tree.json'
const url = 'material/'
const newUrl = '/thc-platform-core/out/'

// 物资列表
function list (params) {
  params.splitFlag && delete params.splitFlag
  return axios.post(`${url}tenantSkuList/`, params)
}
// 物资创建/更新
function createOrUpdate (params) {
  return axios.post(`${url}save/`, params)
}
// 药理分类
function categoryList (params) {
  return axios.post('pharmacologyCategory/getAllPharmacologyCategory/', params)
}
// 十八反十九畏
function searchRuleEngineConstant (params) {
  return axios.post('cdssRule/searchRuleEngineConstant/', params)
}
// 机构修改销售价格
function updateRcmPrice (params) {
  return axios.post('localSetting/updateRcmPrice/', params)
}
// 获取详情
function getById (id, isClinic) {
  return axios.post(`${url}getSkuById/`, { id, isClinic })
}
// sku启用禁用
function updateSkuState (params) {
  return axios.post(`${url}updateSkuState/`, params)
}
// 更新关联关系
function saveRelation (params) {
  return axios.post(url + 'saveRelation/', params)
}
// 获取物资与机构关联关系
function relations (id) {
  return axios.post(url + 'relations/', { id })
}
// 获取树形表格机构列表
function tree (params) {
  return auth.post(newUrl + 'organization/getOrgAndChildrenByCondition', params)
}
// 检测条码唯一性
function checkMaterialBarCode (params) {
  return auth.post('warehouse/' + url + 'checkMaterialBarCode', params)
}
// 检测物资编码唯一性
function checkMaterialCode (params) {
  return auth.post('warehouse/' + url + 'checkMaterialCode', params)
}
// 获取树形表格机构列表 - temp
function treetemp (params) {
  return new Promise(resolve => {
    resolve(treedata)
  })
}
// 更新关联关系
function getExcelPrice (params) {
  return axios.post(url + 'getExcelPrice/', params)
}
export default {
  list,
  createOrUpdate,
  categoryList,
  updateRcmPrice,
  getById,
  updateSkuState,
  saveRelation,
  relations,
  tree,
  treetemp,
  getExcelPrice,
  checkMaterialBarCode,
  searchRuleEngineConstant,
  checkMaterialCode
}
