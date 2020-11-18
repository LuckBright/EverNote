import {crm as axios} from './api'
const url = 'smsSendHis/'

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function request (params) {
  return axios.get(url + 'getById', {params: params})
    .then((response) => {
      return response
    })
}
function getPage (params) {
  return axios.post(url + 'getPage', params)
}
export default {
  list,
  request,
  getPage
}
