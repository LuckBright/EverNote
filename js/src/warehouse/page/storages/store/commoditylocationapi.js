// 货位管理api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'freight/'

async function list (params) {
  return await axios.post(url + 'getFreightList/', params)
}

function createOrUpdate (params) {
  var path = params.id ? 'updateFreight' : 'createFreight'
  return axios.post(url + path + '/', params)
}

function getById (id) {
  return axios.post(url + 'getFreightInfo/', id).then((result) => {
    return result
  })
}

export default {
  list,
  createOrUpdate,
  getById
}
