import {crm as axios} from './api'
const url = 'smsType/'

function list (params) {
  return axios.get(url + 'getByOrigId', {params: params})
    .then((response) => {
      return response
    })
}
function create (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + action, params)
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
  del
}
