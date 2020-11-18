import { warehouse as axios } from './api'
const url = 'consumptiveMaterial/'

function getById (id) {
  return axios.post(url + 'getConsumptiveMaterial/', { id }).then(result => {
    return result
  })
}

function createOrUpdate (clinic) {
  var path = clinic.id ? 'updateConsumptiveMaterialList' : 'createConsumptiveMaterial'
  return axios.post(url + path + '/', clinic)
}

function updateGroup (clinic) {
  var path = 'updateConsumptiveMaterial'
  return axios.post(url + path + '/', clinic)
}

function del (id) {
  return axios.post(url + 'updateConsumptiveMaterial/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getConsumptiveMaterialList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  updateGroup,
  list
}
