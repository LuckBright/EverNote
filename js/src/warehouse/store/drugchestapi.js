import { warehouse as axios } from './api'
const url = 'container/'
function getById (id) {
  return axios.post(url + 'getContainerInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (drugchest) {
  var path = drugchest.id ? 'updateContainer' : 'createContainer'
  return axios.post(url + path + '/', drugchest)
}

function del (id) {
  return axios.post(url + 'updateContainer/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getContainerList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
