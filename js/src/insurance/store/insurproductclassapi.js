import axios from '@/insurance/store/api'
const url = '/insurance/insurProductClass/'

function getById (id) {
  return axios.post(url + 'get', {
    id: id
  }).then(result => {
    result.data.details.forEach(function (item) {
      item.itemClass = item.itemClass && String(item.itemClass)
    })
    return result.data
  })
}
function createOrUpdate (obj) {
  // for (var detailsObj of obj.details) {
  //   detailsObj.itemclassifyMethod = detailsObj.classArr[0]
  //   detailsObj.itemClass = detailsObj.classArr[1]
  // }
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
