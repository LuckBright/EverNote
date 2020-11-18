import { warehouse as axios } from './api'
const url = 'inventoryTaking/'

function getItemById (params) {
  return axios.post(url + 'getInventoryTakingItemInfo/', params).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = 'createInventoryTakingWithItem'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getInventoryTakingList/', params)
}

function materialList (params) {
  return axios.post(url + 'getStockInfoForInventoryList/', params)
    .then((response) => {
      return response
    })
}
function getById (id) {
  return axios.post(url + 'getInventoryInfoGroupByMaterialIdInfo/', { 'inventoryTakingId': id }).then(result => {
    return result
  })
}
function getInfoById (params) {
  return axios.post(url + 'getInventoryInfoGroupByMaterialIdInfo/', params).then(result => {
    return result
  })
}
function getExportById (id) {
  return axios.post(url + 'exportInventoryTakingItemList/', { 'inventoryTakingId': id }).then(result => {
    return result
  })
}
function audiInventory (params) {
  return axios.post(url + 'auditInventory/', params).then(result => {
    return result
  })
}

function updateStatus (params) {
  return axios.post(url + 'updateInventoryTakingStatues/', params).then(result => {
    return result
  })
}
function uploadFile (params) {
  return axios.post(url + 'importExcelInventoryTakingWithItem/', {
    materialType: params.materialType,
    inventoryTakingId: params.inventoryTakingId,
    fileName: params.name,
    bucketName: params.bucket
  }).then(result => {
    return result
  })
}
function downloadFile (params) {
  return axios.post(url + 'exportInventoryTakingItemList/', params).then(result => {
    return result
  })
}

function postPandianExcel (params) {
  params = axios.jsonToFormData(params)
  return axios.post(url + 'importExcelInventoryTakingWithItemNew/', params)
}
//   盘点 修改盘点数据实物数量
function updateInventoryTakingItem (params) {
  return axios.post(url + 'updateInventoryTakingItem/', params).then(result => {
    return result
  })
}
//   盘点  添加漏盘数据
function addInventoryTakingItem (params) {
  return axios.post(url + 'addInventoryTakingItem/', params).then(result => {
    return result
  })
}
//   盘点单  货位查询
function getInventoryTakingtFreightList (params) {
  return axios.post(url + 'getInventoryTakingtFreightList/', params).then(result => {
    return result
  })
}
//   盘点单生成查询库房是否有未完成的单据
function judgeIsExistInOutStock (params) {
  return axios.post(url + 'judgeIsExistInOutStock/', params).then(result => {
    return result
  })
}

export default {
  getById,
  getInfoById,
  createOrUpdate,
  list,
  materialList,
  getItemById,
  getExportById,
  audiInventory,
  updateStatus,
  uploadFile,
  downloadFile,
  postPandianExcel,
  judgeIsExistInOutStock,
  updateInventoryTakingItem,
  addInventoryTakingItem,
  getInventoryTakingtFreightList,
}
