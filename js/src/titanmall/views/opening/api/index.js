import api from '@/titanmall/utils/api'

let url = api.url
let axios = api.base

// 创建商城
function shopCreate (params) {
  return axios.post(url + 'manage/shop/create', params)
}

// 获取二维码
function shopRenewOrderCreate (params) {
  return axios.post(url + 'manage/shopRenewOrder/create', params)
}

// 获取续费价格
function shopRenewOrderPrice () {
  return axios.get(url + 'manage/shopRenewOrder/price')
}

// 查询订单是否完成
function shopRenewOrderStatus (params) {
  return axios.get(
    url + 'manage/shopRenewOrder/status?orderNo=' + params.orderNo,
  )
}

export default {
  shopCreate,
  shopRenewOrderCreate,
  shopRenewOrderPrice,
  shopRenewOrderStatus,
}
