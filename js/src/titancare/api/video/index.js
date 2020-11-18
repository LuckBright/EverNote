import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()

axios.defaults.baseURL += prefix.cms

// 创建修改通知消息
function findStaffListAndAccountByIds (params) {
  return axios.post('platformCore/staffRecord/findStaffListAndAccountByIds', params)
}

function meeting (params) {
  return axios.post(`admin/v2.0/meeting`, params, {
    headers: {
      'Authorization': '919159044c9db824cbbdc78a09477b34'
    }
  })
}

export default {
  findStaffListAndAccountByIds,
  meeting,
}
