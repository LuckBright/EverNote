import rcm from './api'
const url = 'pay/'
const refundUrl = 'ar/receiptFlow/'
function payment (type) {
  return rcm.post(url + 'payment', { type })
}

function tradeCreate (params) {
  return rcm.post(url + 'trade/create', params)
}
// 作废单条支付流水
function del (id) {
  return rcm.post(url + 'trade/cancel', { id })
}
// 作废多条支付流水
function delAll (ids) {
  return rcm.post(url + 'trade/batchCancel', ids)
}
// 支付方式可选退费删除
function deleteRefundFlow (id) {
  return rcm.post(refundUrl + 'deleteRefundFlow', { id })
}
// 支付方式可选退费更新

function update (params) {
  return rcm.post(refundUrl + 'updateRefundReceiptFlow', params)
}
// 支付方式可选退费列表
function getRefundFlowsBySettlementId (settlementId) {
  return rcm.post(refundUrl + 'getRefundFlowsBySettlementId', { settlementId })
}
// 支付方式可选退费创建
function createRefundFlow (params) {
  return rcm.post(refundUrl + 'createRefundFlow', params)
}
// 查询支付是否成功
function query (params) {
  return rcm.post(url + 'trade/query', params)
}
// pos机
function serial (params) {
  return rcm.post('http://127.0.0.1:9099/serial', params)
}
// 根据结算单获取支付二维码地址
function getQRCodeAddress (params) {
  return rcm.post(url + 'qrcode', params)
}
// 撤销线上支付流水
function retreatFlow (params) {
  return rcm.post(url + 'trade/reverse', params)
}

//
function posCreate (params) {
  return rcm.post('pos/prePay', params)
}

//
function posCreateCharge (params) {
  return rcm.post('pos/postPay', params)
}

// 查询刷卡状态是否成功
function getTradeLog (params) {
  return rcm.post(url + '/trade/getTradeLog', params)
}

// 刷卡
function serialPay (params) {
  return rcm.post('http://127.0.0.1:2345/serial/pay', params)
}
export default {
  payment,
  tradeCreate,
  deleteRefundFlow,
  update,
  getRefundFlowsBySettlementId,
  createRefundFlow,
  query,
  serial,
  del,
  delAll,
  getQRCodeAddress,
  retreatFlow,
  posCreate,
  posCreateCharge,
  getTradeLog,
  serialPay
}
