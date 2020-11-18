// import axios from '@/rcm/store/api'
import { adt as axios } from './api'
import { diction } from '@/store/common'
const baseurl = diction.api

function getPatients (params) {
  return axios.post('ip/accountbill/getPatientList', params)
}
// 根据id查询患者信息
function getByIdInfo (params) {
  return axios.post(baseurl + '/adt/doctor/admit/getById', params)
}
function getById (params) {
  return axios.post(baseurl + '/adt/doctor/in/getById', params)
}
// 创建结算单
function createBill (params) {
  return axios.post(baseurl + '/rcm/ip/accountbill/createAccountBillSettle', params)
}
// 获取
function getResidentDoctorSelect (params) {
  return axios.post(baseurl + '/warehouse/staffRecord/getStaffRecordVoListForService/', params)
}
// 获取病区列表
function getAdmitWardSelect (params) {
  return axios.post(baseurl + '/thc-platform-core/out/sickArea/getSickAreaListByCondition', params)
}
// 获取收治医生/介绍人列表
function getDoctorSelect (params) {
  // return axios.post(baseurl + '/warehouse/spaceRecord/getSpaceRecordVoListForService/', params)
  return axios.post(baseurl + '/thc-platform-core/out/subject/getTenantSubjectListHasStaffByCondition/', params)
}
// 获取床位列表
function getAdmitBedSelect (params) {
  return axios.post(baseurl + '/warehouse/hospitalBedRelation/getHospitalBedRelationListForService/', params)
}
function saveRgisterInfo (params) {
  return axios.post(baseurl + '/adt/admit/admitRegistrationCreate', params)
}
// 确认支付
function getRegisteredPatientInfo (params) {
  return axios.post(baseurl + '/rcm/pay/trade/create', params)
}
// 保存登记
function setSaveInfo (params) {
  return axios.post(baseurl + '/adt/doctor/admit/save', params)
}
// 入院登记
function createHosInfo (params) {
  return axios.post(baseurl + '/adt/doctor/admit/create', params)
}
// 提交登记信息获取住院号
function createInpatientNumber (params) {
  return axios.post(baseurl + '/c-union/doctor/patient/inpatientRegister', params)
}
// 登记查询详情中，更新住院信息
function updateAdmitInfo (params) {
  return axios.post(baseurl + '/adt/admit/update', params)
}
// 待入院列表信息
function getSearchInfo (params) {
  return axios.post(baseurl + '/adt/doctor/apply/search', params)
}
// 取消登记
function getAdmitInfo (params) {
  return axios.post(baseurl + '/adt/doctor/admit/admitByPatientId', params)
}
// 取消登记
function cancelInfo (params) {
  return axios.post(baseurl + '/adt/doctor/admit/cancel', params)
}
// 退院
function deleteInfo (params) {
  return axios.post(baseurl + '/adt/doctor/admit/delete', params)
}
// 查询入院科室列表
function getTenantList (params) {
  return axios.post(baseurl + '/thc-platform-core/out/subject/getTenantSubjectListByCondition/', params)
}

// 获取床名列表名称
function getAdmitBedTypeList (params) {
  return axios.post(baseurl + '/warehouse/hospitalBedRelation/getHospitalBedRelationList/', params)
  // axios.post(baseurl + 'adt/admit/admitRegistrationBedTypeList', params)
}
function getAdmitBedTypeByBedNum (params) {
  return axios.post(baseurl + '/warehouse/hospitalBedRelation/getHospitalBedRelationByBedNum/', params)
}
// 根据visitNumber获取门诊科室
function getOutDepartByVistnum (params) {
  return axios.post(baseurl + '/arrange/appointment/getByVisitNumber', params)
}
// 获取保险产品列表
function getListByOrgId (params) {
  return axios.post(baseurl + '/insurance/insurProduct/getListByOrgId/', params)
}
// 获取保险公司列表
function getOrgList (params) {
  return axios.post(baseurl + '/insurance/insuranceOrg/getList1/', params)
}
// 调用接口去获取住院次数
function getAdmitNumber (params) {
  return axios.post(baseurl + '/workbench/hospitalizedApplianceRecord/getRecordCount', params)
}

function getSearch (params) {
  return axios.post(baseurl + '/c-union/doctor/memberChannel/search', params)
}
function modifyInpatientNumber (params) {
  return axios.get(baseurl + '/c-union/doctor/patient/modifyInpatientNumber', { params: params })
}

// 在院管理页面
function getSearchInhos (params) {
  return axios.post(baseurl + '/adt/doctor/in/search', params)
}
// 获取规则
function getRulesInfo (params) {
  return axios.post(baseurl + '/adt/doctor/prompt/search', params)
}
// 获取机构
function getOrgLists (params) {
  return axios.post(baseurl + '/thc-platform-core/out/organization/getOrgListByCondition', params)
}
// 催款规则-规则保存
function ruleCreate (params) {
  return axios.post(baseurl + '/adt/doctor/prompt/create', params)
}
// 催款规则-删除规则
function ruleDeleted (params) {
  return axios.post(baseurl + '/adt/doctor/prompt/delete', params)
}
// 催款管理-单个催款
function getPrompt (params) {
  return axios.post(baseurl + '/adt/doctor/in/prompt', params)
}
// 催款管理-多个催款
function getPromptList (params) {
  return axios.post(baseurl + '/adt/doctor/in/promptList', params)
}
// 出院管理页面-患者列表
function getOutSearch (params) {
  return axios.post(baseurl + '/adt/doctor/out/search', params)
}
// 入院办理-床位查询
function getBedList (params) {
  return axios.post(baseurl + '/workbench/ipBed/getAllBedList', params)
}
// 出院管理 取消锁定
function locked (params) {
  return axios.cancelPost(baseurl + '/adt/doctor/admit/locked', params)
}
function getDischargeInfo (params) {
  return axios.post(baseurl + '/adt/doctor/out/getDischargeInfo', params)
}
function saveDischargeInfo (params) {
  return axios.post(baseurl + '/adt/doctor/out/saveDischargeInfo', params)
}
export default {
  getPatients,
  createBill,
  getResidentDoctorSelect,
  getAdmitWardSelect,
  getAdmitBedSelect,
  saveRgisterInfo,
  getRegisteredPatientInfo,
  createInpatientNumber,
  updateAdmitInfo,
  getAdmitBedTypeList,
  getAdmitBedTypeByBedNum,
  getOutDepartByVistnum,
  getListByOrgId,
  getAdmitNumber,
  getSearchInfo,
  getByIdInfo,
  getById,
  getTenantList,
  getSearch,
  getDoctorSelect,
  getOrgList,
  setSaveInfo,
  createHosInfo,
  cancelInfo,
  deleteInfo,
  getSearchInhos,
  getOrgLists,
  getAdmitInfo,
  ruleCreate,
  getRulesInfo,
  getPrompt,
  getPromptList,
  ruleDeleted,
  getOutSearch,
  getBedList,
  locked,
  modifyInpatientNumber,
  getDischargeInfo,
  saveDischargeInfo
}
