import { warehouse as axios } from './api'
const url = 'containerObject/'

function getById (id) {
  return axios.post(url + 'getContainerObjectInfo/', { id }).then(result => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getContainerObjectList/', params)
}

function create (params) {
  return axios.post(url + 'createContainerObject/', params).then(result => {
    return result
  })
}

function del (id) {
  return axios.post(url + 'updateContainerObject/', {
    id,
    isDelete: 1
  })
}

export default {
  getById,
  list,
  create,
  del
}
