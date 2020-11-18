import {workspace as axios} from './api'
const url = '/phr/'
const thcPhr = '/thc-phr/doctor/'

// 获取患者就诊历史
function getOutHosiptalHistoryByPatientId (params) {
  return axios.post(thcPhr + 'medicalRecord/getOutHosiptalHistoryByPatientId', params)
}

function del (id) {
  return axios.post(url + 'updateBloc/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getBlocList/', params)
}

function getAppointInfo (visitNumber) {
  return axios.post('/sob/order/getAppointOrder', {
    visitNumber
  })
}

function getByRangeCode (data) {
  return axios.post('/platform-extend/disease/diseaseGroup/getByRangeCode', data)
}

function searchByRange (data) {
  return axios.post('/platform-extend/disease/diseaseOrig/searchByRange', data)
}

function noticeMsgGet (data) {
  return axios.post('/workbench/noticeMsg/get', data)
}

function noticeMsgReset (data) {
  return axios.post('/workbench/noticeMsg/reset', data)
}

export default {
  searchByRange,
  getByRangeCode,
  del,
  list,
  getAppointInfo,
  getOutHosiptalHistoryByPatientId,
  noticeMsgGet,
  noticeMsgReset
}
