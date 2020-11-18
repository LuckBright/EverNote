import { arrange as axios } from './api'
const url = '/arrange/'

import http from '@/util/http'
import { diction } from '@/store/common'
const url2 = diction.api + '/arrange/'
var axios1 = http.create({
  baseURL: url,
  withCredentials: true
})

axios1.interceptors.response.use(function (response) {
  return response.data
})

// axios.cancelPost(url + 'resourceArrange/clinic/search', params)
function list (params) {
  return axios.cancelPost(url + 'resourceArrange/clinic/search', params)
  .then(result => {
    return result
  })
}
// 根据configKey获取对应的规则值
function getRuleConfigByKey (params) {
  return axios.post(url + 'ruleConfig/getRuleConfigByKey', params).then(result => {
    return result
  })
}

// 根据configKey获取对应的规则值
function updateClinicSetting (params) {
  return axios1.post(url2 + 'resourceArrange/clinic/updateClinicSetting', params).then(result => {
    return result
  })
}

// 根据诊室id查询该诊室是否安排医生
function hasDoctorFlag (params) {
  return axios.post(url + 'resourceArrange/clinic/hasDoctorFlag', params).then(result => {
    return result
  })
}

export default {
  list,
  getRuleConfigByKey,
  updateClinicSetting,
  hasDoctorFlag
}
