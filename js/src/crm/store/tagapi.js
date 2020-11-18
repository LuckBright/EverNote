import {crm as axios} from './api'
const url = 'label/'

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
function createOrGet (params) {
  return axios.post(url + 'createOrGet', params)
}
function modify (params) {
  return axios.post(url + 'modify', params)
}
function updateStatus (params) {
  return axios.post(url + 'updateStatus', params)
}

function addTagbatch (params) {
  return axios.post(url + 'tagLabelBatch', params)
}
function search (params) {
  return axios.get(url + 'query', {params: params})
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
function request (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      if (!response.data) {
        return false
      }
      return response
    })
}
function batchDel (params) {
  return axios.get(url + 'deleteBatch', {params: params})
    .then((response) => {
      return response
    })
}
function validModify (params) {
  return axios.get(url + 'validModify', {params: params})
    .then((response) => {
      return response
    })
}
// 创建标签
function create (params) {
  return axios.post(url + 'create', params)
}
// 删除非系统行为标签
function deleteLalbel (parmas) {
  return axios.post('/behaviorRecord/deleteBehaviorLabelById', parmas)
}
// 行为查询
function behaviorlist (params) {
  return axios.get('/behaviorCategory/search', {params: params})
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
// 行为的创建和修改
function creatorModify (parmas) {
  return axios.post('/behaviorCategory/create', parmas)
}
export default {
  list,
  createOrGet,
  modify,
  addTagbatch,
  updateStatus,
  search,
  request,
  validModify,
  batchDel,
  create,
  deleteLalbel,
  behaviorlist,
  creatorModify
}
