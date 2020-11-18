import { warehouse as axios } from './api'
const url = 'consumptiveMaterial/'

function getById (id) {
  return axios.post(url + 'getConsumptiveMaterial/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (params) {
  var path = params.id ? 'updateConsumptiveMaterial' : 'createConsumptiveMaterial'
  return axios.post(url + path + '/', params)
}

function del (id) {
  return axios.post(url + 'updateConsumptiveMaterial/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getConsumptiveMaterialList/', params)
    .then((response) => {
      return response.list
    })
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
