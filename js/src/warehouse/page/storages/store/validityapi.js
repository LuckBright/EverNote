// 效期预警api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'stock/'

function getById (params) {
  return axios.post(url + 'queryStockDetailInfoById/', params).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateContact' : 'createContact'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateContact/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'queryStockForList/', params)
}

function listed (params) {
  return axios.post(url + 'getStorageRoomBatchList/', params).then((response) => {
    return response
  })
}

function warninglist (params) {
  return axios.post(url + 'queryStockForOverdueWarningList/', params).then((response) => {
    return response
  })
}

function supplierlist (params) {
  return axios.post(url + 'getSRBatchForSpplierList/', params).then((response) => {
    return response
  })
}
function batchlist (params) {
  return axios.post(url + 'getSRBatchForBatchList/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  supplierlist,
  batchlist,
  listed,
  warninglist
}
