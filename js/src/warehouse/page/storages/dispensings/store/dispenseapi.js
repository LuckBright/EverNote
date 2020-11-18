import { warehouse as axios } from '@/warehouse/store/api'
const url = '/dispense/'
const uddUrl = '/uddDispense/'
// 批量打印
function createUddPrint (params) {
  return axios.post(url + 'createUddDispensePrinting/', params)
}
// 摆药单相关接口
// 摆药单左侧列表
function getDispenseCodesList (params) {
  return axios.post(url + 'getDispenseListByPage/', params)
}

// 摆药单左侧列表（所属病区+患者姓名）
function getList (params) {
  return axios.post(url + 'getDispenseListByPageForMX/', params)
}
// 右侧列表
function getDispenseList (params) {
  return axios.post(url + 'getDispenseList/', params)
}
// 摆药单-批量操作状态
function updateStatus (params) {
  return axios.post(url + 'updateDispenseStatusForCodes/', params)
}

// 摆药单-重打摆药单
function reprintDispense (params) {
  return axios.post(url + 'reprintDispense/', params)
}
// 摆药单-重打摆药单
function getDispenseForUdd (params) {
  return axios.post(url + 'getDispenseForUdd/', params)
}
// 住院发药-单人操作打药包
function printDispenseAndUddDispense (params) {
  return axios.post(uddUrl + 'printDispenseAndUddDispense/', params)
}
// 住院发药-患者查询
function getUddDispenseByPatient (params) {
  return axios.post(uddUrl + 'getUddDispenseByPatient/', params)
}
// 住院发药-患者查询 患者药包
function getUddDispenseByPatientList (params) {
  return axios.post(uddUrl + 'getUddDispenseByPatientList/', params)
}
// 住院发药-药包查询
function getAllUddDispenseList (params) {
  return axios.post(uddUrl + 'getAllUddDispenseList/', params)
}
// 住院发药-药包查询 - 右侧药包详情
function getUddDispenseInfo (params) {
  return axios.post(uddUrl + 'getUddDispenseInfo/', params)
}

export default {
  createUddPrint,
  getDispenseCodesList,
  getDispenseList,
  updateStatus,
  reprintDispense,
  getList,
  getDispenseForUdd,
  printDispenseAndUddDispense,
  getUddDispenseByPatient,
  getAllUddDispenseList,
  getUddDispenseByPatientList,
  getUddDispenseInfo
}
