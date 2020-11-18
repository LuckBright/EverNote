import {workspace as axios} from '../../workspace/store/api'
const url1 = '/market/'

// 优惠券详情
function getById (params) {
  return axios.get(url1 + 'doctor/giftcard/getById', {params: params})
    .then((response) => {
      return response
    })
}

// 会员卡信息
function getRcmUserCard (params) {
  return axios.get(url1 + 'doctor/memberCard/getByIdAndPatientId', {params: params})
    .then((response) => {
      return response
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
function getRcmGiftCard (id) {
  return axios.get(url1 + 'doctor/giftcard/getNotUseByPatientId', {
    params: {
      patientId: id
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

// rcm结算 绑定优惠券
function bind (params) {
  return axios.post(url1 + 'doctor/giftcard/bind', params)
}

function getcardStatement (params) {
  return axios.get(url1 + 'doctor/memberCardStatement/getPageByCardId', {params: params})
    .then((response) => {
      response.totalCount = response.data.totalCount
      return response
    })
}

export default {
  getById,
  getGiftCard,
  getRcmGiftCard,
  getRcmUserCard,
  getRcmBenefitCard,
  getcardStatement,
  bind
}
