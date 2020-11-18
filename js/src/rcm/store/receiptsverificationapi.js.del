import axios from './api'
const url = 'ar/receipt/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getTitleList1/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}
