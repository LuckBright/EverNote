import {sob} from './api'
const url = 'serviceProviderR/'

function getServicefee (params) {
  return sob.post(url + 'getServiceProviderRListByServiceId/', params)
}

function createServicefee (serviceId, items) {
  return sob.post(url + 'createServiceProviderRBatch/', {
    serviceId,
    serviceProviderRList: items
  })
}

function deleteService (ids) {
  return sob.post(url + 'deleteServiceProviderR/', {
    id: ids
  })
}

function queryProviderList (params) {
  return sob.post('serviceProviderR/queryProviderList/', params)
}

// function queryProviderListNew (params) {
//   return sob.post('serviceProviderR/queryProviderListNew/', params)
// }

function createServiceProviderRBatch (params) {
  return sob.post('serviceProviderR/createServiceProviderRBatch/', params)
}

// 未关联科室查询
function getProviderNot (params) {
  return sob.post('serviceProviderR/getProviderRelationNotRelation', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return []
  }).catch(() => [])
}

// 更新科室顺序
function updateProviderSort (params) {
  return sob.post('serviceProviderR/updateServiceProviderRBatch', params).then(res => {
    return true
  }).catch(() => false)
}

export default {
  getServicefee,
  createServicefee,
  deleteService,
  queryProviderList,
  // queryProviderListNew,
  createServiceProviderRBatch,
  getProviderNot,
  updateProviderSort
}
