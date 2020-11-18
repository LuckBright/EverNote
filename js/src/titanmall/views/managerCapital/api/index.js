import api from '@/titanmall/utils/api'

let url = api.url
let axios = api.base

// 核销记录
function validationRecord (params) {
  return axios.post(url + 'manage/service/validationRecord', params)
}

// 搜索服务码
function serviceSearch (params) {
  return axios.get(url + 'manage/service/search?validationCode=' + params)
}

// 使用核销
function serviceValidation (params) {
  return axios.get(url + 'manage/service/validation?' + params)
}

// 获取对账单列表
function capitalStatementList (params) {
  return axios.post(url + 'manage/capitalStatement/list', params)
}

// 导出对账单列表
function capitalStatementExport (params) {
  return axios.post(url + 'manage/capitalStatement/export', params, params.config)
}

export default {
  validationRecord,
  serviceSearch,
  serviceValidation,
  capitalStatementList,
  capitalStatementExport,
}
