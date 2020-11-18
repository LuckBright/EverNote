import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const internalUrl = url + '/rcm/internal/settlement'
const receivableurl = url + '/rcm/internal/receive'
const apUrl = url + '/rcm/internal/innerTradePayment'
const arUrl = url + '/rcm/ar/settlement'
// 获取结算单那列表
export function getTitleList (data) {
  return fetch({
    url: `${internalUrl}/getTitleList`,
    method: 'post',
    data: data
  })
}
// 根据id获取结算单详情
export function getSettlementById (data) {
  return fetch({
    url: `${internalUrl}/get`,
    method: 'post',
    data: data
  })
}
// 结算单那批量审批接口
export function approvalList (data) {
  return fetch({
    url: `${internalUrl}/batchUpdate`,
    method: 'post',
    data: data
  })
}
// 审批或者取消审批接口
export function updateSettlementById (data) {
  return fetch({
    url: `${internalUrl}/update`,
    method: 'post',
    data: data
  })
}
// 删除结算单接口
export function deleteSettlementById (data) {
  return fetch({
    url: `${internalUrl}/delete`,
    method: 'post',
    data: data
  })
}
// 获取源单列表
export function getSourceList (data) {
  return fetch({
    url: `${internalUrl}/getExecutedCrossOrgBill`,
    method: 'post',
    data: data
  })
}
// 根据源单生成结算单
export function createSettle (data) {
  return fetch({
    url: `${internalUrl}/create`,
    method: 'post',
    data: data
  })
}
// 查询内部应收单列表信息接口
export function getReceivableList (data) {
  return fetch({
    url: `${receivableurl}/search`,
    method: 'post',
    data: data
  })
}
// 内部应收单审批接口
export function ReceivableApproval (data) {
  return fetch({
    url: `${receivableurl}/approve`,
    method: 'post',
    data: data
  })
}
// 内部应收单取消审批接口
export function ReceivableCancelApproval (data) {
  return fetch({
    url: `${receivableurl}/cancelApprove`,
    method: 'post',
    data: data
  })
}

// 应付单列表接口
export function selectPage (data) {
  return fetch({
    url: `${apUrl}/selectPage`,
    method: 'post',
    data: data
  })
}

// 应付单审批
export function check (data) {
  return fetch({
    url: `${apUrl}/check`,
    method: 'post',
    data: data
  })
}

// 跨机构医嘱查询
export function getCrossExeBillDetails (data) {
  return fetch({
    url: `${arUrl}/getCrossExeBillDetails`,
    method: 'post',
    data: data
  })
}
// 跨机构医嘱查询的导出
export function exportCrossExeBillDetails (data) {
  return fetch({
    url: `${arUrl}/exportCrossExeBillDetails`,
    method: 'post',
    data: data
  })
}
