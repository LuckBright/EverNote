import { workspace as axios } from '@/workspace/store/api.js'

// 缓存
let cache = {}

// 保存到待提交区医嘱
function createDoctorAdvice (params) {
  return axios.post('/sob/doctorAdviceController/createDoctorAdvice', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}
// 更新编辑待提交区医嘱
function updateDoctorAdvice (params) {
  return axios.post('/sob/doctorAdviceController/updateDoctorAdviceForEdit', params).then(res => {
    return res.data
  }).catch(() => false)
}
// 批量查询service医嘱项，返回物资库房内容
function queryOrgServiceMutil (params) {
  if (!params.templateScene) {
    params.templateScene = params.scene
  }
  return axios.post('/sob/service/getTemplateBatch', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => false)
}
// 查询是否查库房
function searchCheckConfig (params) {
  return axios.post('/sob/consultController/getConfigInfoByApolloAgent', params).then(res => {
    return res.data
  }).catch(() => false)
}
// 获取开单模版及物资信息
function getTemplate (params) {
  if (!params.templateScene) {
    params.templateScene = params.scene
  }
  return axios.post('/sob/service/getTemplate', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}
// 获取代煎价格
function getDaijian (params) {
  // if (cache.DAIJIAN !== null && cache.DAIJIAN !== undefined) {
  //   return Promise.resolve(cache.DAIJIAN.toString())
  // }
  return axios.post('/sob/service/getServiceByCode', { code: params }).then(res => {
    if (res.data) {
      let price = res.data.price || 0
      cache.DAIJIAN = price.toString()
      return price.toString()
    }
    return false
  }).catch(() => {
    return false
  })
}
// 查询排斥医嘱（住院）
function getExcludeAdvices (params) {
  return axios.post('/sob/inpatientController/getExcludeAdviceListForInPatient', params).then(res => {
    if (res && res.data) {
      return res.data || []
    }
    return []
  }).catch(() => {
    return []
  })
}

// cdss中药版接口
function checkCdssRule (params) {
  return axios.post('/warehouse/cdssRule/checkCdssRule', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return []
  }).catch(() => {
    return []
  })
}

// 库存查询-根据场景，科室/病区等信息
function queryMultiServiceStock (params) { // 之前用的workspace/store/medicalapi，物资瘦身改接口名称了
  return axios.post('/warehouse/stock/getStockListForService/', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return []
  }).catch(() => {
    return []
  })
}

export default {
  createDoctorAdvice,
  updateDoctorAdvice,
  queryOrgServiceMutil,
  searchCheckConfig,
  getTemplate,
  getDaijian,
  getExcludeAdvices,
  checkCdssRule,
  queryMultiServiceStock
}
