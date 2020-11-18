import { warehouse as axios } from '../../../store/api'
const url = 'brand/'
function getById (id) {
  return axios.post(url + 'getBrandInfo/', {
    id: id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateBrand' : 'createBrand'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateBrand/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getBrandList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list
}

