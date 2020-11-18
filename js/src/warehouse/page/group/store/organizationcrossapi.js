// 集团架构api
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'outsideSupplyRelation/'

// 获取跨机构供应列表
function getAllRelationListOfRoom () {
  return axios.post(url + 'getAllRelationListOfRoom/')
    .then((response) => {
      return response
    })
}

// 获取跨机构供应详情
function getRelationListByRoomId (storageRoomId) {
  return axios.post(url + 'getRelationListByRoomId/', {storageRoomId})
    .then((response) => {
      return response
    })
}

// 查询机构关联的库房
function getClinicAndStorageRoomList () {
  return axios.post(url + 'getClinicAndStorageRoomList/')
    .then((response) => {
      return response
    })
}

// 查询机构
function getAllClinicList () {
  return axios.post(url + 'getAllClinicList/')
    .then((response) => {
      return response
    })
}

// 创建父节点
function createParentOutsideSupplyRelation (storageRoomId) {
  return axios.post(url + 'createParentOutsideSupplyRelation/', {storageRoomId})
    .then((response) => {
      return response
    })
}

// 删除父节点
function deleteOfStorageRoom (storageRoomId) {
  return axios.post(url + 'deleteOfStorageRoom/', {storageRoomId})
    .then((response) => {
      return response
    })
}

// 创建子节点
function updateOutsideSupplyRelation (params) {
  return axios.post(url + 'updateOutsideSupplyRelation/', params)
    .then((response) => {
      return response
    })
}

// 库房权重列表
function getAllRelationListOfClinic () {
  return axios.post(url + 'getAllRelationListOfClinic/')
    .then((response) => {
      return response
    })
}

// 库房权重详情
function getRelationListByClinicId (clinicId) {
  return axios.post(url + 'getRelationListByClinicId/', {clinicId})
    .then((response) => {
      return response
    })
}

// 分配权重
function updateWeight (params) {
  return axios.post(url + 'updateWeight/', params)
    .then((response) => {
      return response
    })
}

export default {
  getAllRelationListOfRoom,
  getRelationListByRoomId,
  getClinicAndStorageRoomList,
  getAllClinicList,
  createParentOutsideSupplyRelation,
  deleteOfStorageRoom,
  updateOutsideSupplyRelation,
  getAllRelationListOfClinic,
  getRelationListByClinicId,
  updateWeight
}
