import axios from '@/insurance/store/api'
const url = '/insurance/insurStdItemTreat/'

const levelArr = [
  {id: '1', name: '无自付'},
  {id: '2', name: '部分自付'},
  {id: '3', name: '全自付'}
]
const levelObj = {
  1: '无自付',
  2: '部分自付',
  3: '全自付'
}

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    result.data.clinicFeeClass = result.data.clinicFeeClass && String(result.data.clinicFeeClass)
    result.data.hospitalFeeClass = result.data.hospitalFeeClass && String(result.data.hospitalFeeClass)
    result.data.chinaMedicalClass = result.data.chinaMedicalClass && String(result.data.chinaMedicalClass)
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
  return axios.post(url + 'getList1/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  levelArr,
  levelObj,
  getById,
  createOrUpdate,
  del,
  list
}
