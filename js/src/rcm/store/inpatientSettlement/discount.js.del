/*
 * @Author: renpengfei
 * @Date: 2018-04-02 16:27:02
 * @Last Modified by: renpengfei
 * @Last Modified time: 2018-04-17 15:24:23
 */
import fetch from '../api'
import {diction} from '@/store/common'
const url = diction.api
const memberCardUrl = '/market/doctor/memberCard/'
const giftcardUrl = '/market/doctor/giftcard/'
const patientBenefitUrl = '/market/doctor/patientBenefit/'
/**
 * 会员卡
 *
 * @param {any} data
 * @returns
 */
export const getAllByPatientId = (data) => {
  return fetch({
    url: url + memberCardUrl + 'getAllByPatientId',
    method: 'get',
    params: data
  })
}
/**
 * 优惠券
 *
 * @param {any} data
 * @returns
 */
export const getNotUseByPatientId = (data) => {
  return fetch({
    url: url + giftcardUrl + 'getNotUseByPatientId',
    method: 'get',
    params: data
  })
}
/**
 * 会员权益
 *
 * @param {any} data
 * @returns
 */
export const getByPatientId = (data) => {
  return fetch({
    url: url + patientBenefitUrl + 'getByPatientId',
    method: 'get',
    params: data
  })
}
/**
 * 打印
 *
 * @param {any} data
 * @returns
 */
export const selectUrlMapping = (data) => {
  return fetch({
    url: url + '/platform-extend/reportnew/getByHisReportCode/',
    method: 'post',
    data: data
  })
}
/**
 * get一个报告注册信息
 *
 * @param {any} data
 * @returns
 */
export const get = (data) => {
  return fetch({
    url: url + '/BI/bIController/get',
    method: 'post',
    data: data
  })
}
/**
 * 根据住院号hospitalizedNumber更新患者住院状态
 *
 * @param {any} data
 * @returns
 */
export const updateHosStatus = (data) => {
  return fetch({
    url: url + '/sob/hospitalizedappliance/updateHosStatus',
    method: 'post',
    data: data
  })
}
