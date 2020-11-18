import { inpatient as axios } from '../sobapi'
const url = '/sob/inpatientController/'

function list (params) {
  return axios.post(url + 'querySpecimenManagementList', params)
}

// 标签打印
function printBarCode (params) {
  return axios.post(url + 'printBarCode', params)
}

// 取消标签打印
function cancelPrint (params) {
  return axios.post(url + 'cancelPrint', params)
}

// 合管
function mergeSpeciment (params) {
  return axios.post(url + 'mergeSpeciment', params)
}

// 取消合管
function cancelMerge (params) {
  return axios.post(url + 'cancelMerge', params)
}

// 取消合管
function sendSpeciment (params) {
  return axios.post(url + 'sendSpeciment', params)
}

// 取消合管
function cancelSendSpeciment (params) {
  return axios.post(url + 'cancelSendSpeciment', params)
}

// 取消合管
function collectSpeciment (params) {
  return axios.post(url + 'collectSpeciment', params)
}

// 取消合管
function cancelCollectSpeciment (params) {
  return axios.post(url + 'cancelCollectSpeciment', params)
}

export default {
  list,
  printBarCode,
  cancelPrint,
  mergeSpeciment,
  cancelMerge,
  sendSpeciment,
  cancelSendSpeciment,
  collectSpeciment,
  cancelCollectSpeciment
}
