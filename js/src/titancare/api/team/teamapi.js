import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()

axios.defaults.baseURL += prefix.cms

let url = 'team/'

function list (params) {
  return axios.post(url + 'search', params)
}

function getServiceList (params) {
  return axios.post(url + 'getServiceList', params)
}

function getDoctorList (params) {
  return axios.post(url + 'getDoctorList', params)
}

function create (params) {
  return axios.post(url + 'create', params)
}

function update (params) {
  return axios.post(url + 'update', params)
}

function deleteTeam (params) {
  return axios.get(url + 'deleteById', { params })
}

function getById (params) {
  return axios.get(url + 'getById', { params })
}

export default {
  list,
  getServiceList,
  getDoctorList,
  create,
  update,
  deleteTeam,
  getById
}
