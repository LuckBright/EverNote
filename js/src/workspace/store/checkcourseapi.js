import {workspace as axios} from './api'
import {diction} from '@/store/common'
const url = '/sob/'

function getSpecialOrderDetail (params) {
  return axios.post(url + 'order/getSpecialOrderDetail', params)
  .then(result => {
    return result
  })
}

// 创建预约（治疗）
function createAppoint (params) {
  return axios.post(url + 'appoint/encounter', params)
  .then(result => {
    return result
  })
}

// 根据服务查询可预约医生列表
function getDoctorByServiceId (params) {
  return axios.post(url + 'providerdoctor/getDoctorByServiceId', params)
  .then(result => {
    return result
  })
}

export default {
  getSpecialOrderDetail,
  createAppoint,
  getDoctorByServiceId,
  diction
}
