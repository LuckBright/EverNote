// 机构房间
import { warehouse as axios } from '@/warehouse/store/api'
const url = 'roomRecord/'

// 列表添加关联关系
function createOrUpdate (params) {
  return axios.post(url + 'createRoomRecordRelation/', params).then(result => {
    return result
  })
}

// 获取房间列表关联
function list (params) {
  return axios.post(url + 'getRoomRecordForRelationList/', params)
}

// 获取房间列表关联
function listSingle (params) {
  return axios.post(url + 'getRoomRecordGroupBYFloor/', params).then(result => {
    return result
  })
}

export default {
  createOrUpdate,
  list,
  listSingle
}
