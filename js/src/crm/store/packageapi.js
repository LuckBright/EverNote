import axios from '@/insurance/store/api'

function getInsurance (params) { // 往来单位
  return axios.post('/insurance/insuranceOrg/getList1/', params).then((response) => {
    return response
  })
}
function searchAvailable (params) { // 获取本机构可用套餐列表
  return axios.get('/market/doctor/setmeal/searchAvailable', {params: params}).then((response) => {
    return response
  })
}
function save (params) { // 提交订单
  return axios.post('/market/doctor/setmealOrder/save', params).then((response) => {
    return response
  })
}
function ifExistDisabledService (params) { // 提交订单之前验证所选项目是否被停用
  return axios.post('/market/doctor/setmealOrder/ifExistDisabledService', params).then((response) => {
    return response
  })
}
function selectNoPayAndNoFinish (params) { // 查询患者未支付和未完成的订单
  return axios.post('/market/doctor/setmealOrder/selectNoPayAndNoFinish', params).then((response) => {
    return response
  })
}
function oneStepSettle (params) { // 一站式生成结算单
  return axios.post('/rcm/mall/account/oneStepSettle', params).then((response) => {
    return response
  })
}
function list (params) { // 获取列表，以患者为明细
  return axios.post('/market/doctor/setmealOrder/search', params).then((response) => {
    return response
  })
}
function detailsList (params) { // 订单列表，以套餐为明细
  return axios.post('/market/doctor/setmealOrder/searchDetail', params).then((response) => {
    return response
  })
}
function changeStatus (params) { // 改变订单支付状态
  return axios.post('/market/doctor/setmealOrder/changeStatus', params).then((response) => {
    return response
  })
}
function cancelOrderBatch (params) { // 批量取消订单
  return axios.post('/market/doctor/setmealOrder/cancelOrderBatch', params).then((response) => {
    return response
  })
}
function orderPay (params) { // 根据订单号重新获取订单信息用来结算
  return axios.post('market/doctor/setmealOrder/orderPay', params).then((response) => {
    return response
  })
}
function searchOrderDetails (params) { // 获取套餐详情
  return axios.post('market/doctor/setmealOrder/searchOrderDetails', params).then((response) => {
    return response
  })
}
// function updatedOrder (params) {
//   return axios.post('market/doctor/setmealOrder/updateOrder', params).then((response) => {
//     return response
//   })
// }

function setmealOrderUpdateLimitUseDate (params) { // 修改套餐订单截止日期
  return axios.post('market/doctor/setmealOrder/updateLimitUseDate', params).then((response) => {
    return response
  })
}

function getOrderDetail (params) { // 退费时获取套餐明细
  return axios.post('market/doctor/setmealOrder/getOrderDetail', params).then((response) => {
    return response
  })
}
function getByCode (params) { // 获取授权码
  return axios.post('rcm/common/param/getValueByCode', params).then((response) => {
    return response
  })
}
function orderRefund (params) { // 发起退费
  return axios.post('market/doctor/setmealOrder/orderRefund', params).then((response) => {
    return response
  })
}
function refundDetail (params) { // 退款成功的回掉
  return axios.post('market/doctor/setmealOrder/refundDetailReTime', params).then((response) => {
    return response
  })
}
function createOrUpdate (params) { // 新增和编辑团体
  return axios.post('market/doctor/setMealTeam/createOrUpdate', params)
}
function importTeamDetail (params) { // 表格上传
  return axios.post('market/doctor/setMealTeam/importTeamDetail', params)
}
function groupList (params) { // 获取团体列表
  return axios.get('market/doctor/setMealTeam/search', {params: params})
}
function deleteById (params) { // 删除团体
  return axios.get('market/doctor/setMealTeam/deleteById', {params: params})
}
function groupPatientList (params) { // 团体中的患者列表
  return axios.post('market/doctor/setmealOrder/searchByTeam', params)
}
function deleteDetailByPatientId (params) { // 患者从团体中删除
  return axios.get('market/doctor/setMealTeam/deleteDetailByPatientId', {params: params})
}
function groupSave (params) { // 团体下单生成结算单
  return axios.post('market/doctor/setmealOrder/saveByTeam', params)
}
function downloadAllDetail (params) { // 生成excel
  return axios.post('market/doctor/setMealTeam/downloadAllDetail', params)
}

function getPrint (params) { // 获取打印列表
  return axios.post('/market/doctor/setmealOrder/getPrint', params)
}

function setMealCancelSettlement (params) { // 产房套餐取消结算
  return axios.post('rcm/ip/settlement/setMealCancelSettlement', params)
}

function searchByPreferential (params) { // 获取套餐优惠价
  return axios.post('/market/doctor/setmeal/searchByPreferential', params)
}

function transferOrder (params) { // 转移套餐
  return axios.post('/market/doctor/setmealOrderTransfer/transfer', params)
}
function getTransferByOrderId (params) { // 获取转移信息
  return axios.get('/market/doctor/setmealOrderTransfer/getTransferByOrderId', { params })
}

// 检查订单是否核销
function checkOrderIsUse (params) {
  return axios.post('/market/doctor/setmealOrder/checkOrderIsUse', params)
}
// 核销退费
function offLineOrderRefund (params) {
  return axios.post('/market/doctor/setmealOrder/offLineOrderRefund', params)
}
// 获取退费信息
function getRefund (params) {
  return axios.get('/market/doctor/setmealOrder/getRefund', {params})
}
export default {
  getTransferByOrderId,
  transferOrder,
  deleteDetailByPatientId,
  setMealCancelSettlement,
  ifExistDisabledService,
  selectNoPayAndNoFinish,
  searchByPreferential,
  searchOrderDetails,
  downloadAllDetail,
  importTeamDetail,
  groupPatientList,
  cancelOrderBatch,
  searchAvailable,
  createOrUpdate,
  getOrderDetail,
  oneStepSettle,
  refundDetail,
  // updatedOrder,
  setmealOrderUpdateLimitUseDate,
  getInsurance,
  changeStatus,
  orderRefund,
  detailsList,
  deleteById,
  groupSave,
  groupList,
  getByCode,
  orderPay,
  getPrint,
  save,
  list,
  checkOrderIsUse,
  offLineOrderRefund,
  getRefund
}
