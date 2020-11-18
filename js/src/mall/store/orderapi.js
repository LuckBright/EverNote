import {mall as axios} from '../../card/store/passportapi'
const url = 'order/'

function list (params) {
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function searchMember (params) {
  return axios.get(url + 'search4Member', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function getById (id) {
  return axios.get(url + 'getById', {params: {
    id: id
  }}).then(result => {
    return result
  })
}
function refund (id) {
  var params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'refund', params).then(result => {
    return result
  })
}
function pay (id) {
  var params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'pay', params).then(result => {
    return result
  })
}
function cancel (id) {
  var params = {
    id: id
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'cancel', params).then(result => {
    return result
  })
}

function sendGoods (id, payStatement) {
  var params = {
    id: id,
    payStatement: payStatement
  }
  params = axios.jsonToFormEncoded(params)
  return axios.post(url + 'sendGoods', params).then(result => {
    return result
  })
}
export default {
  list,
  searchMember,
  getById,
  pay,
  refund,
  cancel,
  sendGoods
}
