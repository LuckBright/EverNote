import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/api/'

function del (params) {
  return axios.post(url + 'diagnoseDisease/delete', params)
}
function add (params) {
  return axios.post(url + 'diagnoseDisease/create', params)
}

function list (params) {
  return axios.post(url + 'diagnoseDisease/getDiagnoseDiseaseMappingList', params)
}
function update (params) {
  return axios.post(url + 'diagnoseDisease/update', params)
}
function getSelect (params) {
  return axios.post(url + 'diseaseSet/getDiseaseSetList', params)
}
export default {
  del,
  add,
  update,
  list,
  getSelect
}
