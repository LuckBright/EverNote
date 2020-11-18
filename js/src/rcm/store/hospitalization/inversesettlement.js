import axios from '@/rcm/store/api'
import { diction } from '@/store/common'
const baseurl = diction.api
// 提交登记信息获取住院号
function getInverseInfo (params) {
  return axios.post(baseurl + '/rcm/ip/accountbill/getInverseInfo', params)
}
// 反算接口
function InverseIpSettlement (params) {
  return axios.post(baseurl + '/rcm/ip/settlement/inverse', params)
}
export default {
  getInverseInfo,
  InverseIpSettlement
}
