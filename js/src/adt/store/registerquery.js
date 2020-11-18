import axios from '@/rcm/store/api'
import { diction } from '@/store/common'
const baseurl = diction.api
// 提交登记信息获取住院号
function admitRegistrationListQuery (params) {
  return axios.post(baseurl + '/adt/admit/admitRegistrationListQuery', params)
}
// 获取床名列表名称
function getAdmitBedTypeList (params) {
  return axios.post(baseurl + '/warehouse/hospitalBedRelation/getHospitalBedRelationList/', params)
  // axios.post(baseurl + 'adt/admit/admitRegistrationBedTypeList', params)
}
export default {
  admitRegistrationListQuery,
  getAdmitBedTypeList
}
