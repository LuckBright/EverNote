import { inpatient as axios } from './sobapi'
import { arrange } from '@/sob/store/arrangeapi'
import { diction } from '@/store/common'
const url = '/sob/'

const url1 = diction.api + '/phr/'
const url2 = '/arrange/'
function list (params) {
  return axios.post(url + 'order/queryOrderRecord', params)
    .then(result => {
      return result
    })
}
// 根据订单id查询医嘱信息
function getRecipeById (id) {
  return axios.post(url + 'medicalOrder/getByOrderId', { orderId: id }).then((response) => {
    return response
  })
}

// 查询医嘱项目
function queryName (params) {
  return axios.post(url + 'service/queryName', params)
    .then(result => {
      return result
    })
}

// 退药查询信息 中药
function getChiDragByVisitSn (visitSn) {
  return axios.get(url1 + 'doctor/chiRecipeRecord/getByVisitSn', {
    params: {
      visitSn: visitSn
    }
  }).then(result => {
    return result
  })
}
// 查询西药
function getDealRecord (params) {
  return axios.get(url1 + 'doctor/recipeRecord/getByVisitSn', { params: params })
}

// 退药退号获取执行日志列表
function getLogList (params) {
  return axios.post(url + 'task/getLog', params)
    .then(result => {
      return result
    })
}

// 退药 退号
function returnOrder (params) {
  return axios.post(url + 'order/returnOrder', params)
    .then(result => {
      return result
    })
}

// 退号查询患者医生信息
function getAppointList (params) {
  return axios.post(url2 + 'appoint/getAppointByOrder', params)
    .then(result => {
      return result
    })
}
// 创建预约（治疗）
function createAppoint (params) {
  return axios.post(url2 + 'appoint/encounter', params)
    .then(result => {
      return result
    })
}
// 根据服务查询可预约医生列表
function getDoctorByServiceId (params) {
  return axios.post(url + 'providerdoctor/getDoctorByServiceId', params)
    .then(result => {
      return result
    })
}

// 根据服务查询可预约医生列表
function getArrangeByServiceId (params) {
  return axios.post(url + 'providerdoctor/getArrangeByServiceId', params)
    .then(result => {
      return result
    })
}

// 根据ID查询中药
function getChiDragById (id) {
  return axios.get(url1 + 'doctor/chiRecipeRecord/getById', {
    params: {
      id: id
    }
  }).then(result => {
    return result
  })
}

// 根据ID查询西药
function getDragById (id) {
  return axios.get(url1 + 'doctor/recipeRecord/getById', {
    params: {
      id: id
    }
  }).then(result => {
    return result
  })
}

// 取消退款检验检查
// function chargeBack (params) {
//   return axios.post(url + 'order/chargeback', params)
//   .then(result => {
//     return result
//   })
// }

// 退款（住院退款接口）
function chargeBack1 (params) {
  return axios.post(url + 'OrderController/hospitalizationReturnFee', params)
    .then(result => {
      return result
    })
}

function getArrange (params) {
  return arrange.post('arrange/getArrangeByServiceId', params).then((response) => {
    return response
  })
}

function queryService (params) {
  return axios.post('sob/service/queryService/', params).then((response) => {
    return response
  })
}

function searchForBrowser (params) {
  return axios.post('sob/service/searchForBrowser', params).then((response) => {
    return response
  })
}

export default {
  list,
  queryName,
  getChiDragByVisitSn,
  getLogList,
  returnOrder,
  getAppointList,
  diction,
  getDealRecord,
  createAppoint,
  getDoctorByServiceId,
  getArrangeByServiceId,
  getChiDragById,
  getDragById,
  getArrange,
  getRecipeById,
  chargeBack1,
  queryService,
  searchForBrowser
}

