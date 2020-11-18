import {crm as axios} from './api'
const url = 'memberChannelComm/'
const purl = 'memberChannelProfitMod/'
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
  return axios.post(url + 'create', params)
}
function profitcreate (params) {
  return axios.post(purl + 'create', params)
}
function del (params) {
  return axios.get(url + 'delete', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  list,
  request,
  create,
  profitcreate,
  del
}
