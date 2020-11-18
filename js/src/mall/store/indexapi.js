import {mall as axios} from '../../card/store/passportapi'
const url = 'product/'
const url1 = 'category/'
const url2 = 'returnGoods/'

function list (params) {
  Object.assign(params, {status: '1'})
  return axios.get(url + 'search', {params: params})
    .then((response) => {
      // response.totalCount = response.data.totalCount
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
function syncProductRestStockNum (params) {
  return axios.get(url + 'syncProductRestStockNum', {params: params}).then(result => {
    return result
  })
}
function getByIdOrderItem (id) {
  return axios.get('orderItem/getById', {params: {
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
function exchangePosition (params) {
  let param = axios.jsonToFormEncoded(params)
  return axios.post(url1 + 'exchangePosition', param).then(result => {
    return result
  })
}
function search2Sell (params) {
  return axios.get(url + 'search2Sell', {params: params})
    .then((response) => {
      return response
    })
}
function getByThirdIdAndType (params) {
  return axios.get(url + 'getByThirdIdAndType', {params: params})
    .then((response) => {
      return response
    })
}
function getByLevel (params) {
  return axios.get(url1 + 'getByParentId', {params: params}).then(result => {
    return result
  })
}

function getIndexLevel (params) {
  return axios.get(url1 + 'getByParentIdAndStatus', {params: params}).then(result => {
    return result
  })
}
function createReturn (params) {
  return axios.post(url2 + 'create', params).then(result => {
    return result
  })
}

export default {
  create,
  changeStatus,
  exchangePosition,
  syncProductRestStockNum,
  search2Sell,
  getByThirdIdAndType,
  offLine,
  list,
  getById,
  getByLevel,
  getIndexLevel,
  getByIdOrderItem,
  createReturn
}
