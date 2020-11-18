import axios from '@/insurance/store/api'
const url = '/insurance/insurContract/'

var paymentCycle = [
  {id: 0, name: '月'},
  {id: 1, name: '季度'}
]

var isDirect = [
  {id: 0, name: '否'},
  {id: 1, name: '是'}
]

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    result.data.salePolicy = result.data.salePolicy.toString()
    return result.data
  })
}
function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  obj.singleFee = obj.singleFee || '0'
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
  return axios.post(url + 'getList1/', params).then((response) => {
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
  paymentCycle,
  isDirect
}
