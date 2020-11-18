import { warehouse as axios } from '../../../store/api'
const url = 'spaceRecord/'

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateSpaceRecord' : 'getSourceCreateSpaceRecordForSY'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getSpaceRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceBySpaceRecordInfo/', { id }).then(result => {
    return result
  })
}

// 关联列表list
function listRelation (params) {
  return axios.post(url + 'getSpaceRecordRelationList/', params).then(result => {
    return result
  })
}

// 删除病区
function modifyStatusDel (params) {
  return axios.post(url + 'updateSpaceRecordMaster/', params).then(result => {
    return result
  })
}

// 取消关联病区
function modifyStatusRelation (params) {
  return axios.post(url + 'updateSpaceRecordRelationMaster/', params).then(result => {
    return result
  })
}

export default {
  list,
  createOrUpdate,
  getById,
  modifyStatusDel,
  modifyStatusRelation,
  listRelation
}
