import axios from './api'
import diction from '../../store/common'
const listurl = 'ap/payment/'
const url = 'ap/apVerifaction/'

function searchPrepayVerify (id) {
  return axios.post(url + 'searchPrepayVerify', {
    prePayId: id
  }).then(result => {
    return result
  })
}
function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function cancelVerify (id) {
  return axios.post(url + 'cancelVerify/', {
    verifyDetailId: id
  }).then(response => {
    return response
  })
}

function list (params) {
  return axios.post(listurl + 'getPrePayList/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function getClinicList (params) {
  return axios.post(`${diction.api}/thc-platform-core/tsOrganization/loadWithChildsById`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
export default {
  searchPrepayVerify,
  createOrUpdate,
  cancelVerify,
  list,
  getClinicList
}
