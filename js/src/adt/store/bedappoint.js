import axios from '@/rcm/store/api'
import { diction } from '@/store/common'
const baseurl = diction.api
// 获取床名列表名称
function getAdmitBedTypeList (params) {
  return axios.post(baseurl + '/warehouse/hospitalBedRelation/getHospitalBedRelationList/', params)
}
// 获取机构下某一类型人员集合
function getStaffList (params) {
  return axios.post(baseurl + '/warehouse/staff/getStaffList/', params)
}
// 获取账号所在机构
function getClinicInfo (params) {
  return axios.post(baseurl + '/insurance/insuranceOrg/getClinicInfo', params)
}
// 根据机构获取机构下方所有科室
function getDptsByOrgId (params) {
  return axios.post(baseurl + '/warehouse/localSectionRecord/getLocalSectionVoListForService/', params)
}
// 保存或修改床位预约
function saveBedAppoint (params) {
  return axios.post(baseurl + '/adt/bedReserve/save', params)
}
// 获取床位预约信息
function getBedAppoint (params) {
  return axios.get(baseurl + '/adt/bedReserve/getByHospitalizedNumber', {params: params})
}
// 获取床位预约信息列表，即查询接口
function getBedAppointList (params) {
  return axios.post(baseurl + '/adt/bedReserve/getListByCondition', params)
}
// 获取床位预约列表，以供导出使用
function exportToExcel (params) {
  return axios.post(baseurl + '/adt/bedReserve/exportDataByCondition', params)
}
export default {
  getAdmitBedTypeList,
  getStaffList,
  getClinicInfo,
  getDptsByOrgId,
  saveBedAppoint,
  getBedAppoint,
  getBedAppointList,
  exportToExcel
}
