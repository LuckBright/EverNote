import { warehouse as axios } from '../../../store/api'
const url = 'roomRecord/'

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateRoomRecord' : 'getSourceCreateRoomRecordForSY'
  return axios.post(url + path + '/', obj)
}

function deleteOrUpdate (params) {
  return axios.post(url + 'getSourceByRoomRecordUpdeteMaster/', params)
}

async function list (params) {
  return await axios.post(url + 'getRoomRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceByRoomRecordInfo/', { id }).then(result => {
    return result
  })
}

// 机构查询关联关系api
function listRelation (params) {
  return axios.post(url + 'getRoomRecordRelationList/', params).then(result => {
    return result
  })
}

// 删除单个房间
function modifyStatusDel (params) {
  return axios.post(url + 'updateRoomRecordMaster/', params).then(result => {
    return result
  })
}

// 删除单个关联关系
function modifyStatusRelationDel (params) {
  return axios.post(url + 'updateRoomRecordRelationMaster/', params).then(result => {
    return result
  })
}

export default {
  list,
  getById,
  createOrUpdate,
  deleteOrUpdate,
  listRelation,
  modifyStatusDel,
  modifyStatusRelationDel
}
