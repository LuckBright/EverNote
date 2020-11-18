import {inpatient as axios} from '../sobapi'
const url = '/sob/inpatientController/'
const url1 = '/workbench/'

function list (params) {
  return axios.post(url + 'queryVerifyAdviceList', params)
}

function confirmAdvice (params) {
  return axios.post(url + 'verifyAdvice', params)
}

function getPatientsByStatus (params) {
  return axios.post(url1 + 'hospitalizedApplianceRecord/getPatientsByStatus', params)
}

export default {
  list,
  confirmAdvice,
  getPatientsByStatus
}
