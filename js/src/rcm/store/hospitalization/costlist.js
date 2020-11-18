import axios from '@/insurance/store/api'

function getCostList (params) { //
  return axios.post('market/doctor/setMealTeam/downloadAllDetail', params)
}
function getList (params) {
  return axios.post('/rcm/ip/accountbill/getFeeDetailsReport', params)
}
export default {
  getCostList,
  getList
}
