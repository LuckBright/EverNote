import axios from '@/insurance/store/api'
const url = '/insurance/insurProductArea/'

var operation = [
  {id: 0, name: '包括'},
  {id: 1, name: '排除'}
]

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    for (var obj of result.data.details) {
      obj.cityArr = []
      obj.cityArr.push(obj.province)
      obj.cityArr.push(obj.city)
    }
    return result.data
  })
}
function createOrUpdate (obj) {
  for (var detailsObj of obj.details) {
    detailsObj.province = detailsObj.cityArr[0]
    detailsObj.city = detailsObj.cityArr[1]
  }
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
    return response.data
  }, (response) => {
    return response.data
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  operation
}
