import { warehouse as axios } from './api'
const url = 'storageRoom/'
const newUrl = 'process/'
const configUrl = 'clinic/'
function getById (id) {
  return axios.post(url + 'getStorageRoomInfo/', {
    id
  }).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateStorageRoom' : 'createStorageRoom'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateStorageRoom/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  if (params) {
    Object.assign(params)
  }
  return axios.post(url + 'getStorageRoomList/', params)
}

function clinicList (params) {
  return axios.post(url + 'getStorageRoomByClinic/', params).then((response) => {
    return response
  })
}

function getMaterialTypeListByStorageRoomId (params) {
  return axios.post(url + 'getMaterialTypeListByStorageRoomId/', params).then((response) => {
    return response
  })
}

/*
   新版库房创建 编辑 流程接口
*/
//  创建库房
function createStorageRoom (params) {
  return axios.post(newUrl + 'createStorageRoom/', params).then((response) => {
    return response
  })
}
// 获取库房详情
function getStorageRoomInfo (id) {
  return axios.post(newUrl + 'getStorageRoomList/', { id }).then((response) => {
    return response
  })
}
// 创建库房流程
function createProcess (params) {
  return axios.post(newUrl + 'createProcess/', params)
}
// 多库房统一发药  获取当前流程相匹配流程集合
function getSameProcessConfigurationId (params) {
  return axios.post(newUrl + 'getSameProcessConfigurationId/', params)
}
// 库房系统配置修改
function updateSystemSettingById (params) {
  return axios.post(configUrl + 'updateSystemSettingById/', params).then((response) => {
    return response
  })
}
// 库房系统配置获取
function selectSystemSettingByClinicId (params) {
  return axios.post(configUrl + 'selectSystemSettingByClinicId/', params).then((response) => {
    return response
  })
}
// 库房系统配置修改验证
function checkInOutStatus (params) {
  return axios.post(configUrl + 'checkInOutStatus/', params).then((response) => {
    return response
  })
}
// 库房系统配置修改验证
function outStockCheck (params) {
  return axios.post('outStock/getOutStockByOrgIdAndStatusAndType/', params).then((response) => {
    return response
  })
}
// 库房系统配置修改验证
function getTaskListResult (params) {
  return axios.post('task/getTaskListResult/', params).then((response) => {
    return response
  })
}

// 库房系统配置验证是否有未完成的任务
function checkOrder () {
  return axios.post(configUrl + 'checkOrder/')
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  clinicList,
  getMaterialTypeListByStorageRoomId,
  createStorageRoom,
  getStorageRoomInfo,
  createProcess,
  updateSystemSettingById,
  selectSystemSettingByClinicId,
  getSameProcessConfigurationId,
  checkInOutStatus,
  outStockCheck,
  getTaskListResult,
  checkOrder
}
