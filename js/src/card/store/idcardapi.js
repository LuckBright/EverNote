import {
  card as axios
}
from './api'
const url = '/benefit/'
const url1 = '/marketHistory/'

function createOrUpdate (obj) {
  let path = obj.id ? 'modify' : 'create'
  return axios.post(url + path + '/', obj)
}

// 新建（需审批）
function createApply (obj) {
  // let params = axios.jsonToFormEncoded({
  //   id: id
  // })
  return axios.post(url + 'apply/', obj)
}
function modifyObj (obj) {
  return axios.post(url + 'modify/', obj)
}
function modifyCheck (obj) {
  return axios.post(url + 'modifyCheck/', obj)
}
function apply (obj) {
  return axios.post(url + 'apply/', obj)
}

function freeze (obj) {
  let path = Number(obj.status) === 0 ? 'freeze' : 'unfreeze'
  let params = axios.jsonToFormEncoded({
    id: obj.id
  })
  return axios.post(url + path + '/', params)
}
function del (obj) {
  let params = Object.assign(obj, { isDelete: 1 })
  return axios.post(url + 'delete/', params)
}
function getById (params) {
  return axios.get(url + 'getById', { params })
}
function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function modify (obj) {
  return axios.post(url + 'modifyServiceIds' + '/', obj)
}
function getByTypeAndObjId (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.get(url1 + 'getByTypeAndObjId/', {params: params})
}
// 使用范围修改(集团)
function modifyUseRange (params) {
  return axios.post(url + 'modifyUseRange/', params)
}
export default {
  createOrUpdate,
  del,
  list,
  freeze,
  modify,
  apply,
  createApply,
  getById,
  modifyObj,
  modifyCheck,
  getByTypeAndObjId,
  modifyUseRange
}
