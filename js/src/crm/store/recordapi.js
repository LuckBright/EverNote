import {inpatient as axios} from '../../inpatient/store/api'
import {arrange} from '@/sob/store/arrangeapi'
const url = '/phr/'
const urlProxy = '/phr-proxy/'
const aurl = '/appoint/'
const urlCrm = '/c-union/doctor/'

// 健康记录
function getByManage (params) {
  return axios.post(urlProxy + 'doctor/medicalRecord/getByManage', params)
}
// 检验检查记录
function getInspectPage (params) {
  return axios.post(url + 'doctor/doctorAdvice/getInspectPage', params)
}
// 客户上传报告
function create (params) {
  return axios.post(urlCrm + 'report/create', params)
}
// 预约查询
function query (params) {
  return arrange.post(aurl + 'doctor/query', params)
}
// 查询客户报告
function getByCreateTime (params) {
  return axios.post(urlCrm + 'report/getByCreateTime', params)
}
// 删除报告
function deletes (params) {
  return axios.post(urlCrm + 'report/delete', params)
}
// 客户行为记录查询
function list (params) {
  return axios.get(urlCrm + 'behaviorRecord/search', {params: params})
}
// 客户行为获取所有类型非内置行为
function custBehavType (params) {
  return axios.get(urlCrm + 'behaviorCategory/getBySystemFlag', {params: params})
    .then((response) => {
      return response
    })
}
// 管理客户行为类型保存
function saveManagType (params) {
  return axios.post(urlCrm + 'behaviorCategory/create', params)
}
// 管理客户行为类型保存
function deleteCustType (params) {
  return axios.post(urlCrm + 'behaviorCategory/delete', params)
}
// 添加客户行为记录保存
function addBehavRecord (params) {
  return axios.post(urlCrm + 'behaviorRecord/create', params)
}
// 客户行为记录审核通过
function recordAuditingPass (params) {
  return axios.post(urlCrm + 'behaviorRecord/approve', params)
}
// 客户行为记录不审核通过
function recordAuditingNoPass (params) {
  return axios.post(urlCrm + 'behaviorRecord/fail', params)
}

// 是否发短信
function changeSendMessageFlag (params) {
  return axios.post(url + 'doctor/doctorAdvice/v3.2/updateIsSms', params)
}

// 客户端是否可见状态修改
function changeAppShowFlag (params) {
  return axios.post(url + 'doctor/doctorAdvice/v3.2/updateIsClient', params)
}

export default {
  getByManage,
  getInspectPage,
  create,
  query,
  getByCreateTime,
  deletes,
  list,
  custBehavType,
  saveManagType,
  deleteCustType,
  addBehavRecord,
  recordAuditingPass,
  recordAuditingNoPass,
  changeSendMessageFlag,
  changeAppShowFlag
}
