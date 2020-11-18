import {crm as axios} from './api'
const url = 'callRecord/'
const url1 = 'ivrAgent/'

function list (params) {
  return axios.get(url + 'getPageByOrigIdAndType', {params: params})
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
function calling (params) {
  return axios.post('ivr/callOut', params)
}
function getUserCall (params) {
  return axios.get(url + 'getByPatientId', {params: params})
    .then((response) => {
      return response
    })
}
function getAnswerType (params) {
  return axios.get(url1 + 'getAnswerType', {params: params})
    .then((response) => {
      return response
    })
}

function makeCall (params) {
  return axios.get(url1 + 'agentMakeCall', {params: params})
    .then((response) => {
      return response
    })
}

function getCallDetail (params) {
  return axios.get(url + 'getByCallId', {params: params})
    .then((response) => {
      return response
    })
}

function agentConsult (params) {
  return axios.get(url1 + 'agentConsult', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  list,
  request,
  calling,
  getUserCall,
  getAnswerType,
  makeCall,
  getCallDetail,
  agentConsult
}
