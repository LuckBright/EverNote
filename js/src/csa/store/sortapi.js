import {arrange as axios} from './api'
const url = '/workbench/'

// 申请单列表
function getApplicationForm (params) {
  return axios.post(url + 'surgeryNoticeController/getApplicationForm', params)
}

// 查询申请单详情
function getApplicationFormById (data) {
  return axios.post('/workbench/surgeryNoticeController/getApplicationFormById', data)
}

// 获取科室接口
function getLocalSectionVoListForService (data) {
  return axios.post('/warehouse/localSectionRecord/getLocalSectionVoListForService/', data)
}

export default {
  getApplicationForm,
  getApplicationFormById,
  getLocalSectionVoListForService
}
