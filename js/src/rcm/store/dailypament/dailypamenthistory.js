import axios from '@/rcm/store/api'
import { diction } from '@/store/common'
const url = diction.api + '/rcm/daily/payment'

function list (params) {
  return axios.post(url + '/history/query/list', params)
}
function cancelPay (params) {
  return axios.post(url + '/do/cancel', params)
}

export default {
  list,
  cancelPay
}
