import {sob as axios} from '../api'
const url = 'service/'

function list (params) {
  return axios.post(url + 'getDirectParentOrgServiceNoSync/', params)
    .then((response) => {
      return response
    })
}

export default {
  list
}
