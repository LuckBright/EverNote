import {inpatient as axios} from './sobapi'
const url = '/sob/'

function list (params) {
  if (!params.searchType) {
    params.searchType = '1'
  }
  return axios.post(url + 'hospitalizedappliance/getWaittingPatientList', params)
  .then(result => {
    return result
  }).catch(err => {
    console.log(err)
    return null
  })
}

function cancel (params) {
  return axios.post(url + 'hospitalizedappliance/cancel', params)
  .then(result => {
    return result
  }).catch(err => {
    console.log(err)
    return null
  })
}
function confirm (params) {
  return axios.post(url + 'hospitalizedappliance/confirm', params)
  .then(result => {
    return result
  }).catch(err => {
    console.log(err)
    return null
  })
}

function hospitalizedSupport (params) {
  return axios.post('workbench/hospitalizedApplianceRecord/getPatientByHosNumber', params)
    .then(result => {
      return result
    }).catch(err => {
      console.log(err)
      return null
    })
}

export default {
  list,
  cancel,
  confirm,
  hospitalizedSupport
}
