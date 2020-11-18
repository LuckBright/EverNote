import { crm as axios } from './api'
import { diction } from '@/store/common'
const url = diction.api + '/c-union/doctor/shippingAddress/'

// 查询患者收货地址
function list (params) {
  return axios.get(url + 'getByPatientId', { params })
    .then((response) => {
      return response
    })
}

// 创建编辑收货地址
function createOrUpdate (params) {
  let homeUrl = params.id ? 'update/' : 'create/'
  return axios.post(url + homeUrl, params)
}

// 删除收货地址
function del (params) {
  return axios.get(url + 'delete', { params })
    .then((response) => {
      return response
    })
}

function setDefault (params) { // 设置默认收货地址
  return axios.post(url + 'setDefault/', params)
}

export default {
  list,
  createOrUpdate,
  del,
  setDefault
}
