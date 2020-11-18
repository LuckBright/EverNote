import axios from '@/rcm/store/api'
import { diction } from '@/store/common'
const baseUrl = diction.api + '/rcm/ip/close'
// 住院总日结
function close (params) {
  return axios.post(baseUrl + '/close', params)
}
// 获取页面数据
function getIpCloseInfo (params) {
  return axios.post(baseUrl + '/getIpCloseInfo', params)
}
// 获取左侧日结列表
function getIpCloseList (params) {
  return axios.post(baseUrl + '/getIpCloseList', params)
}
// 根据支付方式拿支付方式明细
function getflowfeelist (params) {
  return axios.post(baseUrl + '/getIpAllTradeLogByPayMethod', params)
}
// 根据某次日结获取支付方式明细
function getflowfeelistById (params) {
  return axios.post(baseUrl + '/getIpAllTradeLogByPayMethodById', params)
}
// 查看日结明细
function getLastCloseDetails (params) {
  return axios.post(baseUrl + '/getLastCloseDetails', params)
}
// 住院收费日结预交金详情，调用单独的接口查询
function getDepositLogList (params) {
  return axios.post(baseUrl + '/getDepositLogList', params)
}
// 2019-11-05预交金日结详情，换了弹窗样式，换了新接口
function getAdvancePaymentList (params) {
  return axios.post(`${baseUrl}/getSettlementList`, params)
}
export default {
  close,
  getIpCloseInfo,
  getIpCloseList,
  getflowfeelist,
  getflowfeelistById,
  getLastCloseDetails,
  getDepositLogList,
  getAdvancePaymentList
}
