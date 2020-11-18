import {html5 as axios} from './api'
import { diction } from '@/store/common'
const url = diction.api + '/c-nurse/nursing'

// 点击实例调用表单数据
function getById (recordId, userId) {
  return axios.post(url + '/getNurseRecordById', {
    recordId,
    userId
  })
}

function getTemplateByCode (params) {
  return axios.post(url + '/getTemplateByCode/', params).then(result => {
    result.schema.templateId = result.templateId
    result.schema.designerId = result.designerId
    return result.schema
  })
}

function createOrUpdate (formTemplateId, data, env) {
  let params = getFormParams(formTemplateId, data, env)
  return axios.post(url + '/createNurseRecord', params)
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
function isPc () {
  const ua = navigator.userAgent
  const isWindowsPhone = /(?:Windows Phone)/.test(ua)
  const isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone
  const isAndroid = /(?:Android)/.test(ua)
  const isFireFox = /(?:Firefox)/.test(ua)
  const isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua))
  const isPhone = /(?:iPhone)/.test(ua) && !isTablet
  const isPc = !isPhone && !isAndroid && !isSymbian
  return isPc
}

export default {
  getTemplateByCode,
  createOrUpdate,
  getById,
  isPc
}
