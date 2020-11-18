import { auth } from './api'
const url = '/thc-platform-core/sys/role/'
const url1 = '/thc-platform-core/unify/'

// 获取角色数据信息
function getById (id) {
  return auth.post(url + 'getRoleInfoById/', {
    roleId: id
  })
}

// 新增或者修改角色 复制也是走save接口
function createOrUpdate (obj) {
  if (parseInt(obj.num) === 2) {
    obj.roleId = -1
  }
  var path = (parseInt(obj.roleId) === -1) ? 'save' : 'update'
  return auth.post(url + path + '/', obj)
}

// 删除角色
function del (id) {
  return auth.post(url + 'removeRoleInfo', {
    roleId: id
  })
}

// 查询角色列表
function list (params) {
  return auth.post(url + 'getRoleInfos', params)
}

// 查询角色下的所有用户列表
function listAllUser (params) {
  return auth.post(url1 + 'getUserInfosByRoleIds/', params)
}

// 删除某角色下的一个用户
function deleteUserRole (params) {
  return auth.post(url1 + 'deleteUserRole/', params)
}

// 给某角色添加一个用户
function giveRoleUsers (params) {
  return auth.post(url1 + 'giveRoleUsers/', params)
}

// 查询用户列表
function getUserInfoByNameOrPhone (params) {
  return auth.post(url1 + 'getUserInfoByNameOrPhone/', params)
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  listAllUser,
  deleteUserRole,
  giveRoleUsers,
  getUserInfoByNameOrPhone
}
