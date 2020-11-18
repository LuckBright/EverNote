import axios from '@/insurance/store/api'
const url = '/insurance/insurProductPay/'

var visitTypeStr = [
  {id: 0, name: '门诊'},
  {id: 1, name: '住院'},
  {id: 2, name: '急诊'},
  {id: 3, name: '门急诊'},
  {id: 4, name: '所有'}
]
var classTypeStr = [
  {id: 1, name: '项目分类'},
  {id: 2, name: '药品明细项目'},
  {id: 3, name: '诊疗明细项目'}
]

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    result.data.details.forEach(function (item) {
      if (item.classType === 1) {
        item.treatItem = ''
        item.medicalItem = ''
      } else if (item.classType === 2) {
        item.itemclassifyMethod = ''
        item.itemClass = ''
        item.treatItem = ''
      } else if (item.classType === 3) {
        item.itemclassifyMethod = ''
        item.itemClass = ''
        item.medicalItem = ''
      }
    })
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
  return axios.post(url + 'getListByProductID/', params).then((response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  visitTypeStr,
  classTypeStr
}
