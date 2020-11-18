import { crm as axios, durl } from './api'
import { diction } from '@/store/common'
const url = diction.api + '/c-union/doctor/skintest/'

// 皮试结果查询
function list (params) {
  return axios.get(url + 'getByPatientId', { params })
    .then((response) => {
      return response
    })
}

// 添加修改皮试结果
function createOrUpdate (params) {
  let homeUrl = params.id ? 'update/' : 'create/'
  return axios.post(url + homeUrl, params)
}

// 获取皮试药物
function getSkinTestDrug (params) {
  return axios.post(durl + '/warehouse/localSetting/getLocalSettingListForService/', params)
}

export default {
  list,
  createOrUpdate,
  getSkinTestDrug
}
