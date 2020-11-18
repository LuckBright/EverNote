import axios from './api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/sysqyb/'

// 定点医疗机构科室信息上传（3500）
export const uploadDeptInfo = (params) => {
  return axios.post(url + medicalUrl + 'uploadDeptInfo', params)
}

// 医师或操作员信息上报（3220）
export const uploadDoctorInfo = (params) => {
  return axios.post(url + medicalUrl + 'uploadDoctorInfo', params)
}

// 医疗费信息汇总(1110)
export const medicalExpensesSummary = (params) => {
  return axios.post(url + medicalUrl + 'medicalExpensesSummary', params)
}

// 医疗费信息查询(1100)
export const medicalExpensesQuery = (params) => {
  return axios.post(url + medicalUrl + 'medicalExpensesQuery', params)
}

// 医疗待遇封锁信息查询(1500)
export const blockadeInformationQuery = (params) => {
  return axios.post(url + medicalUrl + 'blockadeInformationQuery', params)
}

// 在院状态查询(1710)
export const inHospitalStatusQuery = (params) => {
  return axios.post(url + medicalUrl + 'inHospitalStatusQuery', params)
}

// 医师操作员信息查询(1730)
export const doctorInfoQuery = (params) => {
  return axios.post(url + medicalUrl + 'doctorInfoQuery', params)
}

// 获取定点医疗服务机构信息查询（1900）
export const orgInfoQuery = (params) => {
  return axios.post(url + medicalUrl + 'orgInfoQuery', params)
}
// 科室列表
export const selectList = (params) => {
  return axios.post(url + '/insurance/sanya/deptUpload/selectList', params)
}
// 人员信息列表
export const pageList = (params) => {
  return axios.post(url + '/thc-platform-core/out/staff/getStaffListHasSubjectAndFileByCondition', params)
}
// 三亚世侨医保结算信息查询
export const getSettleInfos = (params) => {
  return axios.post(url + '/rcm/ip/sysqMedical/getSettleInfos', params)
}
// 三亚世侨医保结算确认
export const settleConfirm = (params) => {
  return axios.post(url + '/rcm/ip/sysqMedical/settleConfirm', params)
}
