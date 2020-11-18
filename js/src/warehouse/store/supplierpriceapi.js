import { warehouse as axios } from './api'
const url = 'supplierLocal/'

function getById (supplierId) {
  return axios.post(url + 'getSupplierLocal/', {
    supplierId
  }).then(result => {
    return result
  })
}

function getInfo (params) {
  return axios.post(url + 'getSupplierLocalProductInfo/', params).then(result => {
    return result
  })
}

function createOrUpdate (params) {
  return axios.post(url + 'createSupplierLocal/', params)
}

function create (params) {
  return axios.post(url + 'createSupplierLocalList/', params)
}

function createLocal (params) {
  return axios.post(url + 'createSupplierLocalProduct/', params)
}

function updateLocal (params) {
  return axios.post(url + 'updateSupplierLocalProduct/', params)
}

async function list (params) {
  return await axios.post(url + 'getSupplierLocalProductList/', params)
}

function query (params) {
  return axios.post(url + 'getSupplierLocalList/', params)
    .then((response) => {
      return response
    })
}

function queryLocal (params) {
  return axios.post(url + 'getSupplierLocalByClinic/', params)
    .then((response) => {
      return response
    })
}

export default {
  getById,
  createOrUpdate,
  list,
  query,
  queryLocal,
  create,
  getInfo,
  updateLocal,
  createLocal
}
