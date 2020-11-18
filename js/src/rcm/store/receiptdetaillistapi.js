import axios from './api'
const url = 'ar/insuranceRcv/'
const listurl = 'ar/receipt/'

var payStatusStr = [
  {id: 0, name: '未支付'},
  {id: 1, name: '部分支付'},
  {id: 2, name: '全部支付'}
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
  return axios.post(url + 'delete/', {
    id: id
  })
}

function list (params) {
  return axios.post(listurl + 'getReceiptByRcv/', params).then((response) => {
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
  payStatusStr
}
