import { warehouse as axios } from '../../../store/api'
// 机构部门
const url = 'localDepartment/'

// create为机构关联集团部门，update为修改关联本地后机构部门
function createOrUpdate (obj) {
  var path = obj.id ? 'updateLocalDepartment' : 'createLocalDepartment'
  return axios.post(url + path + '/', obj)
}

function list (params) {
  return axios.post(url + 'getLocalDepartmentList/', params)
}

function getById (id) {
  return axios.post(url + 'getLocalDepartmentInfo/', { id }).then(result => {
    return result
  })
}

// 编辑机构部门档案
function updateRelation (obj) {
  return axios.post(url + 'updateLocalDepartmentRelation/', obj).then(result => {
    return result
  })
}

// 机构部门状态update
function updateDepartmentStatus (params) {
  return axios.post(url + 'updateLocalDepartmentMaster/', params).then(result => {
    return result
  })
}

export default {
  createOrUpdate,
  list,
  getById,
  updateRelation,
  updateDepartmentStatus
}
