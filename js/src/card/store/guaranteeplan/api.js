import axios from '@/rcm/store/api'
import { diction } from '@/store/common'

const baseurl = diction.api + '/market/scheduledtask/template/'
const instanceurl = diction.api + '/market/scheduledtask/instance/'

function createOrModify (params) {
  return axios.post(baseurl + (params.id ? 'modify' : 'create'), params)
}
function getBytemplateId (params) {
  return axios.get(baseurl + 'getByBusinessTemplateId', {params: params})
}
function getById (params) {
  return axios.get(baseurl + 'getById', {params: params})
}
function deleteRow (params) {
  return axios.post(baseurl + 'delete', params)
}
function modify (params) {
  return axios.post(baseurl + 'modify', params)
}
function createBatch (params) {
  return axios.post(baseurl + 'createBatch', params)
}
function getByParentId (params) {
  return axios.get(baseurl + 'getByParentId', {params: params})
}
function startTask (params) {
  return axios.post(instanceurl + 'runTask', params)
}
function stopTask (params) {
  return axios.post(instanceurl + 'stopTask', params)
}
function searchMaster (params) {
  return axios.get(instanceurl + 'searchMaster', {params: params})
}
function stopMasterTask (params) {
  return axios.post(instanceurl + 'stopMasterTask', params)
}
function getInstance (params) {
  return axios.get(instanceurl + 'getById', {params: params})
}
function getByBusinessInstanceId (params) {
  return axios.get(instanceurl + 'getByBusinessInstanceId', {params: params})
}
function getByOrderId (params) {
  return axios.get(instanceurl + 'getByOrderId', {params: params})
}
// 保障计划添加阶段或任务
function instanceCreate (params) {
  return axios.post(instanceurl + 'create', params)
}
function instancegetByParentId (params) {
  return axios.get(instanceurl + 'getByParentId', {params: params})
}

function instanceModify (params) {
  return axios.post(instanceurl + 'modify', params)
}
// 保障计划获取同级实例列表
export default {
  createOrModify,
  getById,
  getBytemplateId,
  deleteRow,
  modify,
  createBatch,
  getByParentId,
  startTask,
  stopTask,
  searchMaster,
  stopMasterTask,
  getInstance,
  getByBusinessInstanceId,
  getByOrderId,
  instanceCreate,
  instancegetByParentId,
  instanceModify
}
