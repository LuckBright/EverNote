// 机构科室
import { warehouse as axios } from '../../../store/api'
const url = 'localSectionRecord/'

// create为机构关联集团科室，update为修改关联本地后机构科室
function createOrUpdate (obj) {
  var path = obj.id ? 'updateLocalSection' : 'createLocalSection'
  return axios.post(url + path + '/', obj)
}

function list (params) {
  return axios.post(url + 'getLocalSectionList/', params)
}
function getNewLocalSectionList (params) {
  return axios.post(url + 'getNewLocalSectionList/', params)
}
// 更新科室
function updateNewLocalSectionList (params) {
  return axios.post(url + 'updateNewLocalSectionList/', params)
}
function getById (id) {
  return axios.post(url + 'getLocalSectionInfo/', { id }).then(result => {
    return result
  })
}

function del (id) {
  return axios.post(url + 'getSourceBySectionRecordDelete/', { id }).then(result => {
    return result
  })
}

// 编辑机构科室档案
function updateRelation (obj) {
  return axios.post(url + 'updateLocalSectionRelation/', obj).then(result => {
    return result
  })
}

// 机构科室状态update
function updateSectionStatus (params) {
  return axios.post(url + 'updateLocalSectionMaster/', params).then(result => {
    return result
  })
}

// 机构病区关联科室列表
function sentenceSpaceList (params) {
  return axios.post(url + 'getLocalSectionForSupplyLocalSectionList/', params).then(result => {
    return result
  })
}

// 机构病区上级科室列表
function sentenceNoFatherList (params) {
  return axios.post(url + 'getLocalSectionNoFatherList/', params).then(result => {
    return result
  })
}

// 获取当前用户的科室
function getLocalSectionVoBySearch (params) {
  return axios.post('/localSectionRecord/getLocalSectionVoBySearch/', params).then(result => {
    return result
  })
}

export default {
  createOrUpdate,
  list,
  sentenceNoFatherList,
  sentenceSpaceList,
  getById,
  del,
  updateRelation,
  updateSectionStatus,
  getNewLocalSectionList,
  updateNewLocalSectionList,
  getLocalSectionVoBySearch
}
