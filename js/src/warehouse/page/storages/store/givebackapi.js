// 业务退返api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'return/'
const urlQuery = 'stockSysBatch/'

function createOrUpdate (params) {
  var path = params.id ? 'updateReturnSupplier' : 'createReturnSupplier'
  return axios.post(url + path + '/', params)
}
function cancelReturnSupplier (params) {
  var path = 'cancelReturnSupplier'
  return axios.post(url + path + '/', params)
}

function getById (id) {
  return axios.post(url + 'getReturnSupplierInfo/', id).then((result) => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getReturnSupplierList/', params)
}

function listQuery (params) {
  return axios.post(urlQuery + 'queryStockSysBatchForList/', params).then((response) => {
    return response
  })
}

export default {
  listQuery,
  list,
  getById,
  cancelReturnSupplier,
  createOrUpdate
}
