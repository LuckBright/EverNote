import {mallCart as axios} from '../../card/store/passportapi'
const url = 'cartItem/'

function list (params) {
  return axios.get(url + 'getPageByUserIdAndUserType', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function del (id) {
  let param = axios.jsonToFormEncoded({id: id})
  return axios.post(url + 'delete', param).then(result => {
    return result
  })
}
function getByIds (ids) {
  return axios.get(url + 'getByIds', {params: {
    ids: ids
  }}).then(result => {
    return result
  })
}
function add2Cart (params) {
  return axios.post(url + 'add2Cart', params).then(result => {
    return result
  })
}
function modify (params) {
  return axios.post(url + 'modify', params).then(result => {
    return result
  })
}
export default {
  list,
  del,
  add2Cart,
  modify,
  getByIds
}
