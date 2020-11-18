import { getInstance } from '../api'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls.js'
import storage from '@/util/storage'

const axios = getInstance()
axios.defaults.baseURL += prefix.cms

const axios1 = getInstance()
axios1.defaults.baseURL = diction.apiIh + prefix.cms

let url = `region/`
const urlDoc = `${diction.api}${prefix.doc}`

// 新增首页推荐位
function createOrUpdate (params) {
  const orgId = storage.getLocalStorage('CLINICID')
  let homeUrl = params.id ? `update?x-org-id=${orgId}` : `create?x-org-id=${orgId}`
  return axios.post(url + homeUrl, params)
}

// 推荐资料&位置列表
function list (params) {
  const orgId = storage.getLocalStorage('CLINICID')
  return axios.post(url + `list?x-org-id=${orgId}`, params)
}

// 推荐医生列表
function searchDoctor (params) {
  return axios.post(url + 'searchDoctor/', params)
}

// 图文医生推荐列表
function itemSearchDoctor (params) {
  return axios.post(url + 'itemSearchDoctor', params)
}

// 上下线接口
function enable (params) {
  return axios.post(url + 'enable/', params)
}

// 删除接口
function remove (params) {
  return axios.post(url + 'remove/', params)
}

// 科室图标列表接口
function getTenantSubjectListByPhoto (params) {
  const orgId = storage.getLocalStorage('CLINICID')
  return axios.post(url + `getTenantSubjectListByPhoto?x-org-id=${orgId}`, params)
}

// 科室图标修改接口
function Updateicon (params) {
  const orgId = storage.getLocalStorage('CLINICID')
  return axios.post(`/config/createOrUpdate?x-org-id=${orgId}`, params)
}

// 图文问诊机构
function getOrgListByCondition () {
  return axios.post('platformCore/v1.1/out/organization/getOrgListByCondition')
}

// 图文问诊机构
function getTenant (params) {
  return axios.post('platformCore/v1.1/out/subject/getTenantSubjectListByCondition', params, params.config)
}

// 图文问诊职称
function getValueListBySetCode (params) {
  return axios.post('platformCore/v1.0/valueSet/getValueListBySetCode', params)
}

// 图文问诊table数据
function getTableList (params) {
  return axios.post('platformCore/v1.1/out/staff/getStaffListHasOrgHasSubjectByCondition', params, params.config)
}

// 图文问诊单个保存图文信息
function creatServiceItem (params) {
  return axios.post('admin/v1.1/creatServiceItem', params)
}

// 图文问诊批量保存图文信息
function creatServiceItemBatch (params) {
  return axios.post('admin/v1.1/creatServiceItemBatch', params)
}

// 图文问诊根据医生查询图文
function getServiceItem (params) {
  return axios.get('admin/v1.1/getServiceItem/' + params.doctorId, params.config)
}

// 图文问诊根据医生查询图文
function getPriceList (params) {
  return axios.post('admin/v1.1/priceList', params, params.config)
}

// 获取科室里面的医生
function getDeptDoctors (params) {
  const orgId = storage.getLocalStorage('CLINICID')
  return axios1.post(url + 'doctorList?x-org-id=' + orgId, params)
}

// 执业申请
function getIHAllow (params) {
  return axios.post('config/getIHAllow', params)
}

function removeConfig (params) {
  return axios.get('config/remove', { params })
}

// 执业申请保存
function createOrUpdateIHAllow (params) {
  return axios.post('config/createOrUpdateIHAllow', params)
}

function getShopAllow (params) {
  return axios.post('config/getShopAllow', params)
}

function createOrUpdateShopAllow (params) {
  return axios.post('config/createOrUpdateShopAllow', params)
}

// 查询当前医生是否有未完成的图文问诊
function weatherHaveCounselBeingProcessed (params) {
  return axios.post(urlDoc + 'counsel/v4.1/weatherHaveCounselBeingProcessed', params)
}

export default {
  createOrUpdate,
  list,
  searchDoctor,
  enable,
  remove,
  getTenantSubjectListByPhoto,
  Updateicon,
  getOrgListByCondition,
  getTenant,
  getValueListBySetCode,
  getTableList,
  creatServiceItem,
  getServiceItem,
  getPriceList,
  creatServiceItemBatch,
  getIHAllow,
  createOrUpdateIHAllow,
  itemSearchDoctor,
  getShopAllow,
  createOrUpdateShopAllow,
  weatherHaveCounselBeingProcessed,
  removeConfig,
  getDeptDoctors
}
