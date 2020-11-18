import {workspace as axios} from './api'
import {diction} from '@/store/common'
const url = '/platform-extend/'
// 获取打印单列表
function getList (params) {
  return axios.post(url + 'base/print/printCenter/findPrintCentersByPatientId', params)
}
// 后台保存打印次数
function saveCount (params) {
  return axios.post(url + 'base/print/printCenter/savePrintTOPrintCenter', params)
}
// 打印数据查询接口-patient有值且type无值 patientId 会员
function batchQuery (params) {
  return axios.post('/platform-extend/printcenter/print-data/batchQuery', params)
}
// 打印数据接口查询patientId&& visitNumber cope 会员：CUSTOMER_LABEL_MEMBER
function listPage (params) {
  return axios.post('/platform-extend/printcenter/print-data/listPage', params)
}
export default {
  getList,
  diction,
  saveCount,
  batchQuery,
  listPage
}
