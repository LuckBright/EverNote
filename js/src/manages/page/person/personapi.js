import { warehouse as axios } from '@/warehouse/store/api'
import {auth} from '@/auth/store/api'
const url = 'staff/'
const sectionUrl = 'section/'
const clinicRecord = 'clinicRecord/'
const unify = 'thc-platform-core/unify/'
// 人员管理获取机构树
function tree (params) {
  return axios.post(url + 'tree/', params)
}
// 新建人员保存
function createOrUpdate (obj) {
  return axios.post(url + 'save/', obj)
}
// 查看编辑
function getById (staffId) {
  return axios.post(url + 'getById/', { staffId })
}
// 查询人员
function list (params) {
  return axios.post(url + 'getManagesStaffList/', params)
}
// 确认更新
function saveRelation (params) {
  return axios.post(url + 'saveRelation/', params)
}
function relations (staffId) {
  return axios.post(url + 'relations/', { staffId })
}
function getUserInfoById (staffId) {
  return axios.post(url + 'getUserInfoById/', { staffId })
}
function getWorkClinicAndSection (staffId) {
  return axios.post(url + 'getWorkClinicAndSection/', { staffId })
}
// 机构所属科室
function getLocalRelations () {
  return axios.post(sectionUrl + 'getLocalRelations/')
}
// 机构化属性启用停用
function updateStaffStatus (params) {
  return axios.post(url + 'updateStaffStatus/', params)
}
// 机构查看人员
function getLocalById (staffId) {
  return axios.post(url + 'getLocalById/', { staffId })
}
// 获取集团执业科室
function getSections (params) {
  return axios.post(sectionUrl + 'getSections', params)
}
// 获取集团执业机构
function getClinicRecordList (params) {
  return axios.post(clinicRecord + 'getClinicRecordList/', params)
}
// 校验登录账号&&登录别名是否重复
function checkUserEexist (params) {
  return auth.post(unify + 'checkUserExist/', params)
}
export default {
  tree,
  saveRelation,
  createOrUpdate,
  getById,
  checkUserEexist,
  getLocalById,
  getLocalRelations,
  getClinicRecordList,
  list,
  getSections,
  updateStaffStatus,
  relations,
  getUserInfoById,
  getWorkClinicAndSection
}
