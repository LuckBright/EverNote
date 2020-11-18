import { sob as axios } from './api'
import { diction } from '@/store/common'
import { warehouse } from '@/warehouse/store/api'
// import storage from '@/util/storage'
const url = diction.api + '/phr/'
const url1 = diction.api + '/rcm/'

// 根据订单id获取结算单id
function getSettlementByOrderId (params) {
  return axios.post(url1 + 'ar/settlement/getSettlementByOrderId', params)
}
// 按照状态查询
function queryBystatus (params) {
  return axios.cancelPost(diction.api + '/arrange/kanban/queryListOrderByStatus', params)
}
// 按照医生查询
function queryBydoctor (params) {
  return axios.cancelPost(diction.api + '/arrange/kanban/queryListOrderByDoctor', params)
}
// 按照预约时间查询
function queryBystarttime (params) {
  return axios.cancelPost(diction.api + '/arrange/kanban/queryListOrderByStarttime', params)
}
// 到诊
function arrival (params) {
  return axios.post(diction.api + '/arrange/appointment/arrival', params)
}
// 离院
function leave (params) {
  return axios.post(diction.api + '/arrange/appointment/leave', params)
}
// 取消预约
function cancelAppoint (params) {
  return axios.post(diction.api + '/arrange/appointment/cancel', params)
}
// 快速到诊
function quickArrival (params) {
  return axios.post(diction.api + '/arrange/appt/clinic/quickArrival', params)
}
// 问卷
function questionnaire (params) {
  return axios.post(diction.api + '/follow-up/templateJob/selectQnaireJobListById', params)
}

// 获取本次看诊所开的service列表（800:检验, 801:检查, 802:治疗等）
function getAdviceByVisitSn (params) {
  return axios.post(url + 'doctor/doctorAdvice/v3.2/getByCheckout', params)
}

// 根据userid获取科室信息
function getLocalSectionVoBySearch (params) {
  if (!params || !params.relationId || typeof params.relationType !== 'number') {
    return false
  }
  return warehouse.post(
    'localSectionRecord/getLocalSectionVoBySearch/',
    params
  )
}

// 获取科室
function getDptList (params) {
  return axios.post(diction.api + '/arrange/kanban/getDeptList', params)
}
// 获取医生
function getResourceList (params) {
  return axios.post(diction.api + '/arrange/kanban/getResourceList', params)
}
// 接诊 调用队列
function clinicalReception (params) {
  return axios.post(diction.api + '/thc-queue/doctor/queue/treatment', params)
}
// 快速接诊 查询科室
function getArrival (params) {
  return axios.post(diction.api + '/arrange/dept/getListForQuickArrival', params)
}
// 快速接诊 查询医生
function getDoctors (params) {
  return axios.post(diction.api + '/arrange/resource/getListForQuickArrival', params)
}
// 快速接诊 查询服务
function getService (params) {
  return axios.post(diction.api + '/arrange/service/getServiceListForQuick', params)
}
// 修改预约备注
function updateSymptom (params) {
  return axios.post(diction.api + '/arrange/appt/clinic/updateSymptom', params)
}
export default {
  getSettlementByOrderId,
  queryBystatus,
  queryBydoctor,
  queryBystarttime,
  arrival,
  leave,
  cancelAppoint,
  quickArrival,
  getAdviceByVisitSn,
  getLocalSectionVoBySearch,
  getDptList,
  getResourceList,
  clinicalReception,
  getArrival,
  getDoctors,
  getService,
  updateSymptom,
  questionnaire
}
