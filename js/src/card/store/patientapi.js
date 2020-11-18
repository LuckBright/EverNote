import {passport as axios} from './passportapi'

let url = 'patient/'
function getById (id) {
  return axios.get(url + 'getById', {
    params: {
      id,
      needIden: true
    }
  }).then(result => {
    return result
  })
}

export default {
  getById
}
