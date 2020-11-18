import {crm as axios} from './api'
import {diction} from '@/store/common'
const urlService = diction.api + '/market/doctor/'

function list (params) {
  return axios.post(urlService + 'setmealOrder/searchByPatient', params)
}

export default {
  list
}
