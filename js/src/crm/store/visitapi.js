import { crm as axios } from './api'
const url = 'followUp/'

function list (params) {
  return axios.get(url + 'search', { params: params })
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
function create (params) {
  let action = params.id ? 'modify' : 'createBatch'
  return axios.post(url + action, params)
}
function execute (params) {
  return axios.post(url + 'performance', params)
}
function search (params) {
  return axios.get(url + 'query', { params: params })
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
function request (params) {
  return axios.get(url + 'getById', { params: params })
    .then((response) => {
      if (!response.data) {
        return false
      }
      return response
    })
}
function batchDel (params) {
  return axios.get(url + 'deleteBatch', { params: params })
    .then((response) => {
      return response
    })
}

export default {
  list,
  create,
  search,
  request,
  execute,
  batchDel
}
