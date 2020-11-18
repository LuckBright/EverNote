import {crm as axios} from './api'
import {diction} from '@/store/common'
const urlService = diction.api + '/phr-service/'

function getChartData (params) {
  return axios.post(urlService + 'doctor/childrenSignStandard/v2.0/getTypeAndSex', params)
}

export default{
  getChartData
}
