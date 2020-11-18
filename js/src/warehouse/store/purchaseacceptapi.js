import { warehouse as axios } from './api'
const url = 'purchaseAcceptance/'

function getById (id) {
  return axios.post(url + 'getPurchaseAcceptanceInfo/', {
    id
  }).then(result => {
    return result
  })
}

function getDRAFT (params) {
  return axios.post(url + 'getDRAFTPurchaseAcceptance/', params).then(result => {
    return result
  })
}

function getInfo (id) {
  return axios.post(url + 'getPurchaseAcceptanceListInfo/', {
    id
  }).then(result => {
    return result
  })
}

function create (obj) {
  return axios.post(url + 'createPurchaseAcceptanceList' + '/', obj)
}

function createNew (obj) {
  return axios.post(url + 'createNewPurchaseAcceptance' + '/', obj)
}

function createOrUpdate (obj) {
  var item = []
  obj.drugItems.forEach(drug => {
    drug.purchaseAcceptanceItemVo.forEach(v => {
      item.push({
        batchId: v.batchId,
        purchaseOrderId: obj.purchaseOrderId,
        purchaseOrderItemId: v.purchaseOrderItemId,
        localMaterialId: drug.localMaterialId,
        num: v.inBoundNum,
        drugChestId: v.drugChestId,
        storageRoomId: v.storageRoomId || 0,
        discount: v.discount
      })
    })
  })
  obj.item = item
  // delete obj.drugItems
  var path = obj.id ? 'updatePurchaseAcceptance' : 'createPurchaseAcceptance'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updatePurchaseOrder/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getPurchaseAcceptanceList/', {
    offset: 0,
    pagesize: 10
  })
}

function getItemsByPurchaseId (pid) {
  let params = {
    type: 1,
    purchaseOrderId: pid
  }
  return axios.post('purchaseAcceptanceItem/getPurchaseAcceptanceItem/', params).then((result) => {
    result.forEach(drug => {
      drug.purchaseAcceptanceItemVo = drug.purchaseAcceptanceItemVo.map(v => {
        return Object.assign({
          drugChestId: '',
          storageRoomId: '',
          batchId: ''
        }, v)
      })
    })
    return result
  })
}

function getItemsById (id) {
  let params = {
    type: 1,
    purchaseAcceptanceId: id
  }
  return axios.post('purchaseAcceptanceItem/getPurchaseAcceptanceItemList/', params).then((result) => {
    result.forEach(drug => {
      drug.purchaseAcceptanceItemVo = drug.purchaseAcceptanceItemVo.map(v => {
        return Object.assign({
          drugChestId: '',
          storageRoomId: '',
          batchId: ''
        }, v)
      })
    })
    return result
  })
}

function getBillNum (params) {
  // let params = typeof id === 'object' ? id : {id}
  return axios.post('purchaseAcceptanceItem/getAcceptanceItemByBillNum/', params).then(result => {
    return result
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  getItemsByPurchaseId,
  getItemsById,
  create,
  createNew,
  getBillNum,
  getInfo,
  getDRAFT
}
