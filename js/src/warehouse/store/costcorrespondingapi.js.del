import axios from '@/insurance/store/api'
const url = '/rcm/api'

function addcost (params) {
  return axios.post(url + '/serviceItem/create', params).then(result => {
    return result
  })
}

function editcost (params) {
  return axios.post(url + '/serviceItem/update', params).then(result => {
    return result
  })
}
function list (params) {
  return axios.post(url + '/serviceItem/search', params).then(result => {
    return result
  })
}
function del (params) {
  return axios.post(url + '/serviceItem/delete', params).then(result => {
    return result
  })
}
function getById (params) {
  return axios.post(url + '/serviceItem/getById', params).then(result => {
    return result
  })
}
export default {
  addcost,
  editcost,
  list,
  del,
  getById
}
