import { auth } from './api'
const url = '/thc-platform-core/unify/'

// 登录（用户登录，选机构之后登录）
function login (params) {
  return auth.post(url + 'userLogin', params)
}

// 登录（用户登录，选机构之后登录）rsa加密之后
function loginRSA (params) {
  return auth.post(url + 'userLoginNew', params)
}

// 退出登录
function logout () {
  return auth.post(url + 'userLogOut')
}

// 修改密码
function modifyPassword (params) {
  return auth.post(url + 'resetPasswordBytelephoneNumber', params)
}

// 发送验证码
function sendSmsCode (params) {
  return auth.post(url + 'sendVerificationMsg', params)
}

// 提交验证码，验证“验证码”是否正确
function verificationMsg (params) {
  return auth.post(url + 'getVerificationMsg', params)
}

// 获取用户信息
function user () {
  return auth.post(url + 'getCurrentUser').then(results => {
    return results.data
  })
}

// 获取权限信息
function resources () {
  return auth.post(url + 'getElementsByUser').then(results => {
    return results.data
  })
}

// 获取用户信息 用户信息和角色信息
function getUserDetails (params) {
  return auth.post(url + 'getUserDetails', params)
}

// 修改账号信息（登录名，别名，密码等）修改权限信息
function createOrUpdate (params) {
  return auth.post(url + 'createOrUpdateUserInfo', params)
}

// 获取登录验证码
function sendVerificationMsg (params) {
  return auth.post(url + 'sendVerificationMsg', params)
}

// 用手机号+验证码方式登录
function loginBySms (params) {
  return auth.post(url + 'getVerificationMsg', params)
}

export default {
  login,
  loginRSA,
  logout,
  user,
  resources,
  modifyPassword,
  sendSmsCode,
  verificationMsg,
  getUserDetails,
  createOrUpdate,
  sendVerificationMsg,
  loginBySms
}
