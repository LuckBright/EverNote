// 本文档是山东乐陵医保api的文档
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const medicalUrl = '/insurance/sdllyb'

// 乐陵读取身份证硬件接口
export const getIdNo = () => {
  return fetch({
    url: 'http://127.0.0.1:9999/shensi728/get',
    method: 'post'
  })
}

// 乐陵读卡接口
export const queryBasicInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryBasicInfo`,
    method: 'post',
    data: data
  })
}
// 根据code获取字典值集
export const getListByCode = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/querySiCode`,
    method: 'post',
    data: data
  })
}
// 获取医保核心端目录
export const queryMlBySxh = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryMlBySxh`,
    method: 'post',
    data: data
  })
}
// 查询医院项目目录
export const queryYyxmInfoBySxh = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryYyxmInfoBySxh`,
    method: 'post',
    data: data
  })
}
// 乐陵医保目录更新接口
export const updateYyxmInfoBySxh = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/updateYyxmInfoBySxh`,
    method: 'post',
    data: data
  })
}

// 科室列表
export const getDeptList = (data) => {
  return fetch({
    url: `${url}/insurance/sanya/deptUpload/selectList`,
    method: 'post',
    data
  })
}
// 科室上传
export const uploadDeptInfo = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/addDept`,
    method: 'post',
    data
  })
}
// 获取医保端科室列表
export const queryHospDept = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryHospDept`,
    method: 'post',
    data
  })
}

// 上传医师信息
export const addYs = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/addYs`,
    method: 'post',
    data
  })
}

// 获取医保端医师信息
export const queryYs = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryYs`,
    method: 'post',
    data
  })
}
// 上传操作员信息
export const addCzy = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/addCzy`,
    method: 'post',
    data
  })
}
// 查询结算信息
export const queryJsxx = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryJsxx`,
    method: 'post',
    data
  })
}
// 门诊对账查询
export const queryMzdz = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryMzdz`,
    method: 'post',
    data
  })
}
// 参保人就医信息
export const queryCbrjyxx = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryCbrjyxx`,
    method: 'post',
    data
  })
}
// 查询慢病病人就医记录接口
export const queryBryyqk = (data) => {
  return fetch({
    url: `${url}${medicalUrl}/queryBryyqk`,
    method: 'post',
    data
  })
}
// 乐陵结算单打印
export const leLingPrint = (data) => {
  return fetch({
    url: `medical/leLingPrint`,
    method: 'post',
    data
  })
}

