import http from '@/util/http'
import { diction } from '@/store/common'
// const url = diction.api + '/sob/feeStrategy/'

var axios = http.create({
  baseURL: diction.api,
  withCredentials: true
})

axios.interceptors.response.use(function (response) {
  return response.data
})

// 查询列表
function list (data) {
  return axios.post('/sob/executeResult/queryExecuteReportList', data)
}

function updata (params) {
  return axios.post('/sob/executeResult/commentReport', params)
}

function getDoctorList (params) {
  return axios.post(diction.api + '/warehouse/staffRecord/getStaffRecordVoListForService/', params)
}

export default {
  list,
  updata,
  getDoctorList
}

