import {sob as axios} from './api'
const url = 'serviceset/'

function getById (id) {
  return axios.post(url + 'queryServiceSetById/', {
    serviceSetId: id
  }).then(result => {
    if (result && result.data) result.data.isValid = '' + result.data.isValid
    return result.data
  })
}

function createOrUpdate (obj) {
  // if (obj.serviceSetClassification1.length) {
  //   obj.serviceSetClassification = obj.serviceSetClassification1.pop()
  // }
  var path = obj.id ? 'updateServiceSet' : 'createServiceSet'
  obj.price = obj.price ? obj.price : 0
  obj.isAdvice = obj.isAdvice ? 1 : 0
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'deleteServiceSet/', {ids: [id]})
}

function updateServSetItem (params) {
  return axios.post(url + 'updateServSetItemQuantity/', params).then((response) => {
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

function delItem (params) {
  return axios.post(url + 'deleteServiceSetItem/', params)
}

function createServiceSetItem (params) {
  return axios.post(url + 'createServiceSetItem/', params).then((response) => {
    return response
  })
}

function list (params) {
  return axios.post(url + 'queryServiceSet/', params)
    .then((response) => {
      return response
    })
}

function getServiceSetItemList (params) {
  return axios.post(url + 'queryServSetItemList/', params).then((response) => {
    return response.data
  }, (response) => {
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

function importTenantServiceSet (params) {
  return axios.post('serviceset/importTenantServiceSet', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

// 同步组套数据
function syncServiceSet (params) {
  return axios.post('serviceset/syncServiceSet', params).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

// 组套停用
function updateValidStatus (params) {
  return axios.post('serviceset/updateValidStatus', params).then(response => {
    return response.data
  }, (response) => {
    return response
  })
}
function exportService (params) {
  return axios.post('/serviceset/exportServiceSet', {orgId: params}).then(res => {
    return res
  })
}

export default {
  exportService,
  getById,
  createOrUpdate,
  del,
  list,
  delItem,
  validation,
  updateServSetItem,
  createServiceSetItem,
  getServiceSetItemList,
  getServiceItems,
  importTenantServiceSet,
  syncServiceSet,
  updateValidStatus
}
