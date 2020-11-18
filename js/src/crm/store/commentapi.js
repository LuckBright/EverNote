import {crm as axios} from './api'
const url = 'eva/'
function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function request (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      return response
    })
}
function create (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function del (params) {
  return axios.get(url + 'delete', {params: params})
    .then((response) => {
      return response
    })
}
function submit (params) {
  return axios.post(url + 'audit', params)
}
export default {
  list,
  request,
  create,
  del,
  submit
}
