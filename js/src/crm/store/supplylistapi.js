import {crm as axios} from './api'
import {diction} from '@/store/common'
const urlService = diction.api + '/rcm/cashier/'

function list (params) {
  return axios.post(urlService + 'getDailyDetailsByPatientId/', params)
}

function listCommodity (params) {
  return axios.post(urlService + 'getGoodsDailyDetailsByPatientId/', params)
}

export default {
  list,
  listCommodity
}
