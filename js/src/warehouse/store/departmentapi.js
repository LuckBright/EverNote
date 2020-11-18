import { warehouse as axios } from './api'
import { diction } from '@/store/common'
import storage from '@/util/storage'

const url = 'department/'
const url1 = diction.api + '/thc-platform-core/'

function getById (id) {
  return axios.post(url + 'getDepartmentInfo/', {
    id
  }).then(result => {
    result.staffId = result.staffId === 0 ? '' : result.staffId
    return result
  })
}
function createOrUpdate (department) {
  if (department.staffId === '') {
    department.staffId = 0
  }
  var path = department.id ? 'updateDepartment' : 'createDepartment'
  return axios.post(url + path + '/', department)
}

function del (params) {
  return axios.post(url + 'updateDepartment/', params)
}

function delStaff (id) {
  return axios.post(url + 'updateStaffForDelete/', { id })
}
// 对外部部门接口查询
// 根据机构查询科室
// function list (params) {
//   return axios.post('section/getLocalLists', params)
// }
// 平台科室
// type不传默认就是集团的
function list (type, params) {
  if (!type) {
    type = 'TENANTID'
  }
  return axios.post(url1 + 'tsOrganizationSubject/loadTenantSubjectListByOrgId',
   {orgId: storage.getLocalStorage(type)}).then(res => {
     let deptOptions = res.pageList ? res.pageList.filter(item => !!item).map(item => ({ id: item.orgSubjectCode, name: item.orgSubjectName })) : []
     return deptOptions
   })
}
// 机构科室列表
function dptlist (params) {
  return axios.post('localSectionRecord/getLocalSectionVoListForService/', params)
}
function listed (params) {
  return axios.post(url + 'getSuperDepartmentList/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  delStaff,
  list,
  listed,
  dptlist
}
