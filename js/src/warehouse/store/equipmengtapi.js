import { warehouse as axios } from './api'
const url = 'equipment/'

function getById (id) {
  return axios.post(url + 'getEquipment/', { id }).then(result => {
    return result
  })
}

function createOrUpdate (params) {
  var path = params.id ? 'updateEquipment' : 'createEquipment'
  return axios.post(url + path + '/', params)
}

function updateGroup (clinic) {
  var path = 'updateDrug'
  return axios.post(url + path + '/', clinic)
}

function del (id) {
  return axios.post(url + 'updateDrug/', {
    id: id,
    isDelete: 1
  })
}

function getInfo (params) {
  return axios.post(url + 'getEquipmentInfo/', params).then(result => {
    return result
  })
}

function updateUnit (params) {
  return axios.post(url + 'updateEquipmentForUnit/', params).then(result => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getEquipmentListByRequire/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  getInfo,
  updateGroup,
  list,
  updateUnit
}
