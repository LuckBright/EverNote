import { inpatient as axios } from './api'
const url = '/phr/doctor'

function searchSpecimen (params, code) {
  return axios.post(`${url}/doctorAdvice/v3.3/searchSpecimen`, params)
}
function updateSpecimenDelivered (params, code) {
  return axios.post(`${url}/doctorAdvice/v3.3/updateSpecimenDelivered`, params)
}
function searchSpecimenTracking (params, code) {
  return axios.post(`${url}/doctorAdvice/v3.3/searchSpecimenTracking`, params)
}
export default {
  searchSpecimen,
  updateSpecimenDelivered,
  searchSpecimenTracking
}
