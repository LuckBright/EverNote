import {crm as axios} from './api'
import {sob as sobaxios} from '../../sob/store/api'
const url = 'feedback/'

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
function create (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function submit (id) {
  return axios.post(url + 'submit', {id: id})
}
function execute (params) {
  return axios.post(url + 'performance', params)
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
function getVistStaff (params) {
  return sobaxios.post('providerdoctor/getProviderDoctorByProviderId', params)
}
export default {
  list,
  create,
  submit,
  search,
  request,
  execute,
  batchDel,
  getVistStaff
}
