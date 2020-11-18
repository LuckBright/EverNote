import { arrange as axios } from './api'
const url = '/arrange/'

function list (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/searchNurseResourceArrangeList', params)
}

function getNurseResourceArrangeDetail (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/getNurseResourceArrangeDetail', params)
}

function getNurseResourceArrange (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/getNurseResourceArrange', params)
}

function saveOrUpdateNurseResourceArrange (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/saveOrUpdateNurseResourceArrange', params)
}

function deleteNurseResourceArrange (params) {
  return axios.post(url + 'resourceArrangeZzAssistant/deleteNurseResourceArrange', params)
}

export default {
  list,
  getNurseResourceArrangeDetail,
  getNurseResourceArrange,
  saveOrUpdateNurseResourceArrange,
  deleteNurseResourceArrange
}
