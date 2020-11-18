import {inpatient as axios} from './sobapi'
const url = '/sob/'
const url1 = '/process/'

// 办理出科方法
function outProvider (params) {
  return axios.post(url + 'hospitalizedOutProvider/create', params)
}

// 获取出科人员信息方法
function getOutProvider (params) {
  return axios.post(url + 'hospitalizedOutProvider/outProvider', params)
}

// 办理出科方法
function doTask (params) {
  return axios.post(url1 + 'task/finish', params)
}

// 创建出院记录
function createOutPospital (params) {
  return axios.post(url + 'hospitalizedOutProvider/create', params)
}

// 出科待执行医嘱回显
function getExcuteByPatientId (params) {
  return axios.post(url + 'medicalOrder/getExcuteByPatientId', params)
}

// 出科批量执行医嘱
function executeTask (params) {
  return axios.post(url + 'executeprescription/createBatch', params)
}

export default {
  outProvider,
  getOutProvider,
  createOutPospital,
  doTask,
  getExcuteByPatientId,
  executeTask
}
