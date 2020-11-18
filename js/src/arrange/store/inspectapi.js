import {arrange as axios} from './api'
const url = '/arrange/'

function list (params) {
  return axios.post(url + 'appointment/getExectueAppointDtoList', params)
}
// 获取时间
function getServiceTimeslieList (params) {
  return axios.post(url + 'resourceArrange/getServiceTimeslieList', params)
}
// 预约检查
function addExectueAppointmentRecord (params) {
  return axios.post(url + 'appointment/addExectueAppointmentRecord', params)
}
// 预约检查
function cancelRecord (params) {
  return axios.post(url + 'appointment/cancelRecord', params)
}
// 更新预约
function updateRecord (params) {
  return axios.post(url + 'appointment/updateExectueAppointmentRecord', params)
}
export default {
  list,
  getServiceTimeslieList,
  addExectueAppointmentRecord,
  cancelRecord,
  updateRecord
}
