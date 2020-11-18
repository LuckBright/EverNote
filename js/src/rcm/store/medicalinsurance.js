/*
 * @Author: renpengfei
 * @Date: 2018-11-22 15:05:11
 * @Last Modified by: renpengfei
 * @Last Modified time: 2019-12-12 20:03:31
 */
import fetch from './api'
import {diction} from '@/store/common'
const url = diction.api
// 保险公司名称
const insuranceNameUrl = '/insurance/insuranceOrg/'
// 保险公司产品
const insuranceProductUrl = '/insurance/insurProduct/'
// 机构下人员
const peopleUrl = '/warehouse/staff/'
// rcm
const rcmUrl = '/rcm/ar/'
const cusUrl = '/rcm/er/'
const paramUrl = '/rcm/common/param/'
/**
 *
*/
// 保险名称
export const insuranceName = (data) => {
  return fetch({
    url: `${url}${insuranceNameUrl}getList1`,
    method: 'post',
    data: data
  })
}
// 保险产品
export const insuranceProduct = (data) => {
  return fetch({
    url: `${url}${insuranceProductUrl}getListByOrgId`,
    method: 'post',
    data: data
  })
}
// 大客户公司
export const getAll = (data) => {
  return fetch({
    url: `${url}${cusUrl}bigCustomer/getAll`,
    method: 'get',
    data: data
  })
}
// 大客户产品
export const selectByCustomer = (data) => {
  return fetch({
    url: `${url}${cusUrl}reimburseProgramme/selectByCustomer`,
    method: 'post',
    data: data
  })
}

// 集团下人员
export const getStaffList = (data) => {
  return fetch({
    url: `${url}${peopleUrl}getStaffList/`,
    method: 'post',
    data: data
  })
}
// 查询收款单列表
export function getReceiptList (data) {
  return fetch({
    url: `${url}${rcmUrl}receiptInfo/search`,
    method: 'post',
    data: data
  })
}
// 收款单详情
export function getReceiptDetail (data) {
  return fetch({
    url: `${url}${rcmUrl}receiptInfo/getCompositeDoc`,
    method: 'post',
    data: data
  })
}
// 新建收款单
export function createReceipt (data) {
  return fetch({
    url: `${url}${rcmUrl}receiptInfo/create`,
    method: 'post',
    data: data
  })
}
// 作废收款单
export function deleteReceipt (data) {
  return fetch({
    url: `${url}${rcmUrl}receiptInfo/delete`,
    method: 'post',
    data: data
  })
}
// 理赔账单列表
export const search = (data) => {
  return fetch({
    url: `${url}${rcmUrl}receivableInfo/search`,
    method: 'post',
    data: data
  })
}
// 理赔商保结算单列表
export const receivableSettlements = (data) => {
  return fetch({
    url: `${url}${rcmUrl}receivableInfo/getReceivableSettlements`,
    method: 'post',
    data: data
  })
}
export const getBigCustomerCheckSettlements = (data) => {
  return fetch({
    url: `${url}${rcmUrl}receivableInfo/getBigCustomerCheckSettlements`,
    method: 'post',
    data: data
  })
}
// 新建或更新理赔单
export const save = (data) => {
  let saveurl
  // 更新调用新接口
  if (data.id) {
    saveurl = `${url}${rcmUrl}receivableInfo/updateReceive`
  } else {
    saveurl = `${url}${rcmUrl}receivableInfo/save`
  }
  return fetch({
    url: saveurl,
    method: 'post',
    data: data
  })
}
// 根据id获取应收单详情(getById)
export const getById = (data) => {
  return fetch({
    url: `${url}${rcmUrl}receivableInfo/getById`,
    method: 'post',
    data: data
  })
}
// 获取账号所在机构
export function getClinicInfo (data) {
  return fetch({
    url: `${url}/insurance/insuranceOrg/getClinicInfo`,
    method: 'post',
    data: data
  })
}
// 根据机构获取机构下方所有科室
export function getDptsByOrgId (data) {
  return fetch({
    url: `${url}/thc-platform-core/out/subject/getTenantSubjectListByCondition/`,
    method: 'post',
    data: data
  })
}
// 根据机构和科室获取对应科室下的人员
export function getOrgInfo (data) {
  return fetch({
    url: `${url}/thc-platform-core/tsStaff/pageList/`,
    method: 'post',
    data: data
  })
}
// 根据id获取账单调整明细
export function getProtestDetailList (data) {
  return fetch({
    url: `${url}${rcmUrl}rcmchange/searchByReId`,
    method: 'post',
    data: data
  })
}
// 获取调整类型
export function getChangeType (data) {
  return fetch({
    url: `${url}${rcmUrl}rcmchange/getChangeType`,
    method: 'post',
    data: data
  })
}
// 获取差异调整类型
export function getDifChangeType (data) {
  return fetch({
    url: `${url}${rcmUrl}rcmchange/getDifChangeType`,
    method: 'post',
    data: data
  })
}
// 调整处理函数
export function changeHandler (data) {
  return fetch({
    url: `${url}${rcmUrl}rcmchange/create`,
    method: 'post',
    data: data
  })
}
// 账单审批管理页
export function getClaimApprovalList (data) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/search`,
    method: 'post',
    data: data
  })
}
// 获取审批成功的账单列表，供生成应收账单使用
export function search4LiPei (data) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/search4LiPei`,
    method: 'post',
    data: data
  })
}
// 新建账单审批单,是否提交是通过参数subToCheck控制的
export function createClaimApproval (data) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/createList`,
    method: 'post',
    data: data
  })
}
// 提交审批
export function submitClaimApproval (data) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/submitCheckFirstTime`,
    method: 'post',
    data: data
  })
}
// 审批通过
export function passClaimApproval (data) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/agreeCheckByIds`,
    method: 'post',
    data: data
  })
}
// 驳回审批
export function rejectClaimApproval (data) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/refuseCheckByIds`,
    method: 'post',
    data: data
  })
}
// 根据审批单id查询审批单详情
export function getClaimApprovalDetail (id) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/showDetailById/${id}`,
    method: 'post'
  })
}

// 查询审批流程
export function getClaimApprovalLog (id) {
  return fetch({
    url: `${url}${rcmUrl}receivableInfoCheck/searchCheckLog/${id}`,
    method: 'get'
  })
}
// 获取下一步审批人员
export function getNext (data) {
  return fetch({
    url: `${url}/process/task/get/handler`,
    method: 'post',
    data: data
  })
}
// 获取配置参数
export function getParamByCode (data) { // 获取授权码
  return fetch({
    url: `${url}${paramUrl}getValueByCode`,
    method: 'post',
    data: data
  })
}
