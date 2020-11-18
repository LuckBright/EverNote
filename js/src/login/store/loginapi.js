import { login } from './api'
const url = 'platform-extend'

// 发版记录
function getBuildInfo () {
  return login.get(url + '/base/jenkins/latest-build-info')
}

export default {
  getBuildInfo
}
