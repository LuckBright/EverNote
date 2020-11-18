/*
 * @Author: renpengfei
 * @Date: 2018-05-24 14:30:54
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-06-11 15:54:38
 */
import fetch from './api.js'
import { diction } from '@/store/common'

const url = diction.api
const initUrl = '/pub/rules/'

const clinic = '/warehouse/clinic/'
const clinicUrl = '/pub/setofbook/'
const sumUrl = '/ar/summary/'
const accountUrl = '/pub/account/'
const currClinUrl = url + '/insurance/insuranceOrg//'

/**
 *  机构
 *
 * @param {any} data
 * @returns
 */
export const getClinicList = (data) => {
  return fetch({
    url: url + clinic + 'getClinicList/',
    method: 'post',
    data: data
  })
}
/**
 *  当前机构
 *
 * @param {any} data
 * @returns
 */
export const getClinicInfo = (data) => {
  return fetch({
    url: currClinUrl + 'getClinicInfo',
    method: 'post',
    data: data
  })
}
/**
* 账套名称
*
* @param {any} data
* @returns
*/
export const getListByClinicId = (data) => {
  return fetch({
    url: clinicUrl + 'getName/',
    method: 'post',
    data: data
  })
}
/**
*  模块名称
*
* @param {any} data
* @returns
*/
export const getModuleTypeEnum = (data) => {
  return fetch({
    url: sumUrl + 'getModuleTypeEnum',
    method: 'post',
    data: data
  })
}
/**
* 查询生成规则
*
* @param {any} data
* @returns
*/
export const getList = (data) => {
  return fetch({
    url: initUrl + 'getList1',
    method: 'post',
    data: data
  })
}
/**
* 初始化生成凭证规则表头
*
* @param {any} data
* @returns
*/
export const initRule = (data) => {
  return fetch({
    url: initUrl + 'initRule',
    method: 'post',
    data: data
  })
}
/**
* 初始化生成凭证规则表体
*
* @param {any} data
* @returns
*/
export const initRuleDetail = (data) => {
  return fetch({
    url: initUrl + 'initRuleDetail',
    method: 'post',
    data: data
  })
}
/**
* 获取当前机构末级会计科目
*
* @param {any} data
* @returns
*/
export const getAccListEnd = (data) => {
  return fetch({
    url: accountUrl + 'getAccListEnd',
    method: 'post',
    data: data
  })
}
/**
* 获取一个规则
*
* @param {any} data
* @returns
*/
export const get = (data) => {
  return fetch({
    url: initUrl + 'get',
    method: 'post',
    data: data
  })
}
/**
* 修改会计规则
*
* @param {any} data
* @returns
*/
export const update = (data) => {
  return fetch({
    url: initUrl + 'update',
    method: 'post',
    data: data
  })
}
