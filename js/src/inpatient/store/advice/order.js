import {inpatient as axios} from '../sobapi'
const url = '/sob/'

function queryServiceOrder (params) {
  return axios.post(url + 'order/queryServiceOrder/', params)
}

function supplyOrder (params) {
  return axios.post(url + 'medicalOrder/supplyOrder', params)
}

function supplyOrderBatch (params) {
  return axios.post(url + 'medicalOrder/supplyOrderBatch', params)
}

export default {
  supplyOrderBatch,
  queryServiceOrder,
  orderRefund,
  supplyOrder
}
