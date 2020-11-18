import {warehouse as axios} from '@/warehouse/store/api'
const url = '/dispense/'
// 批量打印
function createUddPrint (params) {
  return axios.post(url + 'createUddDispensePrinting/', params)
}
// 摆药单相关接口
// 摆药单左侧列表
function getDispenseCodesList (params) {
  return axios.post(url + 'getDispenseListForCodes/', params)
}
// 右侧列表
function getDispenseList (params) {
  return axios.post(url + 'getDispenseList/', params)
}
// 摆药单-批量操作状态
function updateStatus (params) {
  return axios.post(url + 'updateDispenseStatusForCodes/', params)
}

export default {
  createUddPrint,
  getDispenseCodesList,
  getDispenseList,
  updateStatus
}
