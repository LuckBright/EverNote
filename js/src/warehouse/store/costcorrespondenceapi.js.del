import axios from '@/insurance/store/api'
const url = '/rcm/api'

function getSelect (params) {
  return axios.post(url + '/costItem/getLast', params).then(result => {
    return result
  })
}

function getAll (params) {
  return axios.post(url + '/scmapping/getAll', params).then(result => {
    return result
  })
}
function getAccListEnd (params) {
  return axios.post('/rcm/pub/account/getAccListEnd', params).then(result => {
    return result
  })
}
function add (params) {
  return axios.post(url + '/scmapping/create', params).then(result => {
    return result
  })
}
function edit (params) {
  return axios.post(url + '/scmapping/update', params).then(result => {
    return result
  })
}
export default {
  getSelect,
  getAll,
  getAccListEnd,
  add,
  edit
}
