import {crm as axios} from './api'
const url = 'memberChannelCoopType/'
function request (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      response.data.status = response.data.status.toString()
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
function submit (id) {
  return axios.post(url + 'submit', {id: id})
}
function replySubmit (id) {
  return axios.post(url + 'replySubmit', {id: id})
}
function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      return response
    })
}
function typecreate (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
export default {
  request,
  create,
  typecreate,
  submit,
  del,
  replySubmit,
  list
}
