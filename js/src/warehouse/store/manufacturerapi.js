import { warehouse as axios } from './api'
const url = 'manufacturer/'

function getById (id) {
  return axios.post(url + 'getManufacturerInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateManufacturer' : 'createManufacturer'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateManufacturer/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getManufacturerList/', params)
}

function queryList (params) {
  return axios.post(url + 'getManufacturerList/', params).then((response) => {
    return response
  })
}

function validation (params) {
  return axios.post(url + 'getNumByManuFacturerOnly/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  queryList,
  validation
}
