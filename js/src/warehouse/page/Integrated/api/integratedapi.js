import { warehouse as axios } from '@/warehouse/store/api'
const url = 'supplierLocal/'
const purchUrl = 'purchaseSummary/'

// 证照预警
function list () {
  return axios.post(url + 'getSupplierLocalForWarning/')
}

// 今日工作统计
function getWorkStatistics () {
  return axios.post(purchUrl + 'getWorkStatistics/')
}

export default {
  list,
  getWorkStatistics
}
