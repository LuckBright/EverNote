// 调拨api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'allotBound/'
const urllocal = 'localSetting/'
function createAllotBound (params) { // 提交调拨单
  return axios.post(url + 'createAllotBound/', params)
}
function list (params) { // 调拨单列表查询
  return axios.post(url + 'getAllotBoundList/', params)
}
function getAllotBoundInfo (params) { // 查看调拨详情
  return axios.post(url + 'getAllotBoundInfo/', params)
}
function rollBackAllotBound (params) { // 取消调拨单
  return axios.post(url + 'rollBackAllotBound/', params)
}
function byStorageRoomId (params) {
  return axios.post(urllocal + 'getLocalSettingListByStorageRoomId/', params)
}
function submitAllotBound (params) { // 更新调拨单
  return axios.post(url + 'submitAllotBound/', params)
}

export default {
  createAllotBound,
  list,
  byStorageRoomId,
  getAllotBoundInfo,
  rollBackAllotBound,
  submitAllotBound
}
