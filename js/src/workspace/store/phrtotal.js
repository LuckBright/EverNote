import {workspace as axios} from './api'
const url = '/thc-phr/doctor'

// 获取患者全部就诊记录(zy)
function getVisitRecordAll (params) {
  return axios.post(url + '/visit/getAll', params)
  .then(result => {
    return result.data
  })
}

// 费用明细（lipan）
function getCost (params) {
  return axios.post(url + '/cost/queryPayInfoList', params)
    .then(result => {
      return result.data
    })
}

// 模糊搜索患者（zy）
function getPatient (params) {
  return axios.post(url + '/patientInfo/search', params)
    .then(result => {
      return result.data
    })
}

export default {
  getVisitRecordAll,
  getCost,
  getPatient
}
