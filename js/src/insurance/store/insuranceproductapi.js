import axios from '@/insurance/store/api'
const url = '/insurance/insurProduct/'
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
  return axios.post(url + 'getList1/', params).then((response) => {
    return response
  })
}

function listByOrgId (id) {
  var params = {
    id: id
  }
  return axios.post(url + 'getListByOrgId/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  listByOrgId
}
