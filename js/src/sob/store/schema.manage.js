import { sob as axios } from './api'
const url = 'healthServiceTemplate/'

function list (params) {
  return axios.post(url + 'search', params)
    .then((response) => {
      return response
    })
}

function createOrUpdate (obj) {
  let path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function getById (id) {
  return axios.post(url + 'getById', { id })
    .then(result => {
      if (result && result.data) {
        return result.data
      } else {
        return {}
      }
    })
}

function del (id) {
  return axios.post(url + 'delete/', { id })
}

export default {
  list,
  createOrUpdate,
  getById,
  del
}
