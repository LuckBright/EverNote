import { warehouse as axios } from './api'
const url = 'localSetting/'

function getById (id) {
  return axios.post(url + 'getLocalSettingInfo/', {
    id
  }).then(result => {
    return result
  })
}

function getSearch (params) {
  return axios.post(url + 'getLocalSettingBySearch/', params).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateLocalSetting' : 'createLocalSetting'
  return axios.post(url + path + '/', obj)
}

function del (id) {
  return axios.post(url + 'updateLocalSetting/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getNewLocalSettingList/', params)
}

function getlist (params) {
  return axios.post(url + 'getAllLocalSettingList/', params)
    .then((response) => {
      return response
    })
}

function listfor (params) {
  return axios.post(url + 'getLocalSettingListForRcm/', params)
    .then((response) => {
      return response
    })
}
function updateState (params) {
  return axios.post(url + 'updateLocalSettingState/', params).then(result => {
    return result
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  list,
  getlist,
  getSearch,
  listfor,
  updateState
}
