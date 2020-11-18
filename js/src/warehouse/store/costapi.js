import axios from '@/insurance/store/api'
const url = '/rcm/api'

function addcost (params) {
  return axios.post(url + '/costItem/create', params).then(result => {
    return result
  })
}

function editcost (params) {
  return axios.post(url + '/costItem/update', params).then(result => {
    return result
  })
}
function list (params) {
  return axios.post(url + '/costItem/search', params).then(result => {
    return result
  })
}
function del (params) {
  return axios.post(url + '/costItem/delete', params).then(result => {
    return result
  })
}
function getById (params) {
  return axios.post(url + '/costItem/getById', params).then(result => {
    return result
  })
}
function getSpell (params) {
  return axios.post(url + '/costItem/getSpell', params).then(result => {
    return result
  })
}
export default {
  addcost,
  editcost,
  list,
  del,
  getById,
  getSpell
}
