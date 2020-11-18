import { card as axios } from './api'
const url = '/memberCardBatch/'
const url1 = '/memberCard/'

function createOrUpdate (obj) {
  let path = obj.id ? 'modify' : 'create'
  return axios.post(url + path + '/', obj)
}
// 创建草稿
function draft (obj) {
  return axios.post(url + 'apply/', obj)
}
function modifyObj (obj) {
  return axios.post(url + 'modify/', obj)
}
function apply (id) {
  let params = axios.jsonToFormEncoded({
    id: id
  })
  return axios.post(url + 'apply/', params)
}
function getById (id) {
  let params = axios.jsonToFormEncoded({
    id: id
  })
  return axios.get(url + 'getById/', { params: params })
}
function getByCode (param) {
  let params = axios.jsonToFormEncoded(param)
  return axios.get(url1 + 'search4Charge', { params: params })
}
function freeze (obj) {
  let path = Number(obj.status) === 0 ? 'freeze' : 'unfreeze'
  let params = axios.jsonToFormEncoded({
    id: obj.id
  })
  return axios.post(url + path + '/', params)
}
function del (id) {
  let params = axios.jsonToFormEncoded({
    id: id,
    isDelete: 1
  })
  return axios.post(url + 'delete/', params)
}

function list (params) {
  return axios.get(url + 'search', { params: params })
    .then((response) => {
      return response
    })
}
function modify (obj) {
  return axios.post(url + 'modifyServiceIds' + '/', obj)
}

export default {
  createOrUpdate,
  del,
  list,
  freeze,
  modify,
  draft,
  apply,
  getById,
  modifyObj,
  getByCode,
}
