import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const disurl = url + '/rcm/cashier'
const remarkurl = url + '/rcm'
// 获取打折人列表
export function getDiscountList (data) {
  return fetch({
    url: `${disurl}/discountStaff/getByClinicId`,
    method: 'post',
    data: data
  })
}
// 新建打折人
export function createDiscountPerson (data) {
  return fetch({
    url: `${disurl}/discountStaff/create`,
    method: 'post',
    data: data
  })
}
// 更新打折人
export function updateDiscountPerson (data) {
  return fetch({
    url: `${disurl}/discountStaff/update`,
    method: 'post',
    data: data
  })
}
// 打折备注列表
export function discountRemarkList (data) {
  return fetch({
    url: `${remarkurl}/discountRemarks/findByClinicId`,
    method: 'post',
    data: data
  })
}
// 创建打折备注
export function createDiscountRemark (data) {
  return fetch({
    url: `${remarkurl}/discountRemarks/create`,
    method: 'post',
    data: data
  })
}
// 更新打折备注
export function updateDiscountRemark (data) {
  return fetch({
    url: `${remarkurl}/discountRemarks/update`,
    method: 'post',
    data: data
  })
}
// 根据打折人获取打折备注
export function getRemarkByPerson (data) {
  return fetch({
    url: `${remarkurl}/discountRemarks/findByDiscountStaff`,
    method: 'post',
    data: data
  })
}
// 获取补费项目列表
export function getServiceList (data) {
  return fetch({
    url: `${remarkurl}/ar/repayItem/selectList`,
    method: 'post',
    data: data
  })
}
// 新增补费项目
export function addServiceItem (data) {
  return fetch({
    url: `${remarkurl}/ar/repayItem/insertSelective`,
    method: 'post',
    data: data
  })
}
// 删除补费项目
export function deleteServiceItem (data) {
  return fetch({
    url: `${remarkurl}/ar/repayItem/deleteById`,
    method: 'post',
    data: data
  })
}
// 模糊搜索补费项目
export function getServiceItem (data) {
  return fetch({
    url: `${url}/sob/service/searchForBrowser`,
    method: 'post',
    data: data
  })
}
