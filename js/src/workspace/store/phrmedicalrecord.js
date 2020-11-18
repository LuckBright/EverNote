import {workspace as axios} from './api'
const url = '/thc-phr/doctor'
// 获取就诊记录
function getDiagnosisRecord (params) {
  return axios.post(url + '/visit/getAll', params)
  .then(result => {
    return result.data
  })
}
// 获取当前就诊记录下的树形结构
function medicalRecordTree (params) {
  return axios.post(url + '/medicalRecord/query/tree', params)
  .then(result => {
    return result.data
  })
}
export default {
  medicalRecordTree,
  getDiagnosisRecord
}
