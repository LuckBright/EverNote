// 电子病历分类管理api
import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api + '/medical-record/doctor/'
var tplmanageapi = axios.create({
  baseURL: url,
  withCredentials: true
})

tplmanageapi.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})

// 创建分组
// "name": "大模版分类-产科", // 必填
// "type": 1, // 必填 1-大模版 2-小模版
// "parentId": "3081611c-1172-44d2-9609-601a6768d644", // 非必填
// "businessType": 1 // 必填 1-机构级别 2-个人级别 3-科室级别
function createGroup (params) {
  return tplmanageapi.post(url + 'templateScopeCategory/create', params)
}

// 删除分组
// "id": "3081611c-1172-44d2-9609-601a6768d644"
function delGroup (params) {
  return tplmanageapi.post(url + 'templateScopeCategory/delete', params)
}

// 根据选择不同模版获取分类
// "type": 1, // 必填 1-大模版 2-小模版
// "businessType": 1 // 必填（1.机构 2.科室 3.个人）
function getCategoryTree (params) {
  return tplmanageapi.post(url + 'templateScopeCategory/getCategoryTree', params).then(res => {
    return res
  })
}

// 创建数据模版
function createDataTpl (params) {
  return tplmanageapi.post(url + 'templateScope/create', params)
}
// 更新数据模版
function updateDataTpl (params) {
  return tplmanageapi.post(url + 'templateScope/update', params)
}
// 删除数据模版
function deleteDataTpl (params) {
  return tplmanageapi.post(url + 'templateScope/delete', params)
}
// 获取数据模版(小病历模版)
function getDataTpl (params) {
  return tplmanageapi.post(url + '/templateScope/search4Outpatient', params)
}
// 获取电子病历包含数据模版结构(大病历模版)
function getAllByStatusAndType (params) {
  return tplmanageapi.post(url + 'medicalRecordCategory/getAllByStatusAndType', params)
}
// 添加病历获取树
function loadMedicalList (params) {
  return tplmanageapi.post(url + 'medicalRecordCategory/loadMedicalList', params)
}
// 通过分类id获取数据模版
function getTemplateScope (params) {
  return tplmanageapi.post(url + 'medicalRecordCategory/getTemplateScope', params)
}

export default {
  createGroup,
  delGroup,
  getCategoryTree,
  createDataTpl,
  updateDataTpl,
  deleteDataTpl,
  getDataTpl,
  getAllByStatusAndType,
  loadMedicalList,
  getTemplateScope
}
