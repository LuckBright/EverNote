import { warehouse as axios } from '@/warehouse/store/api'
const url = '/recipeComment/'

function adviceList (params) {
  return axios.post(url + 'adviceList/', params)
}

function getByRecipeIdAndAdviceType (params) {
  return axios.post(url + 'getByRecipeIdAndAdviceType/', params)
}

function getByHospitalizedNumberAndAdviceType (params) {
  return axios.post(url + 'getByHospitalizedNumberAndAdviceType/', params)
}

function createdAndUpdate (params) {
  return axios.post(url + 'comment/', params)
}

function detail (params) {
  return axios.post(url + 'detail/', params)
}

function hospitalizedList (params) {
  return axios.post(url + 'hospitalizedList/', params)
}

function logs (params) {
  return axios.post(url + 'logs/', params)
}

// 操作记录
function getLogList (params) {
  return axios.post('/outpatientDispense/getUpdateOutpatientDispenseLogList/', params).then(result => {
    return result
  })
}
export default {
  adviceList,
  getByRecipeIdAndAdviceType,
  createdAndUpdate,
  detail,
  hospitalizedList,
  getByHospitalizedNumberAndAdviceType,
  logs,
  getLogList
}
