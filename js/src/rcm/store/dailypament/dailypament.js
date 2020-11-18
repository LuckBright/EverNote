import axios from '@/rcm/store/api'
import { diction } from '@/store/common'
const url = diction.api + '/rcm/daily/payment'
// 获取日结缴款列表
function list (params) {
  return axios.post(url + '/query/list', params)
}
// 获取状态列表
function getStatusList (params) {
  return axios.post(url + '/query/status/list', params)
}
// 缴款
function payAction (params) {
  return axios.post(url + '/do', params)
}
export default {
  list,
  getStatusList,
  payAction
}
