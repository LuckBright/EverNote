import {crm as axios, durl} from './api'

// 根据patientid查询积分
function getPoints (params) {
  return axios.get(durl + '/market/doctor/benefitPoint/findByPatientId', { params: params })
    .then((response) => {
      return response
    })
}
// 赠送积分
function addPoints (params) {
  return axios.post(durl + '/market/doctor/pointsFlow/addPoints', params)
}
// 消费积分
function exchangePoints (params) {
  return axios.post(durl + '/market/doctor/pointsFlow/exchangePoints', params)
}
// 储值余额查询
function getCard (params) {
  return axios.get(durl + '/market/doctor/memberCard/getGhCardByPatientId', { params: params })
    .then((response) => {
      return response
    })
}
// 充值保存
function createPay (params) {
  return axios.post(durl + '/c-union/doctor/tradeFlow/createPay', params)
}
// 提现保存
function createCash (params) {
  return axios.post(durl + '/c-union/doctor/tradeFlow/createCash', params)
}
function getTypeListAll (params) {
  return axios.get(durl + '/market/doctor/benefitPointsExchange/search?typeCode=' + params.typeCode)
}
// 患者身份 all
function getAvailable () {
  return axios.get(durl + '/market/doctor/benefit/getAvailable')
}
// 保存会员身份
function changeVisitNo (parmas) {
  return axios.post(durl + '/c-union/doctor/patient/changeVisitNo', parmas)
}
// 就诊卡分类
function getCardType (params) {
  return axios.get(durl + '/c-union/doctor/category/getAllVisitCardType', {
    params: params
  })
}
// 查询当前会员身份
function getBenefit (params) {
  return axios.get(durl + '/market/doctor/patientBenefit/getByPatientId', {
    params: params
  })
}
export default {
  getPoints,
  addPoints,
  exchangePoints,
  getCard,
  createPay,
  createCash,
  getTypeListAll,
  getAvailable,
  changeVisitNo,
  getCardType,
  getBenefit
}
