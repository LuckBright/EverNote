import { workspace as axios } from './api'
import { diction } from '@/store/common'
let url = diction.api + '/phr/doctor/physicalExamItem/v3.3'
let url1 = diction.api + '/phr/doctor/physicalExam/v3.3'
let url2 = diction.api + '/phr/doctor/executeResult/v3.3'

// 检查检验项目总内容（勤平）
function getByExecVisitSn (params) {
  return axios.post(url + '/getByExecVisitSn', params)
}
// 查看检查检验项目内容 （勤平）
function adviceIdAndAdviceType (params) {
  return axios.post(url2 + '/adviceIdAndAdviceType', params)
}

// 获取总检是否完成状态(总检页面)
function getExamStatus (params) {
  return axios.post(url1 + '/getByStatus', params)
}
// 获取总检是否完成状态(分检页面)
function getByItemStatus (params) {
  return axios.post(url + '/getByItemStatus', params)
}

// 分检汇总
// 保存(志圈)
function saveItemDataToMedicalRecord (params) {
  return axios.post(url + '/saveItemDataToMedicalRecord', params)
}
// 分拣完成(志圈)
function updateStatusDone (params) {
  return axios.post(url + '/updateStatusDone', params)
}
// 总检完成（志圈）
function updateStatusByVisitSn (params) {
  return axios.post(url1 + '/updateStatusByVisitSn', params)
}

// 分检汇总(志圈）
function getAllResultByVisitSn (params) {
  return axios.post(url + '/getAllResultByVisitSn', params)
}
// 取消分检
function cancelExamById (params) {
  return axios.post(url + '/cancelExamById', params)
}

// 保存总检
function saveDataToMedicalRecord (params) {
  return axios.post(url1 + '/saveDataToMedicalRecord', params)
}

export default {
  getByExecVisitSn,
  saveItemDataToMedicalRecord,
  updateStatusDone,
  updateStatusByVisitSn,
  getAllResultByVisitSn,
  saveDataToMedicalRecord,
  adviceIdAndAdviceType,
  getExamStatus,
  getByItemStatus,
  cancelExamById
}
