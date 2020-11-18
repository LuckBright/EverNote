import axios from '@/util/http'
import { diction } from '@/store/common'
var api = axios.create({
  baseURL: diction.api,
  withCredentials: true
})
const url = '/medical-record/doctor/'

api.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data
})

function getConfig (id) {
  return api.post(url + 'systemConfigRelation/getAll', { scope: 1, type: 3 })
}

function queryTemplate (params) {
  return api.post(`/form-engine/FormTemplate/queryTemplate`, params)
}

function updateConfig (obj) {
  return api.post(url + 'systemConfigRelation/batchUpdate', obj)
}

function add (obj) {
  return api.post('/medical-record/doctor/systemConfigRelation/batchCreate', obj)
}

function getOneByCode () {
  return api.get(url + 'templateManage/getOneByCode', {
    params: {
      code: 'ti_wen_dan'
    }
  })
}

export default {
  getConfig,
  updateConfig,
  getOneByCode,
  queryTemplate,
  add
}
