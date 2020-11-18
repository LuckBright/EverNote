import {mall as axios} from '../../card/store/passportapi'
const url = 'cartItem/'
const url1 = 'order/'
const url2 = 'marketOrder/'

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
function createOrder (params) {
  return axios.post(url1 + 'create', params).then(result => {
    return result
  })
}
function charge (params) {
  return axios.post(url2 + 'charge', params).then(result => {
    return result
  })
}
function search4Charge (params) {
  return axios.get(url2 + 'search4Charge', {params: params}).then(result => {
    return result
  })
}
function validCode (params) {
  return axios.get(url2 + 'isCodeAlreadySale', {params: params}).then(result => {
    return result
  })
}
export default {
  list,
  del,
  add2Cart,
  modify,
  getByIds,
  createOrder,
  validCode,
  charge,
  search4Charge
}
