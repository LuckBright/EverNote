import {arrange as axios} from './api'
const url = '/workbench/'

// 获取患者列表
function getSchedulingPatient (params) {
  return axios.post(url + 'surgeryNoticeController/getSchedulingPatient', params)
}
// 获取患者列表
function getSurgeryPatients (params) {
  return axios.post('/workbench/surgeryNoticeController/getSurgeryPatients', params)
}

// 获取科室接口
function getLocalSectionVoListForService (data) {
  return axios.post('/warehouse/localSectionRecord/getLocalSectionVoListForService/', data)
}
// 获取手术通知单
function querySurgeryNotice (data) {
  return axios.post(url + 'surgeryNoticeController/getSurgeryNoticeByIds', data)
}
// 获取手术执行的各个时间节点的已经设置的值
function getProcessNode (data) {
  return axios.post('/workbench/surgeryRrocessNodeController/getProcessNode', data)
}
// 更新手术流程节点时间
function updateNoticeTime (data) {
  return axios.post('/workbench/surgeryRrocessNodeController/updateNoticeTime', data)
}

// 判断是否可以更新手术流程节点时间
function isIntoRoom (data) {
  return axios.post('/workbench/surgeryNoticeController/isIntoRoom', data)
}
export default {
  getSurgeryPatients,
  getSchedulingPatient,
  getLocalSectionVoListForService,
  querySurgeryNotice,
  getProcessNode,
  updateNoticeTime,
  isIntoRoom
}
