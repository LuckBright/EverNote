import axios from '../api'

function getFlowFee (params) {
  return axios.post('cashier/closeBill/getFlowFee', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getFlowFeeDetail (params) {
  return axios.post('cashier/closeBill/getById', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

export default {
  getFlowFee,
  getFlowFeeDetail
}
