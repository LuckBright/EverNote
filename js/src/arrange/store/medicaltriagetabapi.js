import {arrange as axios} from './api'
const url1 = '/thc-queue/'
const url2 = '/arrange/'

// 医技分诊列表
function list (params) {
  return axios.cancelPost(url1 + 'triageQueue/queryTriageQueueForList', params)
}
// 医技分诊通过patientId查询患者待分诊信息
function getTriagemessage (params) {
  return axios.post(url1 + 'triageQueue/queryTriageQueueByPatientId', params)
}
// 给号&&更换诊室
function divideTriage (params) {
  return axios.post(url1 + 'triageQueue/divideTriageQueueByAppointmentId', params)
}

// 更换诊室
function changeStation (params) {
  return axios.post(url1 + 'triageQueue/changeStationByAppointmentId', params)
}
// 重新分配
function changeStationTriage (params) {
  return axios.post(url1 + 'triageQueue/changeStationTriageQueueByAppointmentId', params)
}
// 根据科室获取诊室
function triageConfigList (params) {
  return axios.post(url2 + 'resourceArrange/clinic/triageConfigList', params).then(result => {
    return result
  })
}

export default {
  list,
  getTriagemessage,
  divideTriage,
  changeStation,
  changeStationTriage,
  triageConfigList
}
