import axios from '../api'

const clinicUrl = 'pub/setofbook/'
const yearUrl = 'pub/control/'

function list (params) {
  return axios.post('ic/periodManage/getPeriod', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function update (params) {
  return axios.post('ic/periodManage/updatePeriod', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getListByClinicId (params) {
  return axios.post(clinicUrl + 'getListByClinicId/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getPeriodYear (params) {
  return axios.post(yearUrl + 'getPeriodYear/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  list,
  update,
  getListByClinicId,
  getPeriodYear
}
