import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const baseUrl = diction.api + '/rcm/ip/close'
// 获取预交金日结列表
function getDepositCloseList (params) {
  return axios.post(baseUrl + '/getDepositCloseList', params)
}
// 获取住院收费日结列表
function getIpCashierCloseList (params) {
  return axios.post(baseUrl + '/getIpCashierCloseList', params)
}

export default{
  getDepositCloseList,
  getIpCashierCloseList
}
