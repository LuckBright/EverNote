import {workspace as axios} from './api'
import {diction} from '@/store/common'

const url3 = '/insurance/'
// 获取医嘱原始交易信息
function list (params) {
  return axios.post(url3 + 'doctorAdvice/tradeinfo/listByIcno', params)
}
// 处方信息查询
function tradeList (params) {
  return axios.post(url3 + 'doctorAdvice/recipe/listByTradeno', params)
}
// 处方药品明细信息查询
function tradeItemList (params) {
  return axios.post(url3 + 'doctorAdvice/feeitem/listByTradeno', params)
}
export default {
  diction,
  list,
  tradeList,
  tradeItemList
}
