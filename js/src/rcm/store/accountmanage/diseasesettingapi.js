import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/api/'

function del (params) {
  return axios.post(url + 'diseaseSet/delete', params)
}
function add (params) {
  return axios.post(url + 'diseaseSet/create', params)
}

function list (params) {
  return axios.post(url + 'diseaseSet/getDiseaseSetList', params)
}
function update (params) {
  return axios.post(url + 'diseaseSet/update', params)
}

export default {
  del,
  add,
  update,
  list
}
