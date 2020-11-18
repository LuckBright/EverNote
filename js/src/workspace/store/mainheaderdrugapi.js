import {workspace as axios} from './api'
import {diction} from '@/store/common'

const url3 = '/insurance/'
// 获取医嘱药品明细列表
function list (params) {
  return axios.post(url3 + 'doctorAdvice/feeitem/listByParameter', params)
}
export default {
  diction,
  list
}
