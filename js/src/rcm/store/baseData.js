/*
 * @Author: renpengfei
 * @Date: 2018-06-05 10:52:04
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-07-09 11:07:32
 */
import fetch from './api'
const baseDataUrl = '/pub/voucherMapping/'
const vouchUrl = '/pub/dimension/'
const accountUrl = '/pub/account/'
/**
 *获取辅助核算维度列表
 * @param {*} data
 * @returns
 */
export const getDimensionList = (data) => {
  return fetch({
    url: vouchUrl + 'getDimensionList',
    data: data,
    method: 'post'
  })
}
/**
 *获取基础资料映射列表
 * @param {*} data
 * @returns
 */
export const getVoucherMappingList = (data) => {
  Object.keys(data).forEach(key => {
    if (data[key] === '') {
      delete data[key]
    }
  })
  return fetch({
    url: baseDataUrl + 'getVoucherMappingList',
    data: data,
    method: 'post'
  })
}
/**
 *映射表修改
 * @param {*} data
 * @returns
 */
export const update = (data) => {
  return fetch({
    url: baseDataUrl + 'updateVoucherMapping',
    data: data,
    method: 'post'
  })
}
/**
 *基础资料映射导出
 * @param {*} data
 * @returns
 */
export const exportVoucherMapping = (data) => {
  return fetch({
    url: baseDataUrl + 'exportVoucherMapping',
    data: data,
    method: 'post'
  })
}
/**
 *基础资料导入
 * @param {*} data
 * @returns
 */
export const importVoucherMapping = (data) => {
  return fetch({
    url: baseDataUrl + 'importVoucherMapping',
    data: data,
    method: 'post'
  })
}
/**
 *基础资料导入
 * @param {*} data
 * @returns
 */
export const getKingdeeBaseArchives = (data) => {
  return fetch({
    url: accountUrl + 'getKingdeeBaseArchives',
    data: data,
    method: 'post'
  })
}
/**
 *导入本地
 * @param {*} data
 * @returns
 */
export const getHisBaseArchives = (data) => {
  return fetch({
    url: baseDataUrl + 'getHisBaseArchives',
    data: data,
    method: 'post'
  })
}
