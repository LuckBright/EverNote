import { arrange as axios } from './api'

const url = '/workbench/'

// 获取查询列表
function list (params) {
  return axios.post(url + 'surgeryNoticeController/querySurgeryNotice', params)
}

// 导出列表
function exportSurgeryNotice (params) {
  return axios.post(url + 'surgeryNoticeController/exportSurgeryNotice', params)
}
// 获取医生
function getDoctor (params) {
  return axios.post('warehouse/staffRecord/getStaffRecordVoListForService/', params)
}
// 执行
function createSurgeryNotice (params) {
  return axios.post('/workbench/surgeryNoticeController/createSurgeryNotice', params)
}

// 取消手术
function cancelSurgery (data) {
  return axios.post('/workbench/surgeryNoticeController/cancelSurgery', data)
}

// 执行地
function getRoomRecordVoListForService (data) {
  return axios.post('/warehouse/roomRecord/getRoomRecordVoListForService/', data)
}
// 执行地
function getAppointmentItem (data) {
  return axios.post('/workbench/surgeryNoticeController/getAppointmentItem', data)
}

// 出入室交界
function createHandover (data) {
  return axios.post('/workbench/entranceHandoverController/createHandover', data)
}
// 出入室交界回显
function getHandOverPatient (data) {
  return axios.post('/workbench/surgeryNoticeController/getHandOverPatient', data)
}

export default {
  getHandOverPatient,
  createHandover,
  cancelSurgery,
  list,
  exportSurgeryNotice,
  getDoctor,
  createSurgeryNotice,
  getRoomRecordVoListForService,
  getAppointmentItem
}
