import {sob} from './api'
const url = 'providerdoctor/'

function relation (providerId, doctorIds) {
  var path = 'createProviderDoctor'
  return sob.post(url + path + '/', {
    providerId,
    doctorId: doctorIds
  })
}

function removeRelation (providerId, doctorIds) {
  return sob.post(url + 'deleteProviderDoctor/', {
    providerId,
    ids: doctorIds
  })
}

function list (providerId) {
  return sob.post(url + 'getProviderDoctorList/', {
    providerId
  }).then((response) => {
    return response
  })
}

function getDepts (doctorId) {
  return sob.post(url + 'listByDoctorId', {doctorId})
}

export default {
  relation,
  removeRelation,
  list,
  getDepts
}

