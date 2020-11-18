// 入库api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'inStock/'
const url1 = 'purchaseAcceptance/'

function getById (inStockId) {
  return axios.post(url + 'getReduceInStockAndItemInfo/', { inStockId }).then(result => {
    return result
  })
}
function getDRAFT (params) {
  return axios.post(url1 + 'getDRAFTPurchaseAcceptance/', params).then(result => {
    return result
  })
}
// function createNew (obj) {
//   return axios.post(url1 + 'createNewPurchaseAcceptance' + '/', obj)
// }
function createNew (obj) {
  return axios.post(url + 'createPurchaseInStockAndItem' + '/', obj)
}
function createOrUpdate (obj) {
  var path = obj.id ? 'updateInStockAndItemForEdit' : 'createInOutStock'
  return axios.post(url + path + '/', obj)
}
function purchase (obj) {
  var path = 'submitPurchaseInStockAndItem'
  return axios.post(url + path + '/', obj)
}

function create (obj) {
  return axios.post(url + 'createNewInStock/', obj)
}
// 更新已完成单据 发票
function updateInStockInvoiceNo (obj) {
  return axios.post(url + 'updateInStockInvoiceNo/', obj)
}
// 查询未入库单子 生产批号 日期是否可以编辑
function judgeBatchNumIsExist (obj) {
  return axios.post(url + 'judgeBatchNumIsExist/', obj)
}

async function list (params) {
  return await axios.post(url + 'getInStockList/', params)
    .then((response) => {
      if (!response.list) {
        return []
      } else {
        return response
      }
    })
}

function getStockBatchNum (params) {
  return axios.post(url + 'getStockBatchNumByLocalMaterialId/', params)
}

// 入库审核
function updateInStockForAudit (params) {
  return axios.post(url + 'updateInStockForAudit/', params)
}

// 批次定价获取调价列表
function getInStockItemPriceAndScene (params) {
  return axios.post(url + 'getInStockItemPriceAndScene/', params)
}

export default {
  getById,
  createOrUpdate,
  list,
  purchase,
  getDRAFT,
  create,
  createNew,
  getStockBatchNum,
  updateInStockInvoiceNo,
  judgeBatchNumIsExist,
  updateInStockForAudit,
  getInStockItemPriceAndScene
}
