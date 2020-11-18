import {sob} from './api'
const url = 'service/'

function relation (providerId, ids) {
  var path = 'relevanceProvider'
  return sob.post(url + path + '/', {
    providerId,
    serviceId: ids
  })
}

function removeRelation (providerId, ids) {
  return sob.post(url + 'cancelRelevance/', {
    providerId,
    serviceId: ids
  })
}

function list (providerId) {
  return sob.post(url + 'relevanceList/', {
    providerId
  }).then((response) => {
    return response
  })
}

// 排班中获取可是下的service（不含治疗的）
function list1 (providerId) {
  return sob.post(url + 'arrangeServiceList/', {
    providerId
  }).then((response) => {
    return response
  })
}

function listByQuery (params) {
  for (let key in params) {
    if (params[key] === '') {
      delete params[key]
    }
  }
  return sob.post(url + 'queryService/', Object.assign({
    offset: 0,
    pagesize: 100
  }, params)).then((response) => {
    return response
  })
}

function unRelated (params) {
  return sob.post(url + 'providerIsNull/', Object.assign({
    offset: 0,
    pagesize: 10
  }, params)).then((response) => {
    return response
  })
}

export default {
  relation,
  removeRelation,
  list,
  list1,
  unRelated,
  listByQuery
}

