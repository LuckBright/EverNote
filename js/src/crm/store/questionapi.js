import {crm as axios} from './api'
const url = 'paper/'

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
function create (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
}
function request (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      return response
    })
}
function del (params) {
  return axios.get(url + 'delete', {params: params})
    .then((response) => {
      return response
    })
}
export default {
  list,
  create,
  del,
  request
}
