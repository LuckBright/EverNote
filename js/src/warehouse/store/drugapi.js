import { warehouse as axios } from './api'
const url = 'drug/'

function getById (params) {
  return axios.post('materialSku/getMaterialSkuList/', params).then(result => {
    return result
  })
}

function getInfoFromGlobalDrug (params) {
  return axios.post(url + 'getInfoFromGlobalDrug/', params).then(result => {
    if (result.drugCategoryId === 0) {
      result.drugCategoryId = ''
    }
    return result
  })
}

function createOrUpdate (drug) {
  var path = drug.id ? 'updateDrugList' : 'createDrug'
  if (drug.drugCategoryId === '') {
    drug.drugCategoryId = 0
  }
  return axios.post(url + path + '/', drug)
}

function updateGroup (clinic) {
  var path = 'updateDrug'
  return axios.post(url + path + '/', clinic)
}

function del (id) {
  return axios.post(url + 'updateDrug/', {
    id: id,
    isDelete: 1
  })
}

async function list (params) {
  return await axios.post(url + 'getDrugList/', params)
}

function localList (params) {
  return axios.post(url + 'getLocalDrugList/', params)
}

export default {
  getById,
  getInfoFromGlobalDrug,
  createOrUpdate,
  del,
  updateGroup,
  list,
  localList
}
