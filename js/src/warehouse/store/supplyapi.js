import { warehouse as axios } from './api'
const url = 'supplyRelation/'

function getById (id) {
  return axios.post(url + 'getSupplyRelationInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (params) {
  var path = params.id ? 'deleteRelation' : 'createSupplyRelation'
  return axios.post(url + path + '/', params)
}

async function list (params) {
  return await axios.cancelPost(url + 'getSupplyRelationList/', params)
}

export default {
  list,
  getById,
  createOrUpdate
}
