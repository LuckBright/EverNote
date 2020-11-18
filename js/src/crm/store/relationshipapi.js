import { crm as axios, durl } from './api'
function list (params) {
  return axios.get(durl + '/c-union/doctor/contact/getByPatientId', { params: params })
    .then((response) => {
      if (response.data) {
        response.totalCount = response.data.totalCount
      }
      return response
    })
}
// 添加关系人
function create (params) {
  return axios.post(durl + '/c-union/doctor/contact/create', params)
}
// 删除共享储值人
function deleteRow (params) {
  return axios.post(durl + '/market/doctor/memberCardShare/deleteGhByPatientId', params)
}
// 删除联系人
function deleteContact (params) {
  return axios.post(durl + '/c-union/doctor/contact/deleteByRelateId', params)
}
// 新增共享储值人
function createShare (params) {
  return axios.post(durl + '/market/doctor/memberCardShare/createGhByPatientId', params)
}
// 取消共享储值人
function cancleShare (params) {
  return axios.post(durl + '/market/doctor/memberCardShare/deleteGhByPatientId', params)
}
export default {
  list,
  create,
  deleteRow,
  deleteContact,
  createShare,
  cancleShare
}
