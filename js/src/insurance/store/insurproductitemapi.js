import axios from '@/insurance/store/api'
const url = '/insurance/insurProductItem/'

var operation = [
  {id: 0, name: '包括'},
  {id: 1, name: '排除'}
]

var itemType = [
  {id: 1, name: '诊疗'},
  {id: 2, name: '药品'}
]

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
  console.log(id)
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getListByProductID/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  operation,
  itemType
}
