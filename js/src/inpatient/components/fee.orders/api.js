import {workspace as axios} from '@/workspace/store/api.js'

// 保存到待提交区费用
function createAdviceFees (params) {
  return axios.post('/sob/adviceFeesController/createAdviceFees', params).then(res => {
    return res.data
  }).catch(() => false)
}
// 更新编辑待提交区医嘱
function updateAdviceFees (params) {
  return axios.post('/sob/adviceFeesController/updateAdviceFees', params).then(res => {
    return res.data
  }).catch(() => false)
}

// 查询已提交费用总价
function getFeesTotalPrice (params) {
  return axios.post('sob/adviceFeesController/getFeesTotalPrice', {...params, orderItemTypeList: [1, 11]}).then(res => {
    return res.data
  }).catch(() => false)
}

// 查询补费信息
function getAdviceFeesInfo (params) {
  return axios.post('/sob/adviceFeesController/getAdviceFeesInfo', params).then(res => {
    return res.data
  }).catch(() => false)
}
// 撤回取消补费
function cancelOrRefundSupplementFees (params) {
  return axios.post('/sob/adviceFeesController/cancelOrRefundSupplementFees', params).then(res => {
    return res.data
  }).catch(() => false)
}
// 提交
function submitSupplementFees (params) {
  return axios.post('/sob/adviceFeesController/submitSupplementFees', params).then(res => {
    if (res && res.errCode) {
      return false
    }
    return true
  }).catch(() => false)
}
// 批量查询费用项
function queryOrgFeeTemplate (params) {
  return axios.post('/sob/service/getTemplateBatch', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => false)
}
// 查询执行科室
function getExecuteProviderList (params) {
  // let type2CodeList = ['02.01', '02.02', '02.03', '02.04']
  // if (params.scene === 1) {
  //   type2CodeList.push('01.02', '01.03')
  // } else {
  //   type2CodeList.push('01.01')
  // }
  return axios.post('/sob/serviceProviderR/getExecuteProviderList', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}
// 查询执行机构
function getExecuteOrg (params) {
  return axios.post('/sob/service/getRelationOrgById', params).then(res => {
    return res.data
  }).catch(() => {
    return false
  })
}
// 住院基于医嘱补费
function createAdviceFeesForInpatient (params) {
  return axios.post('/sob/adviceFeesController/createAdviceFeesForInpatient', params).then(res => {
    if (res && res.errCode) {
      return false
    }
    return true
  }).catch(() => false)
}

// 住院基于医嘱的费用查询
function getAdviceFeesManageList (params) {
  return axios.post('/sob/adviceFeesController/getAdviceFeesManageList', params).then(res => {
    if (res && res.data) {
      return res.data || []
    }
    return []
  }).catch(() => {
    return []
  })
}

// 获取住院费用明细
function getHospitalFeeList (params) {
  return axios.post('/sob/adviceFeesController/getAdviceFeesDetailList', {
    ...params,
    orderItemTypeList: [1, 11]
  }).then(res => {
    if (res && res.data) {
      return {
        data: res.data && res.data.reverse() || [],
        totalCount: res.totalCount || 0
      }
    }
    return {
      data: [],
      totalCount: 0
    }
  }).catch(() => {
    return {
      data: [],
      totalCount: 0
    }
  })
}

// 获取住院患者是否可以补费
function getHospitalPatientStatus (params) {
  return axios.post('/sob/inpatientController/checkHospitalizedStatusForReturn', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => false)
}

// 获取患者在院信息
function getInpatientbyHosNumber (params) {
  return axios.post('/workbench/ipPatient/getInpatientbyHosNumber', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => false)
}

// 获取补费计费规则
function getChargeConfig (params) {
  params = Object.assign({}, params || {}, {
    categoryCode: 'CHARGE_PERMISSION',
    categoryItemCode: 'CHARGE_PERMISSION_RANGE'
  })
  return axios.post('/sob/chargeRule/getChargeConfig', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => {
    return false
  })
}

// 获取补费联动库存配置
function getIsOutStock () {
  return axios.post('/sob/chargeRule/getIsOutStock').then(res => {
    if (res && res.data) {
      return res.data
    }
    return '2' // 默认2不联动库存
  }).catch(() => '2')
}

// 欠费是否能补
function isCharge (params) {
  return axios.post('/sob/chargeRule/checkCanSupplementFeesByAdviceType', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => false)
}

// 查询单条费用可退费详情
function getOrderAndItemForRefund (params) {
  return axios.post('/sob/materialOrderController/getOrderAndItemForRefund', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => false)
}
export default {
  createAdviceFees,
  updateAdviceFees,
  getAdviceFeesInfo,
  cancelOrRefundSupplementFees,
  submitSupplementFees,
  queryOrgFeeTemplate,
  getExecuteProviderList,
  createAdviceFeesForInpatient,
  getAdviceFeesManageList,
  getHospitalFeeList,
  getHospitalPatientStatus,
  getInpatientbyHosNumber,
  getExecuteOrg,
  getChargeConfig,
  getIsOutStock,
  isCharge,
  getOrderAndItemForRefund,
  getFeesTotalPrice
}
