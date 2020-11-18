import axios from '@/insurance/store/api'
const url = '/pricemanage/pricing/'

function historyList (params) { // 调价历史列表
  return axios.post(url + 'set/adjust/history/master', params)
}
export default {
  historyList
}
