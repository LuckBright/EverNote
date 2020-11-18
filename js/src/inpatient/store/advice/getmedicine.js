import { inpatient as axios } from '../sobapi'
const url = '/sob/inpatientController/'

function list (params) {
  return axios.post(url + 'queryDrugManagementList', params)
}

// 提交
function submitMaterials (params) {
  return axios.post(url + 'submitMaterials', params)
}

// 取消
function cancelMaterials (params) {
  return axios.post(url + 'cancelMaterials', params)
}

// 提交
function returnMaterials (params) {
  return axios.post(url + 'returnMaterials', params)
}

// 提交
function confirmMaterials (params) {
  return axios.post(url + 'confirmMaterials', params)
}

export default {
  list,
  submitMaterials,
  cancelMaterials,
  returnMaterials,
  confirmMaterials
}
