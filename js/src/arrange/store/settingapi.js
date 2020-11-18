import { arrange as axios } from './api'
import { diction } from '@/store/common'
const url = '/arrange/'
const urlw = '/warehouse/'

function getArrangeUseList (params) {
  return axios.post(url + 'resourceArrangeZz/getArrangeUseList', params).then(result => {
    return result
  })
}

function getDeptResource (params) {
  return axios.post(url + 'arrangeBaseset/queryBasesetResource', params).then(result => {
    return result
  })
}
// 平台 查询城市
function getSourceByClinicCityList (params) {
  return axios.post('/thc-platform-core/out/organization/getOrgListByCondition/', params).then(result => {
    return result
  })
}

function getClinicList (params) {
  return axios.post(urlw + 'clinic/getClinicList/', params).then(result => {
    return result
  })
}

function getResourceList (params) {
  return axios.post(url + 'resource/search', params).then(result => {
    return result
  })
}

function getNowDataResourceList (params) {
  return axios.post(url + 'resourceArrange/getArrangeResource', params).then(result => {
    return result
  })
}

function getArrangeResourceOnly (params) {
  return axios.post(url + 'resourceArrange/getArrangeResourceOnly', params).then(result => {
    return result
  })
}

function addWeekResource (params) {
  return axios.post(url + 'arrangeBaseset/addWeekResource', params).then(result => {
    return result
  })
}

function getDeptWeekArrange (params) {
  return axios.post(url + 'arrangeBaseset/queryDeptWeekArrange', params).then(result => {
    return result
  })
}

function addDeptWeekArrange (params) {
  return axios.post(url + 'arrangeBaseset/addWeekResourceArrange', params).then(result => {
    return result
  })
}

function delDeptWeekArrange (params) {
  return axios.post(url + 'arrangeBaseset/deleteWeekResourceArrange', params).then(result => {
    return result
  })
}

function delWeekResource (params) {
  return axios.post(url + 'arrangeBaseset/deleteWeekResourceById', params).then(result => {
    return result
  })
}

function setValidWeekResource (params) {
  return axios.post(url + 'arrangeBaseset/isValidWeekResource', params).then(result => {
    return result
  })
}
// 排班-号别规则
function createOrmodify (params) {
  let action = params.id ? 'modify' : 'create'
  return axios.post(url + 'arrangeResourceService/' + action, params).then(result => {
    return result
  })
}
// 排班-号别规则
function getById (params) {
  return axios.post(url + 'arrangeResourceService/getById', params).then(result => {
    return result
  })
}

function getBasesetResourceDetail (params) {
  return axios.post(url + 'arrangeBaseset/getArrangeBasesetResourceDetail', params).then(result => {
    return result
  })
}

function updateBasesetTimerange (params) {
  return axios.post(url + 'arrangeBaseset/updateArrangeBasesetTimerange', params).then(result => {
    return result
  })
}

function delArrangeBasesetResource (params) {
  return axios.post(url + 'arrangeBaseset/deleteBasesetResourceById', params).then(result => {
    return result
  })
}

function setTimesliceChannelRel (params) {
  return axios.post(url + 'arrangeBaseset/setTimesliceChannelRel', params).then(result => {
    return result
  })
}

function returnArrangeBasesetResource (id) {
  return axios.post(url + 'resourceArrange/returnDeletedPublishResourceArrange', { id: id }).then(result => {
    return result
  })
}

function addMonthArrange (params) {
  return axios.post(url + 'resourceArrange/addResourceArrange', params).then(result => {
    return result
  })
}

function approveArrange (params) {
  return axios.post(url + 'resourceArrange/approve', params).then(result => {
    return result
  })
}

function submitArrangeToApprove (params) {
  return axios.post(url + 'resourceArrange/checklog/add', params).then(result => {
    return result
  })
}

function getAppointRelsList (params) {
  return axios.post(url + 'resourceArrange/getAppointRelsByResourceArrangeIds', params).then(result => {
    return result
  })
}

function getCheckLogArrangeList (params) {
  return axios.post(url + 'resourceArrange/getCheckLogHiResourceArrangeList', params).then(result => {
    return result
  })
}

function getDownLoadUrl (id) {
  return diction.api + url + 'resourceArrange/exportArrangeCheckLogAppointmentRelList?checkLogId=' + id
}

