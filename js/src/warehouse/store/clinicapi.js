import { warehouse as axios } from './api'
import { diction } from '@/store/common'
const url = 'clinic/'

function getById (id) {
  return axios.post(url + 'getClinicInfo/', {
    id
  }).then(result => {
    result.category = []
    result.category.push(result.provinceCode)
    result.category.push(result.cityCode)
    result.category.push(result.areaCode)
    return result
  })
}

function createOrUpdate (clinic) {
  var path = clinic.id ? 'updateClinic' : 'createClinic'
  return axios.post(url + path + '/', clinic)
}

function del (id) {
  return axios.post(url + 'updateClinic/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getClinicList/', params)
    .then((response) => {
      if (response.length === 0) {
        return []
      } else {
        return response
      }
    })
}

function create (clinic) {
  axios.post(url + 'createClinic/', clinic)
}

function validation (params) {
  return axios.post(url + 'getClinicOnly/', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

// 获取机构树状结构接口
function getClinicTree (params) {
  return axios.post('/architecture/getTreeNodesByClinicId/', params)
}
// 获取机构和机构的子机构并且打平数据的接口
function getClinicListAndChild (params) {
  return axios.post('/clinic/getClinicAndNodesList/', params)
}

// 机构和科室树
function queryGroupClinics (params) {
  return axios.post(diction.api + '/arrange/dept/queryGroupClinics/', params)
}

export default {
  create,
  getById,
  createOrUpdate,
  del,
  validation,
  list,
  getClinicTree,
  getClinicListAndChild,
  queryGroupClinics
}
