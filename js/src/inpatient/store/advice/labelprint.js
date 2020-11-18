import { inpatient as axios } from '../sobapi'
const url = 'phr/doctor/doctorAdvice/v3.3/'

function list (params) {
  return axios.post(url + 'printerSearch', params)
}

function confirmCollect (params) {
  return axios.post(url + 'updateGather', params)
}

function updatePrint (params) {
  return axios.post(url + 'updatePrint', params)
}

function tubeOperate (params) {
  return axios.post(url + 'mergeTube', params)
}

export default {
  list,
  confirmCollect,
  updatePrint,
  tubeOperate
}
