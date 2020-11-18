import { card as axios } from './api'
import { sob } from '@/sob/store/api'
import { diction } from '@/store/common'
const baseurl = diction.api
const url = '/activity/'
const url1 = '/marketHistory/'

function list (params) {
  return axios.get(url + 'search', { params: params })
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}
function createOrUpdate (obj) {
  let path = obj.id ? 'modify' : 'create'
  return axios.post(url + path + '/', obj)
}
function listUpdate (obj) {
  return axios.post(url + 'modifyCheck/', obj)
}
function getByTypeAndObjId (params) {
  params = axios.jsonToFormEncoded(params)
  return axios.get(url1 + 'getByTypeAndObjId', { params: params })
}
function modify (obj) {
  return axios.post(url + 'modifyService' + '/', obj)
}
function getById (obj) {
  let params = axios.jsonToFormEncoded(obj)
  return axios.get(url + 'getById/', { params: params })
}
function del (obj) {
  // let params = axios.jsonToFormEncoded({
  //   id: id
  // })
  return axios.post(url + 'delete/', obj)
}

// 新建（需审批）
function createApply (obj) {
  // let params = axios.jsonToFormEncoded({
  //   id: id
  // })
  return axios.post(url + 'apply/', obj)
}
function modifyObj (obj) {
  return axios.post(url + 'modify/', obj)
}
function apply (id) {
  let params = axios.jsonToFormEncoded({
    id: id
  })
  return axios.post(url + 'apply/', params)
}

function freeze (obj) {
  let path = Number(obj.status) === 0 ? 'freeze' : 'unfreeze'
  let params = axios.jsonToFormEncoded({
    id: obj.id
  })
  return axios.post(url + path + '/', params)
}
function getCheckboxs () {
  return sob.post('/serviceprovider/getServiceProviderList/')
}
function getDepartmentValues (params) {
  return sob.post('/serviceprovider/getServiceProviderList/', params)
}
function queryService (params) {
  return sob.post('/service/queryService/', params)
}
function update (params) {
  return axios.post(url + 'modifyDptService', params)
}

function modifyOrgService (obj) { // 保存或修改关联机构接口(集团)
  return axios.post(url + 'modifyOrgService' + '/', obj)
}

// 获取机构区域(城市)集合（支持大区）
function getClinicCityList (params) {
  return axios.post(baseurl + '/thc-platform-core/out/organization/getOrgCityList/', params).then((response) => {
    return response
  })
}

export default {
  createOrUpdate,
  del,
  list,
  freeze,
  modify,
  listUpdate,
  apply,
  createApply,
  getById,
  modifyObj,
  getByTypeAndObjId,
  getCheckboxs,
  getDepartmentValues,
  update,
  queryService,
  getClinicCityList,
  modifyOrgService
}
