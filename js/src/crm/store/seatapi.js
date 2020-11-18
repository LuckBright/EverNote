import {crm as axios} from './api'
const url = 'seat/'

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function getById (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      return response
    })
}
function createOrModify (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function deleteId (params) {
  console.log(params)
  return axios.get(url + 'delete', {params: params})
    .then((response) => {
      return response
    })
}
function getUserCall (params) {
  return axios.get(url + 'getByPatientId', {params: params})
    .then((response) => {
      return response
    })
}

function getSeatStatus (params) {
  return axios.get(url + 'getByDoctorId', {params: params})
    .then((response) => {
      return response
    })
}
function getYtxConfig (params) {
  return axios.get(url + 'getH5SDKConfig', {params: params})
    .then((response) => {
      return response
    })
}
function getUpdateStatue (params) {
  return axios.get(url + 'updateStatus', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  list,
  getById,
  deleteId,
  createOrModify,
  getUserCall,
  getYtxConfig,
  getSeatStatus,
  getUpdateStatue
}
