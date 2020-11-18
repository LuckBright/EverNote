/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-09-15 14:44:49
 * @LastEditTime: 2020-10-27 09:59:56
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
// 业务申领api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'requisition/'
const urlSwitch = 'switchConfig/'
const defaultUrl = 'apply/'

// 申领取消
function rollBackRequistion (params) {
  return axios.post(url + 'rollBackRequistion/', params)
}

// 申领提交
function createOrUpdate (params) {
  return axios.post(url + 'createRequisition/', params)
}

// 申领暂存
function temporaryStorageRequisition (params) {
  return axios.post(url + 'temporaryStorageRequisition/', params)
}

// 查看详情
function getById (params) {
  return axios.post(url + 'getRequisitionInfo/', params).then((result) => {
    return result
  })
}

async function list (params) {
  return await axios.post(url + 'getRequisitionList/', params)
}

function updateSwitch (params) {
  return axios.post(urlSwitch + 'updateSwitchConfig/', params).then((response) => {
    return response
  })
}

function defaultStorageRoom (params) {
  return axios.post(defaultUrl + 'defaultParentRoom/', params).then(result => {
    return result
  })
}

function createApplyOrder (params) {
  return axios.post(defaultUrl + 'createApplyOrder/', params).then(result => {
    return result
  })
}

export default {
  updateSwitch,
  list,
  getById,
  createOrUpdate,
  defaultStorageRoom,
  createApplyOrder,
  temporaryStorageRequisition,
  rollBackRequistion
}
