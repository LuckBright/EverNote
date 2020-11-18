import axios from '@/insurance/store/api'
const url = '/pricemanage/pricing/'

function adjust (params) { // 创建调价
  return axios.post(url + 'set/adjust', params)
}
function initItemCol (params) { // 按项目调价获取列数据
  return axios.post(url + 'set/adjust/init', params)
}
function getForTenantPriceManage (params) { // 价格体系调价查医嘱（集团）
  return axios.post('/sob/service/getForTenantPriceManage', params)
}
function tenantQuery () { // 价格维度下拉数据
  return axios.get(url + 'scene/show/tenant/query')
}
// 价格维度设置 - 初始化
function initScene () {
  return axios.get(url + 'scene/set/init')
}
// 价格维度设置 - 维度设置 - 【集团/机构】一致
function setSceneTenant (params) {
  return axios.post(url + 'scene/set/tenant', params)
}
function preview (params) { // 价格预览列表
  return axios.post(url + 'set/adjust/detail/preview', params)
}
function checkInprocess (params) { // 调价 - 检查（调价确认创建前）
  return axios.post(url + 'set/adjust/repeat/check/inprocess', params)
}
function historyList (params) { // 调价历史列表
  return axios.post(url + 'set/adjust/history/master', params)
}
function historyDetails (id) { // 调价历史详情
  return axios.get(url + 'set/adjust/' + id)
}
function historyTable (params) { // 调价历史详情
  return axios.post(url + 'set/adjust/history/detail', params)
}
function reverse (params) { // 撤销 - 撤销未审核的调价单工作流审批
  return axios.post(url + 'set/adjust/reverse', params)
}
function getStatus () { // 获取调价状态列表
  return axios.get(url + 'set/adjust/status/list')
}
function setTenant (params) { // 设置价格精度
  return axios.post('/pricemanage/pricePrecision/set/tenant', params).then(res => {
    return true
  }).catch(res => false)
}
function getTenant (params) { // 获取价格精度
  return axios.post('/pricemanage/pricePrecision/show/tenant/query', params).then(res => {
    return res.data || {}
  }).catch(res => ({}))
}
export default {
  getStatus,
  reverse,
  initScene,
  historyTable,
  checkInprocess,
  setSceneTenant,
  adjust,
  preview,
  historyList,
  tenantQuery,
  initItemCol,
  historyDetails,
  getForTenantPriceManage,
  setTenant,
  getTenant
}
