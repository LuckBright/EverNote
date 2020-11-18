import { getInstance } from '../api'
import { prefix } from '@/titancare/utils/urls'

const axios = getInstance()
axios.defaults.baseURL += prefix.cms

// 创建修改通知消息
function createOrUpdateGoodsAllow (params) {
  return axios.post('/config/createOrUpdateGoodsAllow', params)
}

// 查询通知列表
function getGoodsAllow (params) {
  return axios.post('config/getGoodsAllow', params)
}
// 查询退药地址
// function getReturnAMedicineAddress (params) {
//   return axios.post(`config/getReturnAMedicineAddress`, params)
// }
// 维护退药地址
// function saveReturnAMedicineAddress (params) {
//   return axios.post(`config/saveReturnAMedicineAddress`, params)
// }

// 修改医生端短视频配置
function createOrUpdateShortVideoAllow (params) {
  return axios.post(`config/createOrUpdateShortVideoAllow`, params)
}

// 查询医生端短视频配置
function getShortVideoAllow (params) {
  return axios.post(`config/getShortVideoAllow`, params)
}

// 修改患者端短视频配置
function createOrUpdateHealthClassAllow (params) {
  return axios.post(`config/createOrUpdateHealthClassAllow`, params)
}

// 查询患者端短视频配置
function getHealthClassAllow (params) {
  return axios.post(`config/getHealthClassAllow`, params)
}

// 保存图文问诊必填项
function createOrUpdateServiceItemConfig (params) {
  return axios.post(`config/createOrUpdateServiceItemConfig`, params)
}

// 查询图文问诊必填项
function getServiceItemConfig () {
  return axios.post(`config/getServiceItemConfig`)
}

// 协议及素材配置--文案
function createOrUpdateAppAboutTextConfig (params) {
  return axios.post(`config/createOrUpdateAppAboutTextConfig`, params)
}

// 协议及素材配置--查询文案
function getAppAboutTextConfig () {
  return axios.post(`config/getAppAboutTextConfig`)
}

// 协议及素材配置--logo配置
function createOrUpdateAppLogoConfig (params) {
  return axios.post(`config/createOrUpdateAppLogoConfig`, params)
}

// 协议及素材配置--查询logo配置
function getAppLogoConfig () {
  return axios.post(`config/getAppLogoConfig`)
}

// 协议及素材配置--协议配置
function createOrUpdateAppAgreementConfig (params) {
  return axios.post(`config/createOrUpdateAppAgreementConfig`, params)
}

// 协议及素材配置--查询协议配置
function getAppAgreementConfig () {
  return axios.post(`config/getAppAgreementConfig`)
}

// 医院网址配置
function ihAddress () {
  return axios.get(`config/ihAddress`)
}

export default {
  createOrUpdateGoodsAllow,
  getGoodsAllow,
  // getReturnAMedicineAddress,
  // saveReturnAMedicineAddress,
  createOrUpdateShortVideoAllow,
  createOrUpdateHealthClassAllow,
  getShortVideoAllow,
  getHealthClassAllow,
  createOrUpdateServiceItemConfig,
  getServiceItemConfig,
  createOrUpdateAppAboutTextConfig,
  getAppAboutTextConfig,
  createOrUpdateAppLogoConfig,
  getAppLogoConfig,
  createOrUpdateAppAgreementConfig,
  getAppAgreementConfig,
  ihAddress
}
