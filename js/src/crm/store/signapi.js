import {crm as axios} from './api'
const url = 'patientSignDoctor/'

function list (params) {
  return axios.get(url + 'getByPatientId', {params: params})
    .then((response) => {
      if (!response.data) {
        return false
      }
      response.totalCount = response.data.totalCount
      return response
    })
}
// 签约
function create (params) {
  return axios.post(url + 'create', params)
}
// 修改
function modify (params) {
  return axios.post(url + 'modify', params)
}
// 解约
function terminate (params) {
  return axios.post(url + 'terminate', params)
}
// 查询信息
function getById (params) {
  return axios.get(url + 'getById', {params: params})
    .then((rs) => {
      return rs
    })
}
export default {
  list,
  create,
  modify,
  terminate,
  getById
}
