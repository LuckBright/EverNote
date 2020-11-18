import { warehouse as axios } from '../../../store/api'
const url = 'buildingRecord/'

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateBuildingRecord' : 'getSourceCreateBuildingRecordForSY'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getBuildingRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceByBuildingRecordInfo/', { id }).then(result => {
    return result
  })
}

// 删除建筑
function modifyStatusDel (params) {
  return axios.post(url + 'updateBuildingRecordMaster/', params).then(result => {
    return result
  })
}

export default {
  list,
  createOrUpdate,
  getById,
  modifyStatusDel
}
