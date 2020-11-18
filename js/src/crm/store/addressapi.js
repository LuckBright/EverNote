import {crm as axios, durl} from './api'
// 创建地址
function create (params) {
  return axios.post(durl + '/c-union/doctor/patientMailingAddress/create', params)
}
// 删除地址
function deleterow (parmas) {
  return axios.post(durl + '/c-union/doctor/patientMailingAddress/delete', parmas)
}
// 编辑地址
function modify (params) {
  return axios.post(durl + '/c-union/doctor/patientMailingAddress/modify', params)
}
// 更新默认地址
function setDefault (params) {
  return axios.post(durl + '/c-union/doctor/patientMailingAddress/setDefault', params)
}
// 获取地址详情
function getById (params) {
  return axios.get(durl + '/c-union/doctor/patientMailingAddress/getById', { params: params })
    .then((response) => {
      return response
    })
}
// 获取地址列表
function getByPatientId (params) {
  return axios.get(durl + '/c-union/doctor/patientMailingAddress/getByPatientId', { params: params })
    .then((response) => {
      return response
    })
}
// 获取邮寄患者list
function getMailPatientList (params) {
  return axios.post(durl + '/sob/mailAddress/getMailPatientList', params)
}
// 更新邮寄地址
function updateMailAddress (params) {
  return axios.post(durl + '/sob/mailAddress/updateMailAddress', params)
}
// 校验页面弹窗
function checkIsNoneAddress (params) {
  return axios.post(durl + '/sob/mailAddress/checkIsNoneAddress', params)
}
// 获取处方明细
function getMailOrderList (params) {
  return axios.post(durl + '/sob/mailAddress/getMailOrderList', params)
}
export default {
  create,
  deleterow,
  modify,
  setDefault,
  getById,
  getByPatientId,
  getMailPatientList,
  updateMailAddress,
  checkIsNoneAddress,
  getMailOrderList
}
