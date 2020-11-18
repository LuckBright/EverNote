/*
 * @Author: renpengfei
 * @Date: 2019-08-06 15:21:27
 * @LastEditors: renpengfei
 * @LastEditTime: 2019-08-15 15:13:44
 */
import axios from '@/insurance/store/api'
const url = '/insurance/insuranceOrg/'
const typeUrl = '/insurance/productType/'
var corpType = [
  {
    id: '0',
    name: '基本医疗保险'
  }, {
    id: '1',
    name: '商业医疗保险'
  }, {
    id: '2',
    name: '第三方机构'
  }
]

function getById (id) {
  return axios
    .post(url + 'get', {id: id})
    .then(result => {
      result.data.corpType = result
        .data
        .corpType
        .toString()
      result.data.country = result
        .data
        .country
        .toString()
      result.data.triggerMode = result.data.triggerMode && String(result.data.triggerMode)
//
      return result.data
    })
}

function createOrUpdate (obj) {
  var path = obj.id
    ? 'update'
    : 'create'
  return axios.post(url + path + '/', obj).then(result => {
    history.go(-1)
  })
}

function del (id) {
  return axios.post(url + 'delete/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios
    .post(url + 'getList1/', params)
    .then((response) => {
      return response
    })
}
function getInstitutionList (params) {
  return axios
    .post('/warehouse/clinic/getClinicList/', params)
    .then((response) => {
      return response
    })
}
function insuranceId (params) {
  return axios
    .post(url + 'get/', params)
    .then((response) => {
      return response
    })
}
function getStaffClinicList (params) {
  return axios
    .post('/warehouse/staffClinic/getStaffClinicList/', params)
    .then((response) => {
      return response
    })
}
// 保险类型创建
function create (params) {
  return axios
    .post(typeUrl + 'create', params)
    .then((response) => {
      return response
    })
}
// 保险类型创建
function deleteType (params) {
  return axios
    .post(typeUrl + 'delete', params)
    .then((response) => {
      return response
    })
}
// 保险类型创建
function update (params) {
  return axios
    .post(typeUrl + 'update', params)
    .then((response) => {
      return response
    })
}
// 保险类型创建
function getProductTypeList (params) {
  return axios
    .post(typeUrl + 'getProductTypeList', params)
    .then((response) => {
      return response
    })
}
// 获取用户角色列表
function getRoleList (params) {
  return axios.post('/thc-platform-core/sys/role/getRoleInfos', params)
    .then((response) => {
      return response
    })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  corpType,
  insuranceId,
  getInstitutionList,
  getStaffClinicList,
  create,
  deleteType,
  update,
  getProductTypeList,
  getRoleList
}
