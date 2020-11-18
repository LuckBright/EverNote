import { warehouse as axios } from '@/warehouse/store/api'
const url = 'basesource/'

function getSourceById (id) {
  return axios.post('supplierLocal/getSupplierLocalProductList/', id).then(result => {
    return result
  })
}

function getSearch (params) {
  return axios.post(url + 'getLocalSettingBySearch/', params).then(result => {
    return result
  })
}

function createOrUpdate (obj) {
  return axios.post('supplierLocal/createSourceBySupplierLocalProduct/', obj).then(result => {
    return result
  })
}

function del (id) {
  return axios.post(url + 'updateLocalSetting/', {
    id: id,
    isDelete: 1
  })
}

// async function list (params) {
//   return await axios.post(url + 'getSourceByLocalSettingInfo/', params)
// }

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

function getById (id) {
  return axios.post('/basesourceLocalSetting/getSourceByLocalSettingInfo/', {
    id
  }).then(result => {
    return result
  })
}
export default {
  getById,
  createOrUpdate,
  del,
  // list,
  getlist,
  getSearch,
  listfor,
  updateState,
  getSourceById
}
