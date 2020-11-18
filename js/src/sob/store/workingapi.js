import {sob as axios} from './api'
const url = 'executiveorderdefinition/'

function getById (id) {
  return axios.post(url + 'getExecuteOrderDefinitionByServiceId/', {
    id
  }).then(result => {
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateExecutiveOrderDefinition' : 'createExecutiveOrderDefinition'
  delete obj.id
  return axios.post(url + path + '/', obj)
}

function getOnce (id) {
  return axios.post(url + 'getExecuteOrderDefinitionById/', {
    id
  }).then(result => {
    return result.data
  })
}

function del (id) {
  return axios.post(url + 'updateService/', {
    id: id,
    isDelete: 1
  })
}

function list (params) {
  return axios.post(url + 'getServiceList/', {
    offset: 0,
    pageSize: 10
  }).then((response) => {
    return response.data
  }, (response) => {
    return response
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  getOnce
}
