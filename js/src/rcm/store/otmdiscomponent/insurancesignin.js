/*
 * @Author: renpengfei
 * @Date: 2018-08-13 18:51:18
 * @Last Modified by: qiaodengtao
 * @Last Modified time: 2020-09-14 17:48:03
 */
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const insuranceUrl = '/insurance/medicareCheck'
const medicalOrgUrl = '/insurance/insuranceOrg'
const templateUrl = '/insurance/medicareDirMap'

// 获取签到签退列表接口
export function page (data) {
  return fetch({
    url: `${url}${insuranceUrl}/record/page`,
    method: 'post',
    data: data
  })
}

// 管理列表里签退接口
export function signOut (data) {
  return fetch({
    url: `${url}${insuranceUrl}/record/out`,
    method: 'post',
    data: data
  })
}

// 以下是loginTips中用到的获取签到签退状态，和签到，签退接口
// 获取当前登录人的医保签到状态
export function getMedicSignStatus (data) {
  return fetch({
    url: `${url}${insuranceUrl}/query`,
    method: 'post',
    data: data
  })
}
// 个人签到接口
export function singleSignIn (data) {
  return fetch({
    url: `${url}${insuranceUrl}/in`,
    method: 'post',
    data: data
  })
}
// 个人签退接口
export function singleSignOut (data) {
  return fetch({
    url: `${url}${insuranceUrl}/out`,
    method: 'post',
    data: data
  })
}
// 获取基本医疗保险类型公司
export function getMedicalOrgList (data) {
  return fetch({
    url: `${url}${medicalOrgUrl}/getList1/`,
    method: 'post',
    data: data
  })
}
// 医保目录对照列表
export function getMedicalItemList (data) {
  return fetch({
    url: `${url}/insurance/localDir/selectListPage`,
    method: 'post',
    data: data
  })
}
// 医保目录上传前的查询接口
export function queryUploadStatus (data) {
  return fetch({
    url: `${url}/insurance/medicareDirMap/upload/forecastNew`,
    method: 'post',
    data: data
  })
}
// 医保目录上传接口
export function uploadMedicalList (data) {
  return fetch({
    url: `${url}${templateUrl}/upload/compare`,
    method: 'post',
    data: data
  })
}
// 医保模板下载
export function templateDownload (data) {
  return fetch({
    url: `${url}${templateUrl}/export`,
    method: 'post',
    data: data
  })
}
// 医保模板上传
export function templateUpload (data) {
  return fetch({
    url: `${url}${templateUrl}/upload/compare`,
    method: 'post',
    data: data
  })
}
// 医保数据导入
export function dataImport (data) {
  return fetch({
    url: `${url}${templateUrl}/import`,
    method: 'post',
    data: data
  })
}

// 读取本地mac地址
export function getMacAddress () {
  return fetch({
    url: `http://127.0.0.1:9099/getMac`,
    method: 'post'
  })
}
// 显著环境不同的读卡方式需要先传参数
export function changeReadType (data) {
  return fetch({
    url: `http://127.0.0.1:9099/changeReadType`,
    method: 'post',
    data: data
  })
}
// 查询中心编码
export function selectByParam (data) {
  return fetch({
    url: `${url}/insurance/medicareDir/selectByParam`,
    method: 'post',
    data: data
  })
}

// 新增对照
export function insert (data) {
  return fetch({
    url: `${url}/insurance/medicareDirMap/insert`,
    method: 'post',
    data: data
  })
}
// 编辑对照
export function updateById (data) {
  return fetch({
    url: `${url}/insurance/medicareDirMap/updateById`,
    method: 'post',
    data: data
  })
}
export function deleteById (data) {
  return fetch({
    url: `${url}/insurance/medicareDirMap/deleteById`,
    method: 'post',
    data: data
  })
}
// 编辑对照
export function loadNewData (data) {
  return fetch({
    url: `${url}/insurance/localDir/loadNewData`,
    method: 'post',
    data: data
  })
}
// 批量上传
export function compareNew (data) {
  return fetch({
    url: `${url}/insurance/medicareDirMap/upload/compareNew`,
    method: 'post',
    data: data
  })
}

// 物资信息同步
export function loadNewDataByServiceId (data) {
  return fetch({
    url: `${url}/insurance/localDir/loadNewDataByServiceId`,
    method: 'post',
    data: data
  })
}
