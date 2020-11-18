import axios from '@/insurance/store/api'
import { diction } from '@/store/common'
const url = diction.api
const mallUrl = '/rcm/mall/close'
const cashUrl = '/rcm/cashier'
const closeUrl = '/closeBill'

function getMallSettlementList (params) { // 获取营销日结记录列表
  return axios.post(`${url}${mallUrl}/getList`, params)
}
function getMallData (params) { // 获取营销日结详细信息
  return axios.post(`${url}${mallUrl}/getClose`, params)
}
function getPaymentInfo (params) { // 获取营销支付流水
  return axios.post(`${url}${mallUrl}/getPaymentInfo`, params)
}
function getCostClassInfo (params) { // 获取营销日结明细
  return axios.post(`${url}${mallUrl}/getCostClassInfo`, params)
}
function mallClose (params) { // 营销日结
  return axios.post(`${url}${mallUrl}`, params)
}
function getPayment (params) { // 往来单位
  return axios.post(`/rcm/pay/payment`, params)
}
function getDailysettlementList (params) { // 获取挂号日结和门诊日结历史记录
  return axios.post(`${cashUrl}${closeUrl}/getList1`, params)
}
function getMaxCloseTime (params) { // 获取挂号门诊上次日结时间
  return axios.post(`${cashUrl}${closeUrl}/getMaxCloseTime`, params)
}
function NoRegSettlementList (params) { // 获取门诊日结未日结数据明细
  return axios.post(`${cashUrl}/getFeeClassForNoReg`, params)
}
function settlementList (params) { // 获取挂号日结未日结数据明细
  return axios.post(`${cashUrl}/getFeeClassForReg`, params)
}
function NoRegPaymentList (params) { // 获取门诊日结支付方式明细
  return axios.post(`${cashUrl}/getCloseFeeCollectorNoReg`, params)
}
function paymentList (params) { // 获取挂号日结支付方式明细
  return axios.post(`${cashUrl}/getCloseFeeCollectorReg`, params)
}
function payDetailsOfMethod (params) {
  return axios.post(`${cashUrl}/payDetailsOfMethod`, params)
}
function getFlowFeeDetail (params) {
  return axios.post(`${cashUrl}${closeUrl}/getById`, params)
}
function getFlowFee (params) { // 门诊挂号日结单明细
  return axios.post(`${cashUrl}${closeUrl}/getFlowFee`, params)
}
function createDailySettlement (params) {
  return axios.post(`${cashUrl}${closeUrl}/create`, params)
}
// 门诊日结是否取消按钮显示接口
function canYouCancel (closeId) {
  return axios.post(`${cashUrl}${closeUrl}/canYouCancel/`, { closeId })
}
// 门诊取消日结
function cancelClose (closeId) {
  return axios.post(`${cashUrl}${closeUrl}/cancelClose/`, { closeId })
}
// 门诊营销取消按钮显示接口
function canYouCancelMarketing (closeId) {
  return axios.post(`${url}${mallUrl}/canYouCancel/`, { closeId })
}
// 门诊营销取消日结
function cancelCloseMarketing (closeId) {
  return axios.post(`${url}${mallUrl}/cancelClose/`, { closeId })
}
// 门诊、挂号日结查询票据
function getBillList (params) {
  return axios.post(`${cashUrl}/billNoteQueryList`, params)
}
// 医保结算明细
export const getMedicalList = (data) => {
  return axios.post(`/rcm/medical/getMedicalDetails`, data)
}
export default {
  canYouCancel,
  canYouCancelMarketing,
  cancelCloseMarketing,
  cancelClose,
  getDailysettlementList,
  getMallSettlementList,
  createDailySettlement,
  NoRegSettlementList,
  payDetailsOfMethod,
  getCostClassInfo,
  getFlowFeeDetail,
  NoRegPaymentList,
  getMaxCloseTime,
  settlementList,
  getPaymentInfo,
  paymentList,
  getMallData,
  getPayment,
  getFlowFee,
  mallClose,
  getBillList,
  cancelToken: axios.axiosCancel
}
