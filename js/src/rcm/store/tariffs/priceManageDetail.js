/*
 * @Author: renpengfei
 * @Date: 2018-05-07 18:27:32
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-05-09 18:15:33
 */
import fetch from '../api'
import {diction} from '@/store/common'
const url = diction.api
const priceUrl = url + '/pricemanage/sale/'
/**
 * 获取调价单状态
 *
 * @param {any} data
 * @returns
 */
const getStatus = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/getPriceAdjustTableStatusList',
    method: 'post',
    data: data
  })
}
/**
 * 获取可用价目表
 *
 * @param {any} data
 * @returns
 */
const getPriceList = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/getPriceTableList',
    method: 'post',
    data: data
  })
}
/**
 * 创建调价单（导入）
 *
 * @param {any} data
 * @returns
 */
const loadDetail = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/create',
    method: 'post',
    data: data
  })
}
/**
 * 创建调价单（导入）
 *
 * @param {any} data
 * @returns
 */
const list = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/getMasterAndDetails',
    method: 'post',
    data: data
  })
}
/**
 * 创建调价单（导入）
 *
 * @param {any} data
 * @returns
 */
const delNoPrice = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/deleteNoPriceItemByPriceAdjustTableId',
    method: 'post',
    data: data
  })
}
/**
 * 创建调价单（导入）
 *
 * @param {any} data
 * @returns
 */
const submit = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/submitToApprovalProcess',
    method: 'post',
    data: data
  })
}
/**
 * 创建调价单（导入）
 *
 * @param {any} data
 * @returns
 */
const update = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/updateBatch',
    method: 'post',
    data: data
  })
}
/**
 * 创建调价单（导入）
 *
 * @param {any} data
 * @returns
 */
const del = (data) => {
  return fetch({
    url: priceUrl + 'priceAdjustTable/deleteItemByPriceAdjustTableDetailId',
    method: 'post',
    data: {'priceAdjustTableDetailId': data}
  })
}
export default{
  getPriceList,
  loadDetail,
  list,
  del,
  submit,
  delNoPrice,
  update,
  getStatus
}
