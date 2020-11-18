// import { web as axios } from './api'
import storage from '@/util/storage'
import { getInstance } from '@/titancare/api/api'
const axios = getInstance()

axios.interceptors.request.use(config => {
  const TICKET = storage.getStorageByClinic('x-ticket-code')
  if (!config.data) {
    config.data = {}
  }
  if (TICKET) {
    config.headers['x-ticket-code'] = TICKET
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

const url = '/titan-doctor/sobApi/'

// 添加处方
function createDoctorAdvice (params) {
  return axios.post(url + 'createDoctorAdvice', params).then(res => {
    return res.data
  }).catch(() => false)
}

// 提交处方
function submitRecipe (params) {
  return axios.post(url + 'v1.1/submitRecipe', params).then(res => {
    return res.data
  }).catch(() => false)
}

// 获取草稿的医嘱
function getRecipeAvailableByVisitNumber (params) {
  return axios.post(url + 'v2.0/recipe/getRecipeAvailableByVisitNumber', params).then(res => {
    if (res.data) {
      return res.data || []
    }
    return []
  }).catch(() => [])
}

// 获取提交的处方
function getDoctorAdviceInfo (params) {
  return axios.post(url + 'getDoctorAdviceInfo', params).then(res => {
    if (res.data) {
      return res.data || []
    }
    return []
  }).catch(() => [])
}
function checkPatientStatus(visitNumber) {
  return axios.get(`/titan-doctor/counsel/checkCounselStatus?visitNumber=${visitNumber}`).then(res => {
    if (res.data) {
      return res.data || []
    }
    return []
  })
}

// 撤回处方
function removeByAdviceIds (params) {
  return axios.post('/titan-cms/recipeOrder/v4.1/removeByRecipeIds', params).then(res => {
    return res.data
  }).catch(() => false)
}

export default {
  createDoctorAdvice,
  submitRecipe,
  getDoctorAdviceInfo,
  getRecipeAvailableByVisitNumber,
  checkPatientStatus,
  removeByAdviceIds
}
