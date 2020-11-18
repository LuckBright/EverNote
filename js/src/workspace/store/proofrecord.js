import { workspace as axios } from './api'

function list (param) {
  return axios.post(
    `/thc-phr/doctor/visit/search`,
    param
  )
}

function getProof (param) {
  return axios.post(
    `/medical-record/doctor/certification/search`,
    param
  )
}
function getType (param) {
  return axios.post(
    `/medical-record/doctor/medicalRecordCategory/searchCategoryList`,
    param
  )
}
function check (param) {
  return axios.post(
    `/medical-record/doctor/medicalRecord/checkAndGetPatientMedical`,
    param
  )
}
export default {
  list,
  getProof,
  getType,
  check
}
