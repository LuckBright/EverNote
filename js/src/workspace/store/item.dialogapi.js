import {workspace as axios} from './api'
import {diction} from '@/store/common'

const url = '/phr/'

// http://doc.everjiankang.com/pages/viewpage.action?pageId=20561403
function getByExecuteResult (data) {
  return axios.post('/phr/doctor/doctorAdvice/getByExecuteResult', data)
}

// 检验报告-根据patientId和adviceId获取时间
function getDateById (patientId, serviceId) {
  return axios.post(url + 'doctor/doctorAdvice/getByPatIdSerId', {
    patientId: patientId,
    serviceId: serviceId
  })
}
// 检验报告-通过adviceId和date获取检验报告
function getInspect (date, serviceId) {
  return axios.post(url + 'doctor/doctorAdvice/getByDateAndServiceId', {
    date: date,
    serviceId: serviceId
  })
}
// 查看报告
function getById (params) {
  return axios.post(url + 'doctor/executeResult/getById', params)
}

/**
 * 更新医生建议字段
 *
 * @param {*} params
 * @returns
 */
function updateDoctorSuggest (params) {
  return axios.post(url + 'doctor/executeResult/v3.2/updateDoctorSuggest', params)
}
/**
 * 获取医生建议字段
 *
 * @param {*} params
 * @returns
 */
function getByDoctorExecuteSuggest (params) {
  return axios.post(url + 'doctor/executeResult/getById', params)
}

// 更新危急值信息
function updata (data) {
  return axios.post('phr/doctor/criticalValueAction/v3.3/update', data)
}
// 更新是否发短信和客户端
function updateStatus (params) {
  return axios.post('phr/doctor/doctorAdvice/v3.3/updateStatus', params)
}
export default {
  diction,
  getDateById,
  getInspect,
  getByExecuteResult,
  updateDoctorSuggest,
  getByDoctorExecuteSuggest,
  getById,
  updata,
  updateStatus
}
