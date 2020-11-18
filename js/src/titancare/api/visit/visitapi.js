import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()

axios.defaults.baseURL += prefix.cms

// 查询预问诊模版
function search (params) {
  return axios.get('/preConsultation/search', { params: params })
}
// 新建模版
function create (params) {
  return axios.post('/preConsultation/createTemplate', params)
}
// 查询科室
function getdpt (params) {
  return axios.post('platformCore/v1.1/out/subject/getTenantSubjectListByCondition', params)
}
// 删除模版
function deleterow (params) {
  return axios.post('/preConsultation/deleteById', params)
}
// 发布
function publish (params) {
  return axios.post('/preConsultation/publishById', params)
}
// 查询api
function getapi (params) {
  return axios.get('/global-platform/v2.0/tenant/getTenantsWithConfigs', { params: params })
}
export default {
  search,
  create,
  getdpt,
  deleterow,
  publish,
  getapi
}
