import { warehouse as axios } from './api'
const url = 'stock/'
const urllocal = 'localSetting/'
const urlbuy = 'supplierLocal/'
const urlInventory = 'inventoryTaking/'

// 涉及批次数据，使用该接口
async function list (params) {
  return await axios.cancelPost(url + 'queryStockForList/', params)
}
// 申领，领用，手动入库，
async function listlocal (params) {
  return await axios.cancelPost(urllocal + 'getNewLocalSettingList/', params)
}
// 集中采购申请查询物资，
async function getLocalSettingListTelanUOrg (params) {
  return await axios.cancelPost(urllocal + 'getLocalSettingListTelanUOrg/', params)
}
// 采购
async function listbuy (params) {
  return await axios.cancelPost(urlbuy + 'getNewSupplierLocalProduct/', params)
}
// 采购申请
async function listwithoutsplit (params) {
  return await axios.cancelPost(urllocal + 'getNewLocalSettingListNotSplit/', params)
}
// 物资迁移接口更换
async function basesourceList (params) {
  return await axios.cancelPost(urlbuy + 'getSourceByLocalSettingListForServiceForSupplier/', params)
}
// 采购/快捷入库 获取物资信息
async function purchaseList (params) {
  return await axios.cancelPost(urlbuy + 'getSourceByLocalSettingListForSupplier/', params)
}
// 物资拆零
function getSplitFlag (params) {
  return axios.post(urllocal + 'getLocalSettingForSplitFlag/', params)
}
//   2020-03-17 新增物资查询接口
//    采购单 / 快捷入库 获取物资信息
async function getLocalSettingList (params) {
  return await axios.cancelPost(urllocal + 'getLocalSettingList/', params)
}
//   盘点 按物资盘点搜索物资
function getStockLocalSettingList (params) {
  return axios.post(urlInventory + 'getStockLocalSettingList/', params)
}
//   盘点单  物资查询
function getInventoryTakingLocalSettingList (params) {
  return axios.post(urlInventory + 'getInventoryTakingLocalSettingList/', params).then(result => {
    return result
  })
}
//   盘点 修改盘点数据  添加漏盘数据
function getStockLocalSettingListAndBatchNum (params) {
  return axios.post(urlInventory + 'getStockLocalSettingListAndBatchNum/', params)
}
export default {
  list,
  listlocal,
  listbuy,
  listwithoutsplit,
  purchaseList,
  basesourceList,
  getInventoryTakingLocalSettingList,
  getLocalSettingListTelanUOrg,
  getLocalSettingList,
  getSplitFlag,
  getStockLocalSettingList,
  getStockLocalSettingListAndBatchNum
}
