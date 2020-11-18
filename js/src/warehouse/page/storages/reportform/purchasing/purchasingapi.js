import { warehouse as axios } from '@/warehouse/store/api'
const url = 'procurement/'
const storeUrl = 'storageRoom/'
const materType = 'basesource/'
const exlUrl = 'reportformsexport/'
const sellUrl = 'sellreportforms/'
const stockUrl = 'stockReportforms/'
function listSummary (params) { // 采购入库汇总
  return axios.post(url + 'instockcount/', params)
}
function listDetailed (params) { // 采购入库明细
  return axios.post(url + 'instockdetail/', params)
}
function getClinicList () { // 获取集团下所有机构
  return axios.post('clinic/getClinicList/')
}
function getAllStorageRooms (params) { // 获取多个机构下的所有库房
  return axios.post(storeUrl + 'getAllStorageRoomListByclinicIds/', params)
}
function getLevelClassify (params) {
  return axios.post(materType + 'getLevelClassify/', params)
}
function listSalesreturncount (params) {
  return axios.post(url + 'salesreturncount/', params)
}

function listSalesreturndetail (params) {
  return axios.post(url + 'salesreturndetail/', params)
}

function suppliercontactscount (params) { // 供应商往来汇总表
  return axios.post(url + 'suppliercontactscount/', params)
}

function suppliercontactsdetail (params) { // 供应商往来明细表
  return axios.post(url + 'suppliercontactsdetail/', params)
}

function exportExcel (params) { // 通用导出
  return axios.post(exlUrl + 'exportExcel', params).then(result => {
    return result
  })
}

function returnmedicinecount (params) { // 门诊退药汇总
  return axios.post(sellUrl + 'returnmedicinecount/', params)
}

function returnmedicinedetail (params) { // 门诊退药明细
  return axios.post(sellUrl + 'returnmedicinedetail/', params)
}

function dispensemedicinecount (params) { // 门诊发药汇总
  return axios.post(sellUrl + 'dispensemedicinecount/', params)
}

function dispensemedicinedetail (params) { // 门诊发药明细
  return axios.post(sellUrl + 'dispensemedicinedetail/', params)
}

function stockMaterial (params) { // 在库物品表
  return axios.post(stockUrl + 'stockMaterial/', params)
}

function stockMaterialByBatch (params) { // 在库物品批次表（按批次展示）
  return axios.post(stockUrl + 'stockMaterialByBatch/', params)
}

function inAndOutStockGather (params) { // 出入库业务汇总表
  return axios.post(stockUrl + 'inAndOutStockGather/', params)
}

function inAndOutStockFlow (params) { // 出入库业务流水表
  return axios.post(stockUrl + 'inAndOutStockFlow/', params)
}

function paidButNotOutStockMaterial (params) { // 已收费未出库药品表
  return axios.post(stockUrl + 'paidButNotOutStockMaterial/', params)
}

function inventory (params) { // 进销存报表
  return axios.post(stockUrl + 'inventory/', params)
}

function getRelatedParty (params) { // 获取相关方数据
  return axios.post(stockUrl + 'getRelatedParty/', params)
}

export default {
  exportExcel,
  listSummary,
  getClinicList,
  listDetailed,
  getLevelClassify,
  getAllStorageRooms,
  listSalesreturncount,
  listSalesreturndetail,
  suppliercontactscount,
  suppliercontactsdetail,
  returnmedicinecount,
  returnmedicinedetail,
  dispensemedicinecount,
  dispensemedicinedetail,
  stockMaterial,
  stockMaterialByBatch,
  inAndOutStockGather,
  inAndOutStockFlow,
  paidButNotOutStockMaterial,
  inventory,
  getRelatedParty
}
