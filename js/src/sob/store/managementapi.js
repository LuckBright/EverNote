import {sob} from './api'
const url = 'inpatientarea/'
const url1 = 'hospitalizedAreaNurseR/'

function getNurse (areaId) {
  return sob.post(url1 + 'getByAreaId/', {
    areaId
  }).then(result => {
    return result.data
  })
}
// 批量创建护士
function createNurse (params) {
  return sob.post(url1 + 'createBatch/', params)
}

// 删除一个病区的护士
function deleteNurse (id) {
  return sob.post(url1 + 'delete/', {
    id: id
  })
}

function createOrUpdate (struct) {
  let action = struct.id ? 'update' : 'create'
  let params = Object.assign({}, struct)
  params.providerId = params.dptIds
  delete params.struct
  return sob.post(url + action, params)
}

function list (params) {
  return sob.post(url + 'getlist', params).then((response) => {
    return response
  })
}
function del (id) {
  return sob.post(url + 'delete/', {
    id: id
  })
}
function getById (id) {
  return sob.post(url + 'get/', {
    id
  }).then(result => {
    return result.data
  })
}

export default {
  list,
  del,
  getById,
  createOrUpdate,
  getNurse,
  createNurse,
  deleteNurse
}
