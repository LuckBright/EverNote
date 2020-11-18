import api from '@/titanmall/utils/api.js'

let url = api.url
let axios = api.base

// 创建商城
function shopCreate (params) {
  return axios.post(url + 'manage/shop/create', params)
}

// 获取商城信息
function shopDetail () {
  return axios.get(url + 'manage/shop/detail')
}

// 保存商城信息
function shopSave (params) {
  return axios.post(url + 'manage/shop/save', params)
}

// 保存退货地址信息
function createReturnAddress (params) {
  return axios.post(
    url + 'manage/shopReturnAddress/createReturnAddress',
    params,
  )
}

// 获取退货地址信息
function getReturnAddress () {
  return axios.get(url + 'manage/shopReturnAddress/getReturnAddress')
}

// 保存支付宝商户信息
function saveAliPayInfo (params) {
  return axios.post(url + 'manage/payConfig/saveAliPayInfo', params)
}

// 微信/支付宝 起停
function paySwitch (params) {
  return axios.post(url + 'manage/payConfig/switch', params)
}

// 获取支付配置信息
function payInfo () {
  return axios.get(url + 'manage/payConfig/getInfo')
}

// 获取已有公众号列表
function listAuthPubApp () {
  return axios.get(url + 'manage/payConfig/listAuthPubApp')
}

// 使用已认证的appID
function bindAuthAppId (params) {
  return axios.post(url + 'manage/payConfig/bindAuthAppId/' + params.appId)
}

// 绑定新的appId
function bindNewAppId (params) {
  return axios.post(url + 'manage/payConfig/bindNewAppId/' + params.appId)
}

// 获取二维码
function getAuthUrl () {
  return axios.get(url + 'manage/payConfig/getAuthUrl')
}

// 获取域名地址
function shopDomain () {
  return axios.get(url + 'manage/shop/domain')
}

// 保存微信信息
function saveWxPayInfo (params) {
  return axios.post(url + 'manage/payConfig/saveWxPayInfo', params)
}

// 获取交易设置
function tradeGet () {
  return axios.get(url + 'manage/shop/set/trade/get')
}

// 保存交易设置
function tradeSave (params) {
  return axios.post(url + 'manage/shop/set/trade/save', params)
}

// 订单来源-保存
function orderSourceSave (params) {
  return axios.post(url + 'manage/orderSource/save', params)
}

// 订单来源-获取数据
function orderSourceList () {
  return axios.get(url + 'manage/orderSource/list')
}

// 微信新增公众号
function bindWxPublic (params) {
  return axios.post(
    url + `manage/payConfig/bindWxPublic/${ params.appId }/${ params.appName }/${ params.appSecrete }`,
  )
}

export default {
  shopCreate,
  shopDetail,
  shopSave,
  createReturnAddress,
  getReturnAddress,
  saveAliPayInfo,
  paySwitch,
  payInfo,
  listAuthPubApp,
  bindAuthAppId,
  bindNewAppId,
  getAuthUrl,
  shopDomain,
  saveWxPayInfo,
  tradeGet,
  tradeSave,
  orderSourceSave,
  orderSourceList,
  bindWxPublic,
}
