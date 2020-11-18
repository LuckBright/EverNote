import {crm as axios} from './api'
const url = 'sob/'

function getDptList (params) {
  return axios.get(url + 'getDpts', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  getDptList
}
