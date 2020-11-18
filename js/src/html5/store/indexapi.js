// c-nurse/nursing/getTemplateByCode
import axios from '@/util/http'
import { diction } from '@/store/common'
const url = diction.api + '/c-nurse/nursing'
var ajax = axios.create({
  baseURL: url,
  withCredentials: true
})

ajax.interceptors.response.use(function (response) {
  if (response.data.head && response.data.head.errCode !== 0) {
    return Promise.reject(response.data.head.errCode)
  }
  return response.data.data[0]
})

// 点击实例调用表单数据
function getById (recordId, userId) {
  return ajax.post(url + '/getNurseRecordById', {
    recordId,
    userId
  })
}
function getTemplateByCode (params) {
  return ajax.post(url + '/getTemplateByCode/', params).then(result => {
    result.schema.templateId = result.templateId
    result.schema.designerId = result.designerId
    return result.schema
  })
}

function createOrUpdate (formTemplateId, data, env) {
  let params = getFormParams(formTemplateId, data, env)
  return ajax.post(url + '/createNurseRecord', params)
}

function getFormParams (formTemplateId, data, env) {
  data = Object.assign({}, data, env)
  let params = {
    formTemplateId,
    data: data,
    userId: data.userId
  }
  if (data.id) {
    params.id = data.id
  }
  return params
}

export default {
  getTemplateByCode,
  createOrUpdate,
  getById
}
