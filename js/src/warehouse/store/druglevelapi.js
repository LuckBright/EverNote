import { warehouse as axios } from './api'
const url = 'drugLevel/'

function bycode (params) {
  return axios.post(url + 'findByPcode/', params)
}

function bylevel (params) {
  return axios.post(url + 'findByLevel/', params)
}

function createOrUpdate (obj) {
  var path = obj.id ? 'update' : 'create'
  return axios.post(url + path + '/', obj)
}

function getById (id) {
  return axios.post(url + 'getDrugLevelInfo/', {
    id: id
  }).then(result => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getDrugLevelList/', params)
}
export default {
  bycode,
  bylevel,
  createOrUpdate,
  getById,
  list
}
