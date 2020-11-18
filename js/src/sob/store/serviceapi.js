import {sob as axios} from './api'
import rcm from '../../rcm/store/api'
import {warehouse} from '@/warehouse/store/api'
const url = 'service/'

function list (params) {
  return axios.post(url + 'queryService/', params)
    .then((response) => {
      return response
    })
}

function listByCode (params) {
  return axios.post(url + 'getByCode/', params)
    .then((response) => {
      return response
    })
}

function cardlist (params) {
  return axios.post(url + 'queryService/', params)
    .then((response) => {
      return response
    })
}

function validation (params) {
  return axios.post(url + 'validation/', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function createOrUpdate (obj, flag) {
  var path = obj.id ? 'updateService' : flag ? 'createServicewithServWareContent' : 'createService'
  return axios.post(url + path + '/', obj)
}

function queryServiceProvider (params) {
  return axios.post('serviceprovider/queryServiceProvider', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}

function getMergeList () {
  return rcm.post('ar/insurStdItemMedical/getMergeList/', {
    insuranceOrgID: 2,
    pagesize: 10,
    offset: 1
  }).then((response) => {
    return response.data
  })
}

function getInsuranceList (params) {
  return rcm.post('ar/insuranceOrg/getListByNme/', {
    params: params
  }).then((response) => {
    return response.data
  })
}

function getConsumptiveMaterialList (params) {
  var postParam = {}
  if (params !== undefined || params !== '') {
    postParam = {
      name: params
    }
  }
  return warehouse.post('consumptiveMaterial/getConsumptiveMaterialList/', postParam)
    .then((response) => {
      return response
    })
}

function del (id) {
  return axios.post(url + 'deleteService/', {ids: [id]})
}

// 从warehous同步数据
function updateData (id) {
  return axios.post(url + 'synchronizeService/')
}
// warehouse调用
function queryServiceByLocalMaterialId (localMaterialId) {
  return axios.post(url + 'queryServiceByLocalMaterialId/', {localMaterialId}).then(response => {
    return response
  })
}
// 医嘱项停用
function updateValidStatus (params) {
  return axios.post(url + 'updateValidStatus/', params).then(res => {
    return res.data
  })
}
function exportService (params) {
  return axios.post('/service/exportService', {orgId: params}).then(res => {
    return res
  })
}

export default {
  exportService,
  list,
  cardlist,
  del,
  getMergeList,
  validation,
  getInsuranceList,
  createOrUpdate,
  getConsumptiveMaterialList,
  queryServiceProvider,
  queryServiceByLocalMaterialId,
  updateData,
  listByCode,
  updateValidStatus
}
