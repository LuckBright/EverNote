import {arrange as axios} from './api'
const url = '/arrange/'

import http from '@/util/http'
import { diction } from '@/store/common'
const url1 = diction.api
const url2 = diction.api + '/arrange/'
var axios1 = http.create({
  baseURL: url,
  withCredentials: true
})

axios1.interceptors.response.use(function (response) {
  return response.data
})

// 获取海南预约检查列表
function list (params) {
  return axios.post(url + 'appointmentHn/getAppointmentHnList', params)
}
// 查看记录详细
function getDetail (params) {
  return axios.post(url + 'appointmentHn/detailAppointmentHnRecord', params)
}
// 获取可预约的信息
function getAppoint (params) {
  return axios.post(url + 'appointmentHn/getAppointmentHnRecord', params)
}
// 获取某项目当天可预约时间段
function getTime (params) {
  return axios.post(url + 'appointmentHn/getAppointmentHnTime', params)
}
// 取消预约
function cancelAppoint (params) {
  return axios.post(url + 'appointmentHn/cancelAppointmentHnRecord', params)
}

// 取消预约
function getOldList (params) {
  return axios.post(url + 'appointmentHn/getAppointmentHnRecord', params)
}

// 添加预约记录
function addOrUpdateAppoint (params) {
  var path = params.appointmentRecordId ? 'appointmentHn/updateAppointmentHnRecord' : 'appointmentHn/addAppointmentHnRecord'
  return axios1.post(url2 + path, params)
}

// 获取检查项目
function queryService (params) {
  return axios.post(url1 + '/sob/service/queryService', params)
}

// 获取检查项目
function getClinicHnTime (params) {
  return axios.post(url + 'appointmentHn/getAppointmentClinicHnTime', params)
}

// 获取检查项目
function getClinicSource (params) {
  return axios.post(url + 'appointmentHn/getAppointmentClinicSource', params)
}

export default {
  list,
  getDetail,
  getAppoint,
  queryService,
  cancelAppoint,
  addOrUpdateAppoint,
  getTime,
  getOldList,
  getClinicHnTime,
  getClinicSource
}
