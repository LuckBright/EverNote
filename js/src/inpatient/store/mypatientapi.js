import {inpatient as axios} from './sobapi'
const url = '/sob/'

function list (params) {
  return axios.post(url + 'hospitalizedappliance/getlistByCondition', params).then(result => {
    return result
  })
}

function getDoctorByProviderId (id) {
  return axios.post(url + 'providerdoctor/getDoctorByProviderId', {
    id
  })
}

function getPatientIdList (params) {
  return axios.post(url + 'hospitalizedappliance/getPatientIdList', params).then((response) => {
    return response
  })
}
// 所有的患者
function getPatientIdAll (params) {
  return axios.post(url + 'hospitalizedappliance/getPatientIdInhos', params).then((response) => {
    return response
  })
}
export default {
  list,
  getDoctorByProviderId,
  getPatientIdList,
  getPatientIdAll
}
