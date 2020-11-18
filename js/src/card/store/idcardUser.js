import {
  card as axios
}
from './api'
const url = '/patientBenefit/'

function getById (id) {
  return axios.get(url + 'getById/', {params: {
    id: id
  }}).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  return axios.post(url + 'createBatch/', obj)
}

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      return response
    })
}
function addVipUsers (params) {
  return axios.post(url + 'batchBind', params)
    .then((response) => {
      return response
    })
}
function getVipUsers (params) {
  return axios.get(url + 'getByBenefitIdAndPatientIds', {params: params})
    .then((response) => {
      return response
    })
}
function unBindUser (id) {
  let params = axios.jsonToFormEncoded({
    id: id
  })
  return axios.post(url + 'unbind/', params)
    .then((response) => {
      return response
    })
}
export default {
  getById,
  createOrUpdate,
  list,
  addVipUsers,
  getVipUsers,
  unBindUser
}
