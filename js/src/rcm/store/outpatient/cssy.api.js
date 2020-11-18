import axios from '@/rcm/store/api'

function payStart (params) {
  return axios.post('/shop/pay/start', params)
}
function payRefund (params) {
  return axios.post('/shop/pay/refund', params)
}
// 获取是否需要审批字段，通过该接口可以获取对应code的值
function getValueByCode (params) {
  return axios.post('/common/param/getValueByCode', params)
}
export default {
  getValueByCode,
  payStart,
  payRefund
}
