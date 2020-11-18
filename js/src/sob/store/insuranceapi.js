import {sob as axios} from './api'
import rcm from '../../rcm/store/api'
import {diction} from '@/store/common'
const url = 'chargingitemr/'
const rcmUrl = diction.api

function getById (serviceId) {
  return axios.post(url + 'getChargingitemRListByServiceId/', {
    serviceId
  }).then(result => {
    return result.data
  })
}

function createOrUpdate (obj) {
  var path = obj.id ? 'updateChargingitemR' : 'createChargingitemR'
  return axios.post(url + path + '/', obj)
}

function del (params) {
  return axios.post(url + 'deleteChargingitemR/', params)
}

function getMergeList (params) {
  return rcm.post(rcmUrl + '/insurance/insurStdItemMedical/getMergeList/', params).then((response) => {
    return response.data
  })
}

function listInsuranceOrg (params) {
  return axios.post(rcmUrl + '/insurance/insuranceOrg/getList1/', params).then((response) => {
    return response.data
  }, (response) => {
    console.log(response, '保险')
    return response.data
  })
}

function getInsuranceList (params) {
  return rcm.post('ar/insuranceOrg/getListByNme/', {
    params: params
  }).then((response) => {
    return response.data
  })
}

export default {
  getById,
  createOrUpdate,
  del,
  getMergeList,
  getInsuranceList,
  listInsuranceOrg
}
