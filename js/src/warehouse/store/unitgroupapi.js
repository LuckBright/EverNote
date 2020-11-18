import { warehouse as axios } from './api'
const url = 'unitGroup/'

async function list (params) {
  return await axios.post(url + 'getUnitGroupList/', params)
}
function getById (id) {
  return axios.post(url + 'getUnitGroupInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateUnitGroup' : 'createUnitGroup'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'deleteUnitGroup/', {
    id,
    isDelete: 1
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
