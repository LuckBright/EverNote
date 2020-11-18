import {arrange as axios} from './api'

// 根据条件获取手术
function getResourceArrangeTimesliceList (data) {
  return axios.post('/arrange/resourceArrange/getDeptTimesliceList', data)
}

// 根据条件获取手术可预约时间
function addExectueAppointmentRecord (data) {
  return axios.post('/arrange/appointment/addExectueAppointmentRecord', data)
}

// 创建手术
function createSurgeryNotice (data) {
  return axios.post('/workbench/surgeryNoticeController/createSurgeryNotice', data)
}

// -------------------new手麻管理工作站接口-------------
function querySurgeryNotificationList (data) {
  return axios.post('/workbench/surgeryNotification/querySurgeryNotificationList', data)
}

function getSurgeryNotification (data) {
  return axios.post('/workbench/surgeryNotification/getSurgeryNotification', data)
}

function getStaffListByCondition (data) {
  return axios.post('/thc-platform-core/out/staff/getStaffListByCondition', data)
}

// 手术统计接口
function getSurgeryStatistics (data) {
  return axios.post('/workbench/surgeryNotification/getSurgeryStatistics', data)
}

// 当前服务器时间
function getCurrentTime (data) {
  return axios.get('/thc-platform-core/unify/getCurrentTime', data)
}

// 根据机构，获取科室
function getTenantSubjectListByCondition (params) {
  return axios.post('/thc-platform-core/out/subject/getTenantSubjectListByCondition', params)
}

// 术后登记
function savePostOperation (params) {
  return axios.post('/workbench/surgeryNotification/savePostOperation', params)
}

// 取消预约
function cancelSurgery (params) {
  return axios.post('/workbench/surgeryNotification/cancelSurgery', params).then(res => {
    return res
  }).catch(err => {
    return err
  })
}

// 取消手术
function cancelExecute (params) {
  return axios.post('/workbench/surgeryNotification/cancelExecute', params)
}

// 保存手术表单
function saveSurgeryForm (params) {
  return axios.post('/workbench/surgeryNotification/saveSurgeryForm', params)
}

function getTenantSubjectListHasRoomByCondition (params) {
  return axios.post('/thc-platform-core/out/subject/getTenantSubjectListHasRoomByCondition', params)
}

function getById (params) {
  return axios.get('/arrange/appt/advice-execute/getById' + '?id=' + params.id)
}
// 保存执行单
function saveSurgeryExecut (params) {
  return axios.post('/workbench/surgeryNotification/saveSurgeryExecute', params).then(res => {
    return res
  }).catch(err => {
    return err
  })
}
// 获取执行单
function getSurgeryExecute (params) {
  return axios.post('/workbench/surgeryNotification/getSurgeryExecute', params)
}

export default {
  getCurrentTime,
  getTenantSubjectListHasRoomByCondition,
  getResourceArrangeTimesliceList,
  addExectueAppointmentRecord,
  createSurgeryNotice,
  querySurgeryNotificationList,
  getSurgeryNotification,
  getStaffListByCondition,
  getSurgeryStatistics,
  getTenantSubjectListByCondition,
  saveSurgeryExecut,
  savePostOperation,
  cancelExecute,
  saveSurgeryForm,
  getById,
  getSurgeryExecute,
  cancelSurgery
}
