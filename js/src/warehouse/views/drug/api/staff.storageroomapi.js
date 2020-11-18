/*
  库房统一发药  个性化设置
*/

import { warehouse as axios } from '@/warehouse/store/api'
const url = 'staffRole/'

// 人员权限库房-查询库房
function getStorageRoomList (params) {
  return axios.post(url + 'getStorageRoomList/', params)
}

// 人员权限库房-更新开关信息
function updateStaffRoles (params) {
  return axios.post(url + 'updateStaffRoles/', params)
}

export default {
  getStorageRoomList,
  updateStaffRoles
}
