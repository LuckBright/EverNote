import {sob as axios} from './api'
import rcm from '../../rcm/store/api'
import {warehouse} from '@/warehouse/store/api'
const url = 'service/'

function getById (id) {
  return axios.post(url + 'getServiceInfo/', {
    id
  }).then(result => {
    result.data.serviceClassification = result.data.serviceClassification
    result.data.serviceType = '' + result.data.serviceType
    result.data.isValid = '' + result.data.isValid
    result.data.finType = '' + result.data.finType
    return result.data
  })
}

function createOrUpdate (obj, flag) {
  // if (obj.serviceClassification1.length) {
  //   obj.serviceClassification = obj.serviceClassification1.pop()
  // }
  // obj.isAdvice = obj.isAdvice ? 1 : 0
  var path = obj.id ? 'updateService' : flag ? 'createServicewithServWareContent' : 'createService'
  if (path === 'createServicewithServWareContent') {
    obj.isAdvice = obj.isAdvice ? 1 : 0
  }
  return axios.post(url + path + '/', obj)
}

function validation (params) {
  return axios.post(url + 'validation/', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function queryService (params) {
  return axios.post(url + 'queryService/', Object.assign({
    offset: 0,
    pageSize: 10
  }, params)).then((response) => {
    return response.data
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

/**
 * 通过物资分类获取schema
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function getServiceItems (params) {
  return axios.post('healthServiceTemplate/queryTemplateByServiceClassification', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

/**
 * 从集团导入医嘱项目
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function importTenantService (params) {
  return axios.post('service/importTenantService', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

/**
 * 同步上级机构的医嘱项
 * @param params
 * @returns {Promise.<TResult>|*}
 */
function createOrgServiceFromDirectParentOrg (params) {
  return axios.post('service/createOrgServiceFromDirectParentOrg', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

// 获取国家分类编码
function getNationTypeCodeList (params) {
  return axios.post('serviceNationalItem/getServiceNationalItems', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

function getUnitGroup (params) {
  return warehouse.post('unitGroup/getUnitGroupInfo/', params).then(response => {
    return response
  })
}

/**
 * 根据集团物资id查询可用剂量单位列表
 * @param params
 * params.globalMaterialId  String    是   集团物资id
 * @returns {Promise.<TResult>|*}
 */
function getDoseUnitList (params) {
  return axios.post('service/getDoseUnitList', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

/**
 * 获取核算科室options
 */
function getProvidersWithOut () {
  return axios.post('serviceprovider/getProvidersWithOut').then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

export default {
  getById,
  validation,
  getMergeList,
  queryService,
  getInsuranceList,
  createOrUpdate,
  getConsumptiveMaterialList,
  getServiceItems,
  importTenantService,
  createOrgServiceFromDirectParentOrg,
  getNationTypeCodeList,
  getUnitGroup,
  getDoseUnitList,
  getProvidersWithOut
}
