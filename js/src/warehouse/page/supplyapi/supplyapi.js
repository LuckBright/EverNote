import { auth } from '@/auth/store/api.js'
const url = '/thc-platform-core/out/'

// 从平台获取机构科室接口，老接口已删除
function getTenantSubjectListByCondition (data) {
  return auth.post(url + 'subject/getTenantSubjectListByCondition', data)
}
// 从平台获取机构病区接口，老接口已删除
function getSickAreaListByCondition (params) {
  return auth.post(url + 'sickArea/getSickAreaListByCondition', params)
}

export default {
  getTenantSubjectListByCondition,
  getSickAreaListByCondition
}
