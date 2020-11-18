import {passport as axios} from '../../card/store/passportapi'
const url = 'patient/'

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function getById (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  list,
  getById
}
