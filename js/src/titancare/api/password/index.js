import { getInstance } from '../api'
import { diction } from '@/store/common'

const axios = getInstance()

axios.defaults.baseURL = diction.thcApi

function logout () {
  return axios.post('thc-platform-core/unify/userLogOut')
}

// function login (name, password) {
//   return axios.post(url + 'login', { name, password })
// }

// function sendSmsCode (params) {
//   return axios.post(url + 'sendCode', params)
// }

// function modifyPassword (params) {
//   return axios.post(url + 'resetPwdByPhone', params)
// }

// function modifyFirstPassword (params) {
//   return axios.post(url + 'resetPwdByFirstLogin', params)
// }
// function modifyOldPassword (params) {
//   return axios.post(url + 'resetPwdByOldPwd', params)
// }

export default {
  logout
}
