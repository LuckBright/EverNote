import api from '@/titanmall/utils/api.js'

let url = api.url
let axios = api.base

// 获取分享
function buyPage (params) {
  return axios.post(url + 'manage/referral/buy/page', params)
}

// 导出分享数据
function buyExport (params) {
  return axios.post(url + 'manage/referral/buy/export', params, params.config)
}

// 获取优惠券列表
function couponPage (params) {
  return axios.post(url + 'manage/coupon/page', params)
}

// 数据
function couponStatistical (params) {
  return axios.get(url + 'manage/coupon/statistical/' + params)
}

// 发放
function couponBegin (params) {
  return axios.get(url + 'manage/coupon/start/' + params)
}

// 失效
function couponEnd (params) {
  return axios.get(url + 'manage/coupon/end/' + params)
}

// 新建
function couponSave (params) {
  return axios.post(url + 'manage/coupon/save', params)
}

// 查看
function couponView (params) {
  return axios.get(url + 'manage/coupon/view/' + params)
}

// 编辑
function couponEdit (params) {
  return axios.post(url + 'manage/coupon/edit', params)
}

// 选择商品
function couponSpuPage (params) {
  return axios.post(url + 'manage/couponSpu/goods/page', params)
}

// 删除
function couponSpuDelete (params) {
  return axios.get(url + 'manage/couponSpu/delete?' + params)
}

// 获取分组列表
function groupPage (params) {
  return axios.post(url + 'manage/couponSpu/group/page', params)
}

// **************分销*******************/

// 获取分销列表
function distributionOrderItem(params) {
  return axios.post(url + 'manage/distributionOrderItem/list', params)
}

// 查看分销信息
function getLowerLevels(params) {
  return axios.post(url + 'manage/distributionUser/getLowerLevels', params)
}

// 查看明细
function getItems(params) {
  return axios.post(url + 'manage/distributionOrderItem/getItems', params)
}

export default {
  buyPage,
  buyExport,
  couponPage,
  couponStatistical,
  couponBegin,
  couponEnd,
  couponSave,
  couponEdit,
  couponView,
  couponSpuPage,
  couponSpuDelete,
  groupPage,
  distributionOrderItem,
  getLowerLevels,
  getItems,
}
