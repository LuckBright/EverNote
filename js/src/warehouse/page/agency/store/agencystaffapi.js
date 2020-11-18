// 机构人员
import { warehouse as axios } from '@/warehouse/store/api'
import axiosCustom from '@/insurance/store/api'
const urlRank = 'staffRank/'
const urlClinic = 'staffClinic/'
const urlClinicWork = 'staffClinicWork/'
const url = 'staffRecord/'
const urlSetting = 'staffSetting/'
// 修改账号密码
function updateAccoutPassword (params) {
  return axiosCustom.post('/permission/user/updateUserInfoMsg/', params).then(result => {
    return result
  })
}

// 账号重复校验
function validation (params) {
  return axiosCustom.post('/permission/user/checkUserInfoLoginNameExist/', params).then(result => {
    return result
  })
}

function listRank (staffId) {
  return axios.post(urlRank + 'getStaffRankList/', { staffId }).then(result => {
    return result
  })
}

// 添加人员证书信息
function createOrUpdateStaffRank (obj) {
  let path = obj.id ? 'updateStaffRank' : 'createStaffRank'
  return axios.post(urlRank + path + '/', obj)
    .then((response) => {
      return response
    })
}

function staffClinicList (userId) {
  return axios.post(urlClinic + 'getStaffClinicList/', {
    userId
  })
    .then((response) => {
      return response
    })
}

function updateStaffClinic (params) {
  return axios.post(urlClinic + 'updateStaffClinic/', params)
    .then((response) => {
      return response
    })
}

function staffClinicWorkList (userId) {
  return axios.post(urlClinicWork + 'getStaffClinicWorkList/', {
    userId
  })
    .then((response) => {
      return response
    })
}

function updateStaffWrokClinic (params) {
  return axios.post(urlClinicWork + 'updateStaffClinicWork/', params)
    .then((response) => {
      return response
    })
}

// 列表添加关联关系
function createOrUpdate (params) {
  return axios.post(url + 'createStaffRecordRelation/', params).then(result => {
    return result
  })
}

// 获取房间列表关联
function list (params) {
  return axios.post(url + 'getStaffRecordForRelationList/', params)
}

function getStaffLocalSectionList (params) {
  return axios.post('/staff/getStaffLocalSectionList/', params)
}
// 保存处方权，手术权信息
function saveStaffSetting (params) {
  return axios.post(urlSetting + 'saveStaffSetting/', params)
}

// 获取处方权，手术权信息
function getStaffSettingInfoByStaffId (params) {
  return axios.post(urlSetting + 'getStaffSettingInfoByStaffId/', params)
}

export default {
  listRank,
  createOrUpdateStaffRank,
  staffClinicList,
  updateStaffClinic,
  createOrUpdate,
  list,
  saveStaffSetting,
  getStaffSettingInfoByStaffId,
  staffClinicWorkList,
  updateStaffWrokClinic,
  updateAccoutPassword,
  getStaffLocalSectionList,
  validation
}
