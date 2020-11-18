import { warehouse as axios } from '@/warehouse/store/api'
const url = '/basesource/'

function updateOrCreate (params) {
  var path = params.id ? 'updateClassify' : 'createClassify'
  return axios.post(url + path + '/', params).then(result => {
    return result
  })
}

function del (params) {
  Object.assign(params, { isDelete: 1 })
  return axios.post(url + 'updateClassify/', params).then(result => {
    return result
  })
}

function sorting (params) {
  return axios.post(url + 'updateClassifyList/', params).then(result => {
    return result
  })
}

function list (params) {
  return axios.post(url + 'getSourceByClassifyList/', params)
}

function getById (id) {
  return axios.post(url + 'getClassifyBySonId/', { id }).then(result => {
    return result
  })
}

function listblock (params) {
  return axios.post(url + 'getClassifyListByBlock/', params).then(result => {
    return result
  })
}

function classifyChildren (params) {
  return axios.post(url + 'getSourceByChildrenClassifyListForSY/', params).then(result => {
    return result
  })
}

// 商品分类，
async function listclassify (params) {
  return await axios.cancelPost(url + 'getClassifyListByStorageRoomId/', params)
}
export default {
  updateOrCreate,
  list,
  del,
  listclassify,
  getById,
  listblock,
  sorting,
  classifyChildren
}
