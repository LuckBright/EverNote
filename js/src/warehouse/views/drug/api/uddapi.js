import { warehouse as axios } from '@/warehouse/store/api'
import { updateChange as dispenseUpdateChange, cancel as dispenseCancel } from './dispenseapi'
const url = 'udd/'

// 查询病区列表
function getAreaList (params) {
  return axios.post(url + 'getAreaList/', params)
}

// 查询给药途径列表
function getEmployList (params) {
  return axios.post(url + 'getEmployList/', params)
}

// 查询执行时间列表
function getImplementList (params) {
  return axios.post(url + 'getImplementList/', params)
}

// 查询病区列表
function getPatientTaskList (params) {
  return axios.post(url + 'getPatientTaskList/', params)
}

// 查询住院发药任务
function getTaskList (params) {
  return axios.post(url + 'getTaskList/', params)
}

// 操作任务（备药完成，发药完成，取消，无法到货）
function updateUdd (params) {
  return axios.post(url + 'updateUdd/', params)
}

// 打印/批量打印
function createUdd (params) {
  return axios.post(url + 'createUdd/', params)
}

// 重新打印(重新生成UDD)
function updateReprintUdd (params) {
  return axios.post(url + 'updateReprintUdd/', params)
}

// 缺货患者列表
function getLackPatient (params) {
  return axios.post(url + 'getLackPatient/', params)
}
// 缺货患者列表 住院统一摆药专用
function getLackPatients (params) {
  return axios.post(url + 'getLackPatients/', params)
}

// 缺货明细列表
function getLackUddRecord (params) {
  return axios.post(url + 'getLackUddRecord/', params)
}

// 缺货明细列表 统一摆药
function getLackUddRecords (params) {
  return axios.post(url + 'getLackUddRecords/', params)
}

// 住院发药记录患者维度
function getUddRecord (params) {
  return axios.post(url + 'getUddRecord/', params)
}

// 住院发药记录药包维度
function getUddRecordInfo (params) {
  return axios.post(url + 'getUddRecordInfo/', params)
}

export default {
  getAreaList,
  getEmployList,
  getImplementList,
  getPatientTaskList,
  updateReprintUdd,
  getTaskList,
  updateUdd,
  createUdd,
  getLackPatient,
  getLackPatients,
  getLackUddRecord,
  getLackUddRecords,
  getUddRecord,
  getUddRecordInfo,
  dispenseUpdateChange, // 门诊标记异常接口
  dispenseCancel, // 门诊取消异常接口
}
