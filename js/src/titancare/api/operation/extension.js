import { getInstance } from '../api'
let urlDoc = '/titan-doctor/'
const axios = getInstance()

// 获取待审核账号列表
function extensionSearch (params) {
  return axios.post(`${urlDoc}promotionStatistics/search`, params)
}

// 查询推荐医生
function getdoctorListByDoctorId(params) {
  return axios.post(`${urlDoc}promotionStatistics/getdoctorListByDoctorId`, params)
}

// 查询推荐患者
function getPatientListByDoctorId(params) {
  return axios.post(`${urlDoc}promotionStatistics/getPatientListByDoctorId`, params)
}

// 导出
function extensionExport(params) {
  return axios.post(`${urlDoc}promotionStatistics/export`, params)
}

export default {
  extensionSearch,
  getdoctorListByDoctorId,
  getPatientListByDoctorId,
  extensionExport
}
