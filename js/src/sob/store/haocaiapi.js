import {sob} from './api'
const url = 'servwarecontent/'

function relation (serviceId, items) {
  var path = 'createServWareContent'
  return sob.post(url + path + '/', {
    serviceId,
    wares: items
  })
}

function removeRelation (ids) {
  return sob.post(url + 'deleteServWareContent/', ids)
}

function list (serviceId) {
  return sob.post(url + 'getServWareContentByServiceId/', {
    serviceId
  }).then((response) => {
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
  unRelated
}

