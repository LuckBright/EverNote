import {inpatient as axios} from './sobapi'
const url = '/sob/'

// 查询床位费
function getBedfee (params) {
  return axios.post(url + 'service/queryBedFeeService', params)
}

// 撤回床位费
function cancelFee (params) {
  return axios.post(url + 'medicalOrder/withDrawFee', params)
}

// 提交床位费
function createFee (params) {
  return axios.post(url + 'medicalOrder/createIncreaseRecipe', params)
}

// 获取待交床位费列表
function getFeelist (params) {
  return axios.post(url + 'medicalOrder/getBedFeeWithNurse', params)
}

export default {
  getBedfee,
  cancelFee,
  createFee,
  getFeelist
}
