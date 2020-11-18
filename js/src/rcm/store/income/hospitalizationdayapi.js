import axios from '../api'
const ipCloseUrl = 'ip/close/'
// 查询住院收费日结信息
function getIpCashierCloseInfo (params) {
  return axios.post(`${ipCloseUrl}getIpCashierCloseInfo`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 根据支付方式查看住院收费明细
function getIpTradeLogByPayMethod (params) {
  return axios.post(`${ipCloseUrl}getIpTradeLogByPayMethod`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 日结按钮
function close (params) {
  return axios.post(`${ipCloseUrl}close`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查询预交金日结信息
function getDepositCloseInfo (params) {
  return axios.post(`${ipCloseUrl}getDepositCloseInfo`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 根据支付方式查看预交金缴纳详情
function getDepositLogByPayMethod (params) {
  return axios.post(`${ipCloseUrl}getDepositLogByPayMethod`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 查看上次日结明细
function getLastCloseDetails (params) {
  return axios.post(`${ipCloseUrl}getLastCloseDetails`, params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
// 根据日结列表的id获取预交金日结的详情
function getDepositCloseInfoById (params) {
  return axios.post(`${ipCloseUrl}getDepositCloseInfoById`, params)
}
// 根据日结列表的id获取住院收费日结详情
function getIpCashierCloseInfoById (params) {
  return axios.post(`${ipCloseUrl}getIpCashierCloseInfoById`, params)
}
// 住院日结根据支付方式和日结id获取记录
function getIpTradeLogByPayMethodById (params) {
  return axios.post(`${ipCloseUrl}getIpTradeLogByPayMethodById`, params)
}
// 预交金日结根据支付方式和日结id获取记录
function getDepositLogByPayMethodById (params) {
  return axios.post(`${ipCloseUrl}getDepositLogByPayMethodById`, params)
}
// 住院收费日结预交金详情，调用单独的接口查询
function getDepositLogList (params) {
  return axios.post(`${ipCloseUrl}getDepositLogList`, params)
}
// 2019-11-05预交金日结详情，换了弹窗样式，换了新接口
function getAdvancePaymentList (params) {
  return axios.post(`${ipCloseUrl}getSettlementList`, params)
}
export default {
  getIpCashierCloseInfo,
  getDepositCloseInfo,
  getDepositLogByPayMethod,
  close,
  getIpTradeLogByPayMethod,
  getLastCloseDetails,
  getDepositCloseInfoById,
  getIpCashierCloseInfoById,
  getIpTradeLogByPayMethodById,
  getDepositLogByPayMethodById,
  getDepositLogList,
  getAdvancePaymentList
}
