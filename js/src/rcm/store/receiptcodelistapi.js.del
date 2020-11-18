import axios from './api'
const url = 'ar/receipt/'
const verifactionUrl = 'ar/verifaction/'
var receipttype = [
  {id: 0, name: '个人'},
  {id: 1, name: '商业保险应收单'},
  {id: 2, name: '医疗保险应收单'}
]
var corpTypeStr = [
  {id: '0', name: '基本医疗保险'},
  {id: '1', name: '商业医疗保险'}
]
var receiptstatus = [
  {id: 0, name: '新建'},
  {id: 1, name: '已核销'}
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
function verifaction (id) {
  return axios.post(verifactionUrl + 'createByReceiptId/', {
    id: id
  })
}
function deleteVerifaction (id) {
  return axios.post(verifactionUrl + 'deleteVerifaction/', {
    id: id
  })
}

function list (params) {
  return axios.post(url + 'getByCode/', params).then((response) => {
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
  receipttype,
  receiptstatus,
  verifaction,
  deleteVerifaction,
  corpTypeStr
}
