import { getInstance } from '../api'
import config from '@/titancare/store/config'

const axios = getInstance()

// 获取用户信息
function user () {
  return axios.post(config.thcApi + '/thc-platform-core/unify/getCurrentUser').then(results => {
    return results.data
  })
}

// 获取权限信息
function resources () {
  return axios.post(config.thcApi + '/thc-platform-core/unify/getElementsByUser').then(results => {
    return results.data
  })
}

export default {
  user,
  resources,
}
