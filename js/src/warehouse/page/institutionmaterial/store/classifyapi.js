import { drug as axios } from '@/warehouse/store/api'
const url = '/classify/'

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

async function list (params) {
  return await axios.post(url + 'getClassifyList/', params)
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

export default {
  updateOrCreate,
  list,
  del,
  getById,
  listblock,
  sorting
}
