import { warehouse as axios } from '../../../store/api'
const url = 'hospitalBedRelation/'

function createOrUpdate (obj) {
  var path = obj.id ? 'updateHospitalBedRelation' : 'createHospitalBedRelation'
  return axios.post(url + path + '/', obj)
}

async function list (params) {
  return await axios.post(url + 'getHospitalBedRelationList/', params)
}

function getById (id) {
  return axios.post(url + 'getHospitalBedRelationInfo/', { id }).then(result => {
    return result
  })
}

// 去重床号
function checkBedNum (params) {
  return axios.post(url + 'getHospitalBedRelationByBedNum/', params).then(result => {
    return result
  })
}

// 机构查询关联关系api
function listRelation (params) {
  return axios.post(url + 'getBedRelationList/', params).then(result => {
    return result
  })
}

function modifyStatusDel (params) {
  return axios.post(url + 'updateHospitalBedMaster/', params).then(result => {
    return result
  })
}

export default {
  list,
  getById,
  createOrUpdate,
  checkBedNum,
  listRelation,
  modifyStatusDel
}
