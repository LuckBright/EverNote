import api from '@/titanmall/utils/api'

let url = api.url
let axios = api.base

// 获取数量
function statsPerDayDetails () {
  return axios.get(url + 'manage/statsPerDay/detail')
}

// 获取支付
function orderStatsPerDay () {
  return axios.get(url + 'manage/order/statistical')
}

// 获取时间
function getCurrServerDateTime () {
  return axios.get(url + 'v1.0/getCurrServerDateTime')
}

// 获取退货地址
function getReturnAddress () {
  return axios.get(url + 'manage/shopReturnAddress/getReturnAddress')
}

// 获取是否设置收款账户/是否到期
function payConfigInfo () {
  return axios.get(url + 'manage/payConfig/getInfo')
}

// 获取店铺基本信息
function shopDetail () {
  return axios.get(url + 'manage/shop/detail')
}

export default {
  statsPerDayDetails,
  orderStatsPerDay,
  getCurrServerDateTime,
  getReturnAddress,
  payConfigInfo,
  shopDetail,
}
