import { arrange as axios } from './api'
const url = '/arrange/'

// 诊室规则维护
function list (params) {
  return axios.cancelPost(url + 'resourceArrange/clinic/triageConfigList', params).then(result => {
    return result
  })
}

// 诊室规则维护
function triageConfigList (params) {
  return axios.cancelPost(url + 'resourceArrange/clinic/triageConfigList', params).then(result => {
    return result
  })
}

// 诊室规则维护
function updateTriageConfig (params) {
  return axios.post(url + 'resourceArrange/clinic/updateTriageConfig', params).then(result => {
    return result
  })
}

export default {
  list,
  triageConfigList,
  updateTriageConfig
}
