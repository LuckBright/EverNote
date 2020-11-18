import axios from '../api'

const clinicUrl = 'pub/setofbook/'
const yearUrl = 'pub/control/'

function getSetOfBook (params) {
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
  getSetOfBook,
  getPeriodYear
}

