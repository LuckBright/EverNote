import axios from '@/rcm/store/api'

function payStart (params) {
  return axios.post('/shop/pay/start', params)
}
function payRefund (params) {
  return axios.post('/shop/pay/refund', params)
}
function getValueByCode (code) {
  return axios.post('/common/param/getValueByCode', {code})
}
function getRefundDetail (params) {
  return axios.post('/shop/refund/flows', params)
}
export default {
  payStart,
  payRefund,
  getValueByCode,
  getRefundDetail
}
