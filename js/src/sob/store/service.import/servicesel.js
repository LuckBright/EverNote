import {sob as axios} from '../api'
const url = 'serviceset/'

function list (params) {
  return axios.post(url + 'queryItemNotInServiceSet', params)
    .then((response) => {
      return response
    })
}

export default {
  list
}
