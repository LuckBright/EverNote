import { warehouse as axios } from '@/warehouse/store/api'
import { auth } from '@/auth/store/api.js'
const url = 'config/'
const newUrl = '/thc-platform-core/'

function list (params) {
  return axios.post(url + 'getManageConfigList/', params)
}

function update (params) {
  return axios.post(url + 'updateManageConfig/', params)
}

function manage (params) {
  return auth.post(newUrl + url + 'getClinicManageConfigForRecord', params)
}

function tree (id) {
  return axios.post(url + 'getManageConfigTree/', { id })
}
function updateManage (params) {
  return axios.post(url + 'updateManageConfigItem/', params)
}

export default {
  list,
  update,
  manage,
  tree,
  updateManage
}
