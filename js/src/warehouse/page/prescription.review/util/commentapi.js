import { warehouse as axios } from '@/warehouse/store/api'
const url = '/recipeClassify/'

function list (params) {
  return axios.post(url + 'list/', params)
}

function createdAndUpdate (params) {
  return axios.post(url + 'edit/', params)
}

function editStatus (params) {
  return axios.post(url + 'editStatus/', params)
}

function getById (params) {
  return axios.post(url + 'listByIds/', params)
}

export default {
  list,
  createdAndUpdate,
  editStatus,
  getById
}
