import axios from '@/rcm/store/api'
import axioss from '@/insurance/store/api'
const url = '/cashier/selfFeeDiscounts/'

function loadDetail (params) {
  return axios.post(url + 'importItemClassification', params)
}

function del (id) {
  return axios.post(url + 'deleteSelfFeeDiscountsDetail', {
    selfFeeDiscountsDetailId: id
  })
}

function list (params) {
  return axios.post(url + 'getDiscounts', params).then((response) => {
    return response
  }, (response) => {
    return response
  })
}
function update (params) {
  return axios.post(url + 'saveDiscount', params)
}
function getSysTypeInfoList (params) {
  return axioss.post('warehouse/sysTypeInfo/getSysTypeInfoList/', params).then((response) => {
    return response
  })
}
function queryService (params) {
  return axioss.post('sob/service/queryService/', params).then((response) => {
    return response
  })
}
function queryServiceVariable (params) {
  return axioss.post('sob/service/queryServiceVariable/', params).then((response) => {
    return response
  })
}
export default {
  queryServiceVariable,
  getSysTypeInfoList,
  queryService,
  loadDetail,
  update,
  list,
  del
}
