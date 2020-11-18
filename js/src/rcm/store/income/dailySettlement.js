import axios from '../api'

function settlementList (params) {
  return axios.post('cashier/getFeeClassForReg', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function paymentList (params) {
  return axios.post('cashier/getCloseFeeCollectorReg', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function NoRegSettlementList (params) {
  return axios.post('cashier/getFeeClassForNoReg', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function NoRegPaymentList (params) {
  return axios.post('cashier/getCloseFeeCollectorNoReg', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function createDailySettlement (params) {
  return axios.post('cashier/closeBill/create', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getMaxCloseTime (type) {
  return axios.post('cashier/closeBill/getMaxCloseTime', {
    feeType: type
  }).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function payDetailsOfMethod (params) {
  return axios.post('cashier/payDetailsOfMethod', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  settlementList,
  paymentList,
  NoRegSettlementList,
  NoRegPaymentList,
  createDailySettlement,
  getMaxCloseTime,
  payDetailsOfMethod
}
