import {
  card as axios
}
  from './api'
const url = 'memberCard/'

function getCardsByUser (patientId) {
  return axios.get(url + 'getAllByPatientId', {
    params: {
      patientId
    }
  })
}

export default {
  getCardsByUser
}
