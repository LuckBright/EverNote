import { crm as axios, purl } from './api'

// 获取证件号重复list
function getIdno (params) {
  return axios.get(purl + 'doctor/patient/getRepeatByIdenId', {params: params})
    .then((rs) => {
      rs.totalCount = rs.data.totalCount
      return rs
    })
}
// 获取姓名手机号重复列表
function getNameandMobile (params) {
  return axios.get(purl + 'doctor/patient/getRepeatByNameAndMobile', { params: params })
    .then((rs) => {
      rs.totalCount = rs.data.totalCount
      return rs
    })
}
// 获取姓名性别出生日期重复列表
function getBirthday (params) {
  return axios.get(purl + 'doctor/patient/getRepeatByNameAndSexAndBirthday', { params: params })
    .then((rs) => {
      rs.totalCount = rs.data.totalCount
      return rs
    })
}
// 查看重复数据
function getReapet (params) {
  return axios.get(purl + 'doctor/patient/getRepeatPatient', {params: params})
    .then((rs) => {
      rs.totalCount = rs.data.totalCount
      return rs
    })
}
// 关联最优记录
function relate (params) {
  return axios.post(purl + 'doctor/patient/relate', params)
}
// 客户编号关联
function forceRelate (params) {
  return axios.post(purl + 'doctor/patient/forceRelate', params)
}
// 解除关联
function unRelate (params) {
  return axios.post(purl + 'doctor/patient/unRelate', params)
}
export default {
  getIdno,
  getNameandMobile,
  getBirthday,
  getReapet,
  relate,
  forceRelate,
  unRelate
}
