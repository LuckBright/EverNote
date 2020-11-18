import { arrange as axios } from './api'
const url = '/arrange/'

// 查询麻醉方式
function getSysTypeInfoList (params) {
  return axios.post('/warehouse/sysTypeInfo/getSysTypeInfoList/', { code: 'CV06.00.103' })
}
// 申请预约
function addAppointment (params) {
  return axios.post(url + 'appointment/addExectueAppointmentRecord', params)
}
// 更新预约
function updateAppointment (params) {
  return axios.post(url + 'appointment/updateExectueAppointmentRecord', params)
}
// 取消预约
function cancelRecord (params) {
  return axios.post(url + 'appointment/cancelRecord', params)
}

// 获取房间
function getWard (params) {
  return axios.post('/arrange/resourceArrange/getArrangeResourceOnly', params)
}
// 获取房间
function getTotal (params) {
  return axios.post(url + 'appointment/queryRecordList', params)
}

// 获取房间
function getAppoint (params) {
  return axios.post(url + 'appointment/getOperationRoomDayAppointmentList', params)
}

// 获取单个已经预约的回显信息
function getAppointmentRecordById (data) {
  return axios.post('/arrange/appointment/getAppointmentRecordById', data)
}

// 台次排序
function getSurgeryStage (data) {
  return axios.post('/workbench/surgeryNoticeController/getSurgeryStage', data)
}

// 根据条件获取手术
function querySurgeryNotice (data) {
  return axios.post('/workbench/surgeryNoticeController/querySurgeryNotice', data)
}

export default {
  querySurgeryNotice,
  updateAppointment,
  addAppointment,
  getWard,
  getTotal,
  getSysTypeInfoList,
  getAppoint,
  cancelRecord,
  getSurgeryStage,
  getAppointmentRecordById
}
