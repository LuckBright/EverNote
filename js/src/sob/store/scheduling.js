import { arrange } from './arrangeapi'
const url = 'timetrunk/'

// 查询规则列表信息
function getRuleConfigList (params) {
  return arrange.post('ruleConfig/getRuleConfigList', params).then((response) => {
    return response
  })
}

// 查询业务配置列表信息
function selectSysBusinessList (params) {
  return arrange.post('sysBusiness/selectSysBusinessList', params).then((response) => {
    return response
  })
}

// 保存科室
function saveArrangeDeptConfig (params) {
  return arrange.post('dept/saveArrangeDeptConfig', params).then((response) => {
    return response
  })
}

// 更新班次包含配置序列
function updateBpmTimeTrunkOrderNum (params) {
  return arrange.post(url + 'new/updateBpmTimeTrunkOrderNum', params).then((response) => {
    return response
  })
}

// 查询科室
function queryAll (params) {
  return arrange.post('dept/queryAll', params).then((response) => {
    return response
  })
}

// 弹窗根据模版id查询班次配置列表信息
function searchTimetrunkList (params) {
  return arrange.post(url + 'new/searchTimetrunkList', params).then((response) => {
    return response
  })
}

// 查看规则设置详情
function getRuleConfigDetail (params) {
  return arrange.post('ruleConfig/getRuleConfigDetail', params).then((response) => {
    return response
  })
}

// 规则设置更新详情
function updateRuleConfigByKey (params) {
  return arrange.post('ruleConfig/updateRuleConfigByKey', params).then((response) => {
    return response
  })
}

export default {
  getRuleConfigList,
  saveArrangeDeptConfig,
  updateBpmTimeTrunkOrderNum,
  selectSysBusinessList,
  queryAll,
  searchTimetrunkList,
  getRuleConfigDetail,
  updateRuleConfigByKey
}
