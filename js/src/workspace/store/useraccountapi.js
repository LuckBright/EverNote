import {workspace as axios} from './api'
// const url = '/phr/'
const url1 = '/market/'

// 会员卡信息
function getUserCard (id) {
  return axios.get(url1 + 'doctor/memberCard/getAllByPatientId', {
    params: {
      patientId: id
    }
  })
}

// 会员卡信息
function getRcmUserCard (id) {
  return axios.get(url1 + 'doctor/memberCard/getAllByPatientId', {
    params: {
      patientId: id
    }
  })
}

// 优惠券信息
function getGiftCard (id) {
  return axios.get(url1 + 'doctor/giftcard/getPageByPatientId', {
    params: {
      patientId: id
    }
  })
}
// rcm结算 优惠券信息
function getRcmGiftCard (id, dptrange) {
  return axios.get(url1 + 'doctor/giftcard/getNotUseByPatientId', {
    params: {
      patientId: id
    }
  })
}
// rcm结算 优惠券信息科室
function getNotUseByPatientIdAndDpt (id, dptrange) {
  return axios.get(url1 + 'doctor/giftcard/getNotUseByPatientIdAndDpt', {
    params: {
      patientId: id,
      dptrange: dptrange
    }
  })
}

// rcm结算 身份卡 会员权益
function getRcmBenefitCard (id) {
  return axios.get(url1 + 'doctor/patientBenefit/getByPatientId', {
    params: {
      patientId: id
    }
  })
}
// 新rcm结算 身份卡 会员权益
function newGetRcmBenefitCard (id) {
  return axios.post('/rcm/ar/benefit/getBenenfitCards', {
    patientId: id
  })
}

// rcm结算 绑定优惠券
function bind (params) {
  return axios.post(url1 + 'doctor/giftcard/bind', params)
}
// rcm结算 活动
function getAvailable (params) {
  return axios.get(url1 + 'doctor/activity/getAvailable')
}
// 根据科室获取活动
function getAvailableByDpt (params) {
  return axios.get(url1 + 'doctor/activity/getAvailableByDpt?dptrange=' + params)
}
export default {
  getUserCard,
  getGiftCard,
  getRcmGiftCard,
  getRcmUserCard,
  getRcmBenefitCard,
  bind,
  getAvailable,
  getAvailableByDpt,
  newGetRcmBenefitCard,
  getNotUseByPatientIdAndDpt
}
