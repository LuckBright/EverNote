import {mall as axios} from '../../card/store/passportapi'
const url = 'product/'
const url1 = 'category/'

// function list (params) {
//   Object.assign(params, {status: '1'})
//   return axios.get(url + 'search', {params: params})
//     .then((response) => {
//       // response.totalCount = response.data.totalCount
//       return response
//     })
// }
function getById (id) {
  return axios.get(url + 'getById', {params: {
    id: id
  }}).then(result => {
    return result
  })
}
function offLine (id) {
  let param = axios.jsonToFormEncoded({id: id})
  return axios.post(url + 'offLine', param).then(result => {
    return result
  })
}
function batchOnLine (ids) {
  return axios.post(url + 'batchOnLine', ids).then(result => {
    return result
  })
}

function create (params, id) {
  let path = id ? 'modify' : 'create'
  return axios.post(url1 + path, params).then(result => {
    return result
  })
}
function changeStatus (params) {
  let param = axios.jsonToFormEncoded(params)
  return axios.post(url1 + 'changeStatus', param).then(result => {
    return result
  })
}
function associate (params) {
  return axios.post(url + 'associate', params).then(result => {
    return result
  })
}

function exchangePosition (params) {
  let param = axios.jsonToFormEncoded(params)
  return axios.post(url1 + 'exchangePosition', param).then(result => {
    return result
  })
}
function list (params) {
  return axios.get(url + 'publish', {params: params})
    .then((response) => {
      return response
    })
}

function getByLevel (params) {
  return axios.get(url1 + 'getByParentId', {params: params}).then(result => {
    return result
  })
}

export default {
  create,
  changeStatus,
  exchangePosition,
  batchOnLine,
  associate,
  // search2Sell,
  offLine,
  list,
  getById,
  getByLevel
}
