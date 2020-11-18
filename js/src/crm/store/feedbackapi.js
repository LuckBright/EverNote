import { crm as axios, durl } from './api'
const url = 'feedback/'
const surl = 'systemFeedback/'
function list (params) {
  delete params.date
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function listJob (params) {
  return axios.post(durl + '/follow-up/templateJob/selectQnaireJobListById/', params)
}
function requestById (params) {
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
function screate (params) {
  return axios.post(surl + 'create', params)
}
export default {
  list,
  listJob,
  requestById,
  create,
  screate,
  submit,
  del,
  replySubmit
}
