import {sob} from './api'
import {diction} from '@/store/common'
const url = 'serviceprovider/'
const baseurl = diction.api

function getById (id) {
  return sob.post(url + 'getServiceProviderInfo/', {
    id
  }).then(result => {
    result.data.zdrugstore = result.data.zdrugstore || {}
    result.data.wDrug = result.data.wdrugstore || {}
    result.data.zDrug = result.data.zdrugstore && result.data.zdrugstore.drugstoreCode
    result.data.wDrug = result.data.wdrugstore && result.data.wdrugstore.drugstoreCode
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateServiceProvider' : 'createServiceProvider'
  return sob.post(url + path + '/', obj)
}

function del (id) {
  return sob.post(url + 'deleteServiceProvider/', {'id': [id]})
}

function list (params) {
  return sob.post(url + 'queryServiceProvider/', params).then((response) => {
    return response
  })
}
function queryProvider (params) {
  return sob.post(url + 'queryProviderNoPage/', params).then((response) => {
    return response.data
  })
}
function queryDoctorByProvider (params) {
  return sob.post('providerdoctor/getDoctorByProviderId/', params).then((response) => {
    return response.data
  })
}
function listOptions (params) {
  return sob.post(url + 'getServiceProviderList/').then((response) => {
    return response.data
  })
}
// providerlist组件更换warehouse接口
function getDepartments (params) {
  return sob.post(baseurl + '/warehouse/localSectionRecord/getLocalSectionVoListForService/')
}
function getService (ids) {
  return sob.post(url + 'queryProviderNoPage/', ids)
}
export default {
  getById,
  createOrUpdate,
  del,
  list,
  listOptions,
  queryProvider,
  queryDoctorByProvider,
  getService,
  getDepartments
}
