import { warehouse as axios } from '../../../store/api'
const url = 'staffRecord/'
const urlSection = 'localSectionRecord/'
const urlStaffClinicWork = 'staffClinicWork/'

function getSectionList (params) {
  return axios.post(urlSection + 'getLocalSectionVoListForService/', params)
}

function relationlist (staffId) {
  return axios.post(urlStaffClinicWork + 'getStaffClinicWorkAndLocalSectionList/', { staffId })
}

function deleteLocalSection (params) {
  return axios.post(urlStaffClinicWork + 'deleteStaffClinicWorkAndLocalSection/', params)
}

function createOrUpdateSection (obj) {
  var path = obj.id ? 'updateStaffClinicWorkAndLocalSection' : 'createStaffClinicWorkAndLocalSection'
  return axios.post(urlStaffClinicWork + path + '/', obj)
}

function createOrUpdate (obj) {
  var path = obj.id ? 'getSourceByUpdateStaffRecord' : 'getSourceCreateStaffRecordForSY'
  return axios.post(url + path + '/', obj)
}

function updeteStatue (params) {
  return axios.post(url + 'getSourceByStaffRecordUpdeteMaster/', params)
}

async function list (params) {
  return await axios.post(url + 'getStaffRecordList/', params)
}

function getById (id) {
  return axios.post(url + 'getSourceByStaffRecordInfo/', { id }).then(result => {
    return result
  })
}

// 机构查询关联关系api
function listRelation (params) {
  return axios.post(url + 'getStaffRecordRelationList/', params).then(result => {
    return result
  })
}

// 取消关联
function modifyStatusRelation (params) {
  return axios.post(url + 'updateStaffRecordRelationMaster/', params).then(result => {
    return result
  })
}
// 获取手术级别
function getSourceByPropertyInfo (code) {
  let path = '/basesource/getSourceByPropertyInfo/'
  return axios.post(path, {code: code}).then(result => {
    if (Array.isArray(result)) {
      let arr = []
      result.forEach(item => {
        arr.push(item.propertyValueObject)
      })
      return arr
    }
  })
}
export default {
  list,
  createOrUpdate,
  createOrUpdateSection,
  getById,
  updeteStatue,
  listRelation,
  modifyStatusRelation,
  getSectionList,
  relationlist,
  getSourceByPropertyInfo,
  deleteLocalSection
}
