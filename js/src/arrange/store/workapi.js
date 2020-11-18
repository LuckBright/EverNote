import {arrange as axios} from './api'
const url = '/arrange/'
// 查询班次
function list (params) {
  return axios.post(url + 'arrangeTimetrunk/searchEnable', params)
  .then(result => {
    return result
  })
}
// 查询班次
function search (params) {
  return axios.post(url + 'arrangeTimetrunk/search', params)
  .then(result => {
    return result
  })
}
// 创建or修改班次
function createOrupdate (params) {
  let fun = params.id ? 'arrangeTimetrunk/modify' : 'arrangeTimetrunk/create'
  return axios.post(url + fun, params)
}
// 获取执业机构
function getclinicList (params) {
  return axios.post('/warehouse/staffRecord/getClinicListByStaffIdAndSectionId/', params)
}
// 根据城市-获取全部机构
function getAllcliniclist (params) {
  return axios.post('/thc-platform-core/out/organization/getOrgListByCondition/', params)
}
// 人员排班-创建排班
function create (params) {
  return axios.post(url + 'arrangeInstance/createByStaff', params)
}
// 人员排班-删除排班
function del (params) {
  return axios.post(url + 'arrangeInstance/deleteByStaff', params)
}
// 人员排班-查询排班-dialog detail
function getDetail (params) {
  return axios.get(url + 'arrangeInstance/getByStaff', {params: params})
}
// 人员排班-发布排班
function publishByStaff (params) {
  return axios.post(url + 'arrangeInstance/publishByStaff', params)
}
// 机构排班-创建排班
function createByClinic (params) {
  return axios.post(url + 'arrangeInstance/createByClinic', params)
}
// 科室排班-获取城市列表
function getAllclinic (params) {
  return axios.post('/thc-platform-core/out/organization/getOrgCityList/', params)
}
// 平台-获取所有机构及机构下的所有科室
function getAllorgdpt (params) {
  return axios.post('/thc-platform-core/out/organization/getOrgListHasSubjectByCondition/', params)
}
// 科室排班查询
function searchBydpt (params) {
  return axios.get(url + 'arrangeInstance/searchByDept', {params: params})
}
// 科室排班 获取资源对应的服务
function getService (params) {
  return axios.get(url + 'arrangeResourceService/getServiceByResource', {params: params})
}
// 科室排班-按科室排班
function createBydpt (params) {
  return axios.post(url + 'arrangeInstance/createByDept', params)
}
// 科室排班-发布
function publishBydpt (params) {
  return axios.post(url + 'arrangeInstance/publishByDept', params)
}
// 列表模式-发布
function publishList (params) {
  return axios.post('/arrange/arrangeInstance/publishByIds', params)
}
// 科室排班-删除
function delByInstanceId (params) {
  return axios.post(url + 'arrangeInstance/deleteByInstanceId', params)
}
// 科室排班-实例查询
function getByInstanceId (params) {
  return axios.get(url + 'arrangeInstance/getByInstanceId', {params: params})
}
// 科室获取分类详情
function getByCode (params) {
  return axios.get('/arrange/arrangeCategory/getByCode', {params: params})
}
// 排班列表模式
function listSearch (params) {
  return axios.get('/arrange/arrangeInstance/search', {params: params})
}
// 排班切换获取资源数据
function getSource (params) {
  return axios.post('/thc-platform-core/out/subject/getTenantSubjectListHasRoomByCondition', params)
}
// 周视图批量排班
function createBatch (params) {
  return axios.post('/arrange/arrangeInstance/createBatchByDept', params)
}
// 列表模式批量删除
function deleteByInstanceIds (params) {
  return axios.post('/arrange/arrangeInstance/deleteByInstanceIds', params)
}
// 周排班查询
function searchWeekByDept (params) {
  return axios.get('/arrange/arrangeInstance/searchWeekByDept', {params: params})
}
export default {
  search,
  list,
  createOrupdate,
  getclinicList,
  getAllcliniclist,
  getAllorgdpt,
  create,
  del,
  getDetail,
  publishByStaff,
  getAllclinic,
  createByClinic,
  searchBydpt,
  getService,
  createBydpt,
  publishBydpt,
  publishList,
  delByInstanceId,
  getByInstanceId,
  getByCode,
  listSearch,
  getSource,
  createBatch,
  deleteByInstanceIds,
  searchWeekByDept
}
