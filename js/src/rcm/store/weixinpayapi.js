import rcm from './api'
const url = 'ar/receiptFlow/'
const payUrl = 'pay/'

function createForThirdPay (params) {
  return rcm.post(url + 'createForThirdPay', params).then(result => {
    return result
  })
}

function gateway (params) {
  return rcm.post(payUrl + 'gateway', params, {timeout: 30000}).then(result => {
    return result
  })
}

export default {
  createForThirdPay,
  gateway
}
