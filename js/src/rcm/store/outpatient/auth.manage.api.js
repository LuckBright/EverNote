import axios from '@/rcm/store/api'
import {diction} from '@/store/common'
const url = diction.api + '/rcm/refund/auth/'
// 授权类型列表
function authList (params) {
  return axios.post(url + 'list', params)
}
// 修改授权状态
function authChange (params) {
  return axios.post(url + 'change', params)
}
// 授权用户列表
function userList (params) {
  return axios.post(url + 'userList', params)
}
// 新增授权用户
function userAdd (params) {
  return axios.post(url + 'userAdd', params)
}
// 删除用户授权
function userDel (params) {
  return axios.post(url + 'userDel', params)
}
// 授权历史列表
function historyList (params) {
  return axios.post(url + 'historyList', params)
}
// 验证授权
function checkAuth (params) {
  return axios.post(url + 'checkAuth', params)
}
export default {
  userAdd,
  userDel,
  authList,
  userList,
  checkAuth,
  authChange,
  historyList
}
