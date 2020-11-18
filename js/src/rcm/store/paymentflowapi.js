import rcm from './api'
const url = '/ip/settlement/'
const payurl = '/pay/trade/'

// 获取住院费用明细
async function selectFeeDetailInfo (params) {
  let data = await rcm.post(url + 'selectFeeDetailInfo', params)
  return data.data
}
// 获取费用明细合计
async function getSumFeeDetailInfoFee (params) {
  let data = await rcm.post(url + 'getSumFeeDetailInfoFee', params)
  return data.data
}
// 费用明细导出
async function exportFeeDetailInfo (params) {
  let data = await rcm.post(url + 'exportFeeDetailInfo', params)
  return data.data
}
// 获取支付流水
async function searchPayTradeLog (params) {
  let data = await rcm.post(payurl + 'searchPayTradeLog', params)
  return data.data
}
// 获取支付流水合计
async function getSumPayTradeLogFee (params) {
  let data = await rcm.post(payurl + 'getSumPayTradeLogFee', params)
  return data.data
}
// 支付流水导出
async function exportPayTradeLog (params) {
  let data = await rcm.post(payurl + 'exportPayTradeLog', params)
  return data.data
}

export default {
  selectFeeDetailInfo,
  getSumFeeDetailInfoFee,
  exportFeeDetailInfo,
  searchPayTradeLog,
  getSumPayTradeLogFee,
  exportPayTradeLog
}
