import axios from '@/util/http'
import {diction} from '@/store/common'
const url = diction.api + '/medical-record/doctor/'

var medicalApi = axios.create({
  baseURL: url,
  withCredentials: true
})

medicalApi.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})

// 时限质控配置
function timeList (params) {
  return medicalApi.post('qualityControlConfig/search', params)
}
function timeAdd (params) {
  return medicalApi.post('qualityControlConfig/create', params)
}
function timeEdit (params) {
  return medicalApi.post('qualityControlConfig/update', params)
}
function timeDelete (params) {
  return medicalApi.post('qualityControlConfig/delete', params)
}
function getWriteType (params) {
  return medicalApi.post('medicalRecordCategory/getTree', params)
}

export default {
  timeList,
  timeAdd,
  timeEdit,
  timeDelete,
  getWriteType,
}
