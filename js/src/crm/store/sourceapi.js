import {crm as axios} from './api'
const url = 'memberChannelType/'
const surl = 'memberChannel/'
const seturl = 'memberChannelSettle/'
function getTypelist (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function getsettlelist (params) {
  return axios.get(seturl + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function request (params) {
  return axios.get(surl + 'getById', {params: params})
    .then((response) => {
      response.data.status = response.data.status.toString()
      return response
    })
}
function getById (params) {
  return axios.get(seturl + 'getById', {params: params})
    .then((response) => {
      return response
    })
}
function getStatistics () {
  return axios.get(surl + 'getStatistics')
    .then((response) => {
      return response
    })
}
function create (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function sourceCreate (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(surl + action, params)
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
  return axios.get(surl + 'search', {params: params})
    .then((response) => {
      return response
    })
}
function typecreate (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function getChannels () { // 获取渠道列表
  return axios.get('memberChannel/search', {params: {offset: 0, pagesize: 1000, parentId: 0}})
}
export default {
  getTypelist,
  getsettlelist,
  request,
  getById,
  getStatistics,
  create,
  typecreate,
  sourceCreate,
  submit,
  del,
  replySubmit,
  list,
  getChannels
}
