import { workspace as axios } from '@/workspace/store/api'

// 获取计费规则列表
function getFeeRule (params) {
  return axios.post('/sob/feeStrategy/query/', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return []
  }).catch(() => {
    return []
  })
}

// 获取集团计费规则列表
function getManagesFeeRule (params) {
  return axios.post('/sob/feeStrategy/getDefault', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => {
    return false
  })
}

// 获取计费规则明细
function getFeeRuleDetailById (params) {
  return axios.post('/sob/feeStrategy/getById', params).then(res => {
    if (res && res.data) {
      return res.data
    }
    return false
  }).catch(() => {
    return false
  })
}

// 创建计费规则
/**
 * tenantId orgId timeRuleCode taskTime isValid
 */
function createFeeRule (params) {
  return axios.post('/sob/feeStrategy/create', params).then(res => {
    if (res && res.head && res.head.errCode) {
      return false
    }
    return true
  }).catch(() => {
    return false
  })
}

// 更新计费规则
/**
 * id tenantId orgId timeRuleCode taskTime isValid
 */
function updateFeeRule (params) {
  return axios.post('/sob/feeStrategy/update', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return true
  }).catch(() => {
    return false
  })
}

// 删除机构计费规则
function delFeeRule (params) {
  return axios.post('/sob/feeStrategy/delete', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return true
  }).catch(() => {
    return false
  })
}

// 查询补费是否联动库存
function getIsOutStock (params) {
  return axios.post('/sob/chargeRule/getIsOutStock', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

// 更新补费否联动库存配置
function updateIsOutStock (params) {
  return axios.post('/sob/chargeRule/updateIsOutStock', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

// 计费规则权限查询
function getChargeRulePermission (params) {
  return axios.post('/sob/chargeRule/getChargeRulePermission', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

// 计费规则权限编辑（集团）
function updateDefaultChargeRulePermission (params) {
  return axios.post('/sob/chargeRule/updateDefaultChargeRulePermission', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

// 计费规则权限编辑（机构）
function updateChargeRulePermission (params) {
  return axios.post('/sob/chargeRule/updateChargeRulePermission', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

// 获取工作站场景
function getDefaultChargeRulePermission (params) {
  return axios.post('/sob/chargeRule/getDefaultChargeRulePermission', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

// 删除工作站场景
function deleteChargeRulePermission (params) {
  return axios.post('/sob/chargeRule/deleteChargeRulePermission', params).then(res => {
    if (res && res.head && res.head.errode) {
      return false
    }
    return res
  }).catch(() => {
    return false
  })
}

export default {
  getFeeRule,
  getFeeRuleDetailById,
  createFeeRule,
  updateFeeRule,
  delFeeRule,
  getManagesFeeRule,
  getIsOutStock,
  updateIsOutStock,
  getChargeRulePermission,
  updateChargeRulePermission,
  deleteChargeRulePermission,
  getDefaultChargeRulePermission,
  updateDefaultChargeRulePermission
}
