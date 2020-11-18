import api from '@/titanmall/utils/api.js'

let url = api.url
let axios = api.base

// 订单列表查询
function orderPage (params) {
  return axios.post(url + 'manage/order/page', params)
}

// 取消订单
function orderCancel (params) {
  return axios.get(url + 'manage/order/cancel?orderId=' + params)
}

// 查看
function orderView (params) {
  return axios.get(url + 'manage/order/view?orderId=' + params)
}

// 获取发货信息
function parcelView (params) {
  return axios.get(url + 'manage/parcel/view?orderId=' + params)
}

// 发货
function parcelDelivery (params) {
  return axios.post(url + 'manage/parcel/delivery', params)
}

// 退款处理查询
function process (params) {
  return axios.get(url + 'manage/refundOrder/process?orderId=' + params)
}

// 查询快递公司
function expressQueryCom (params) {
  return axios.post(url + 'v1.1/express/queryCom', params)
}

// 退款申请
function applyApprove (params) {
  return axios.post(url + 'manage/refundOrder/applyApprove', params)
}

// 退款
function refundApprove (params) {
  return axios.post(url + 'manage/refundOrder/refundApprove', params)
}

// 查看物流
function expressQuery (params) {
  return axios.post(url + 'v1.1/express/query', params)
}

// 获取订单来源
function orderSourceList () {
  return axios.get(url + 'manage/orderSource/list')
}

// 获取预约管理列表
function appointRecordPage (params) {
  return axios.post(url + 'manage/appointRecord/page', params)
}

// 预约管理-到店
function appointRecordFinish (params) {
  return axios.get(
    url + 'manage/appointRecord/finish?appointRecordId=' + params.id,
  )
}

// 预约管理-取消预约
function appointRecordCancel (params) {
  return axios.get(
    url + 'manage/appointRecord/cancel?appointRecordId=' + params.id,
  )
}

// 查询待发货、部分发货、待处理退款数据
function orderCount () {
  return axios.get(url + 'manage/order/count')
}

// 导出
function orderExport (params) {
  return axios.post(url + 'manage/order/export', params, params.config)
}

export default {
  orderPage,
  orderCancel,
  orderView,
  parcelView,
  parcelDelivery,
  process,
  expressQueryCom,
  applyApprove,
  expressQuery,
  refundApprove,
  orderSourceList,
  appointRecordPage,
  appointRecordFinish,
  appointRecordCancel,
  orderCount,
  orderExport,
}
