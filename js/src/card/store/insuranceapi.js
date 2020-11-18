import {passport as axios} from './passportapi'

let url = 'busiInsur/'
function listByUser (patientId) {
  return axios.get(url + 'getByPatientId', {
    params: {
      patientId
    }
  }).then(result => {
    result.data = result.data.map(v => {
      v.code = v.id
      return v
    })
    return result
  })
}

export default {
  listByUser
}