function getResourceArrangeZzByStaffListDate (params) { // 9984
  return axios.post(url + 'resourceArrangeZz/getResourceArrangeZzByStaffListDate', params).then(result => {
    return result
  })
}

function getResourceArrangeZzByClinicListDate (params) { // 9987
  return axios.post(url + 'resourceArrangeZz/getResourceArrangeZzByClinicListDate', params).then(result => {
    return result
  })
}

function getClinicTrunkListByStaffDept (params) { // 9984
  return axios.post(url + 'resourceArrangeZz/getClinicTrunkListByStaffDept', params).then(result => {
    return result
  })
}

function getStaffTrunkListByClinicDept (params) { // 9987
  return axios.post(url + 'resourceArrangeZz/getStaffTrunkListByClinicDept', params).then(result => {
    return result
  })
}

function insertArrangeRequestByStaff (params) { // 9984新增
  return axios.post(url + 'resourceArrangeZz/insertArrangeRequestByStaff', params).then(result => {
    return result
  })
}

function insertArrangeRequestByClinic (params) { // 9987新增
  return axios.post(url + 'resourceArrangeZz/insertArrangeRequestByClinic', params).then(result => {
    return result
  })
}

function publishResourceArrangeZzByClinicListDate (params) { // 机构审核
  return axios.post(url + 'resourceArrangeZz/publishResourceArrangeZzByClinicListDate', params).then(result => {
    return result
  })
}

function addTempArrange (params) {
  return axios.post(url + 'resourceArrange/addTempArrange', params).then(result => {
    return result
  })
}

function updateTempArrange (params) {
  return axios.post(url + 'resourceArrange/updateTempArrange', params).then(result => {
    return result
  })
}
// 人员排班-查询所有医生(集团维度) 平台
function getStaff (params) {
  return axios.post('/thc-platform-core/out/staff/getStaffListHasSubjectByCondition/', params)
}
// 人员排班-查询人员排班
function search (params) {
  return axios.get(url + 'arrangeInstance/searchByStaff', {params: params})
}
// 机构排班-查询排班
function searchByClinic (params) {
  return axios.get(url + 'arrangeInstance/searchByClinic', {params: params})
}
// 根据机构，科室获取执行科室下的医生 平台
function getdocByorgDpt (params) {
  return axios.post('/thc-platform-core/out/subject/getTenantSubjectListHasStaffByCondition/', params)
}
// 机构排班-查询详情
function getByclinic (params) {
  return axios.get(url + 'arrangeInstance/getByClinic', {params: params})
}
// 机构排班-删除排班
function deleteByclinic (params) {
  return axios.post(url + 'arrangeInstance/deleteByClinic', params)
}
// 机构排班-复制
function copyByclinic (params) {
  return axios.post(url + 'arrangeInstance/copyByClinic', params)
}
// 机构排班-发布
function publishByclinic (params) {
  return axios.post(url + 'arrangeInstance/publishByClinic', params)
}
// 科室排班-复制
function copyBydpt (params) {
  return axios.post(url + 'arrangeInstance/copyByDept', params)
}

export default {
  getDeptResource,
  getResourceList,
  addWeekResource,
  getDeptWeekArrange,
  addDeptWeekArrange,
  delDeptWeekArrange,
  delWeekResource,
  setValidWeekResource,
  getBasesetResourceDetail,
  updateBasesetTimerange,
  delArrangeBasesetResource,
  addMonthArrange,
  approveArrange,
  submitArrangeToApprove,
  returnArrangeBasesetResource,
  getAppointRelsList,
  getDownLoadUrl,
  getCheckLogArrangeList,
  setTimesliceChannelRel,
  getResourceArrangeZzByStaffListDate,
  getResourceArrangeZzByClinicListDate,
  getClinicTrunkListByStaffDept,
  getStaffTrunkListByClinicDept,
  insertArrangeRequestByStaff,
  insertArrangeRequestByClinic,
  publishResourceArrangeZzByClinicListDate,
  addTempArrange,
  getSourceByClinicCityList,
  getClinicList,
  getArrangeUseList,
  updateTempArrange,
  getNowDataResourceList,
  getArrangeResourceOnly,
  getById,
  createOrmodify,
  getStaff,
  search,
  searchByClinic,
  getdocByorgDpt,
  getByclinic,
  deleteByclinic,
  copyByclinic,
  copyBydpt,
  publishByclinic
}
