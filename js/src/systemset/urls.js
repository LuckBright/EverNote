import { prefix as commonPrefix } from '@/util/urls'
const prefix = {
  ...commonPrefix,
  extend: 'platform-extend/',
  templateManage: 'medical-record/doctor/',
  processEngine: 'process-engine/',
  thcPhr: 'thc-phr/',
  thcData: 'thc-data/',
  formEngine: 'form-engine/',
  medicalBasicInfo: 'rcm/medicalBasicInfo/'
}

export default {
  // 数据元
  dataSet: {
    getDataSets: { url: 'dataSet/getDataSets', isStatic: false, prefix: prefix.core },
    getDataSetListInfo: { url: 'dataSet/getDataSetListInfo', isStatic: false, prefix: prefix.core },
  },
  sequenceRule: {
    getSequenceRule: { url: 'sequenceRule/getSequenceRule', prefix: prefix.core },
    getSequenceRules: { url: 'sequenceRule/getSequenceRules', prefix: prefix.core },
    deleteSequenceRule: { url: 'sequenceRule/deleteSequenceRule', prefix: prefix.core },
    updateSequenceRule: { url: 'sequenceRule/updateSequenceRule', prefix: prefix.core },
    createSequenceRule: { url: 'sequenceRule/createSequenceRule', prefix: prefix.core },
    exportSequenceRule: { url: 'sequenceRule/exportSequenceRule', prefix: prefix.core },
  },
  sys: {
    exportRole: { url: 'sys/role/exportRole', isStatic: false, prefix: prefix.core }, // 导出用户角色
    getRoleInfos: { url: 'sys/role/getRoleInfos', isStatic: false, prefix: prefix.core }, // 获取用户角色列表
    exportMenu: { url: 'sys/menu/exportMenu', prefix: prefix.core }, // 导出菜单sql
    getResources: { url: 'sys/menu/getResources', isStatic: false, prefix: prefix.core }, // 导出用户角色
    getmq: { url: 'sys/menu/getmq', isStatic: false, prefix: prefix.core }, // 导出mq事件
  },
  rules: {
    search: { url: 'rule/rule/search', prefix: prefix.extend },
    delete: { url: 'rule/rule/delete', prefix: prefix.extend },
    modify: { url: 'rule/rule/modify', prefix: prefix.extend },
    create: { url: 'rule/rule/create', prefix: prefix.extend },
    getById: { url: 'rule/rule/getById', prefix: prefix.extend },
    apply: { url: 'rule/rule/apply', prefix: prefix.extend },
  },
  rulesTemplate: {
    search: { url: 'rule/ruleTemplate/search', prefix: prefix.extend },
    delete: { url: 'rule/ruleTemplate/delete', prefix: prefix.extend },
    modify: { url: 'rule/ruleTemplate/modify', prefix: prefix.extend },
    create: { url: 'rule/ruleTemplate/create', prefix: prefix.extend },
    getById: { url: 'rule/ruleTemplate/getById', prefix: prefix.extend },
  },
  // 报表相关
  report: {
    search: { url: 'reportnew/search', prefix: prefix.extend },
    create: { url: 'reportnew/create', prefix: prefix.extend },
    modify: { url: 'reportnew/modify', prefix: prefix.extend },
    getById: { url: 'reportnew/getById', prefix: prefix.extend },
    delete: { url: 'reportnew/delete', prefix: prefix.extend },
    getByHisReportCode: { url: 'reportnew/getByHisReportCode', prefix: prefix.extend },
    updateVersion: { url: 'reportnew/updateVersion', prefix: prefix.extend },
    download: { url: 'reportnew/download', prefix: prefix.extend },
    getOverallarea: { url: 'getOverallarea', prefix: prefix.medicalBasicInfo },
    getTreattype: { url: 'getTreattype', prefix: prefix.medicalBasicInfo }
  },

  // 流程相关
  process: {
    getProcesses: { url: 'admin/getProcesses', prefix: prefix.processEngine },
    getProcessById: { url: 'admin/getProcessById', prefix: prefix.processEngine },
    update: { url: 'admin/update', prefix: prefix.processEngine },
    revoke: { url: 'ext/model/revoke', prefix: prefix.processEngine },
    publish: { url: 'ext/model/publish', prefix: prefix.processEngine },
    delete: { url: 'ext/model/delete', prefix: prefix.processEngine },
    insert: { url: 'admin/insert', prefix: prefix.processEngine },
    getUseInstanceImg: { url: 'ext/process/getUseInstanceImg', prefix: prefix.processEngine },
    getToDoTask: { url: 'ext/process/getToDoTask', prefix: prefix.processEngine },
    getToHisDoTask: { url: 'ext/process/getHisProcessInstance', prefix: prefix.processEngine },
    getInstanceInfoById: { url: 'ext/process/getInstanceInfoById', prefix: prefix.processEngine },
    getInstanceImgResource: { url: 'ext/process/getInstanceImgResource', prefix: prefix.processEngine },
    completeTask: { url: 'ext/process/completeTask', prefix: prefix.processEngine },
    getInstanceInfoByBusinessCode: { url: 'ext/process/getInstanceInfoByBusinessCode', prefix: prefix.processEngine },
    nextFlowNode: { url: 'ext/process/nextFlowNode', prefix: prefix.processEngine },
    getVarByProcessInstanceId: { url: 'ext/process/getVarByProcessInstanceId', prefix: prefix.processEngine },
    delegate: { url: 'ext/process/delegate', prefix: prefix.processEngine },
    deleteProcessByBusinessCode: { url: 'ext/process/deleteProcessByBusinessCode', prefix: prefix.processEngine },
  },
  // 意见反馈
  systemFeedback: {
    create: { url: 'systemFeedback/create', prefix: prefix.extend },
  },
  // 帮助中心（旧版本451废弃）
  helpCenter: {
    getHelpCenter: { url: 'helpCenter/getHelpCenter', prefix: prefix.extend },
    createHelpCenter: { url: 'helpCenter/createHelpCenter', prefix: prefix.extend },
    updateHelpCenter: { url: 'helpCenter/updateHelpCenter', prefix: prefix.extend },
    deleteHelpCenter: { url: 'helpCenter/deleteHelpCenter', prefix: prefix.extend },
    getHelpCenters: { url: 'helpCenter/getHelpCenters', prefix: prefix.extend },
  },
  // 数据交换
  dataswitch: {
    list: { url: 'dataSwitchingJob/pageList', prefix: prefix.thcPhr },
    edit: { url: 'dataSwitchingJob/update', prefix: prefix.thcPhr },
    delete: { url: 'dataSwitchingJob/delete', prefix: prefix.thcPhr },
    add: { url: 'dataSwitchingJob/insert', prefix: prefix.thcPhr },
    excute: { url: 'dataSwitchingJob/execute', prefix: prefix.thcData }
  },
  // 接口权限
  sysInterface: {
    getSysInterfaceAndMenus: { url: 'sysInterface/getSysInterfaceAndMenus', isStatic: false, prefix: prefix.core }, // 以接口维度查询列表
    deleteSysInterface: { url: 'sysInterface/deleteSysInterface', isStatic: false, prefix: prefix.core }, // 以接口维度删除
    getSysInterface: { url: 'sysInterface/getSysInterface', isStatic: false, prefix: prefix.core }, // 根据ID查询详情
    createSysInterface: { url: 'sysInterface/createSysInterface', isStatic: false, prefix: prefix.core }, // 以接口维度创建接口权限
    updateSysInterface: { url: 'sysInterface/updateSysInterface', isStatic: false, prefix: prefix.core, noSlash: true }, // 更新接口信息
  },
  // 菜单上关联接口
  sysMenu: {
    getMenuInterfaces: { url: 'sys/menu/getMenuInterfaces', isStatic: false, prefix: prefix.core }, // 以菜单维度查询列表
    createMenuInterface: { url: 'sys/menu/createMenuInterface', isStatic: false, prefix: prefix.core }, // 以菜单维度创建接口权限
    updateMenuInterface: { url: 'sys/menu/updateMenuInterface', isStatic: false, prefix: prefix.core }, // 以菜单维度更新接口权限
    getMenuInterfaceByRid: { url: 'sys/menu/getMenuInterfaceByRid', isStatic: false, prefix: prefix.core }, // 以菜单维度根据rid查询详情
    deleteMenuInterface: { url: 'sys/menu/deleteMenuInterface', isStatic: false, prefix: prefix.core }, // 以菜单维度删除接口权限信息
  },
  // 帮助中心
  help: {
    gethelpBykw: { url: 'sys/menu/getMenuInterfaces', isStatic: false, prefix: prefix.core }, // 模糊查询帮助内容列表
    getHelpByRid: { url: 'sys/menu/createMenuInterface', isStatic: false, prefix: prefix.core }, // 根据rid查询对应的帮助内容
    updateMenuInterface: { url: 'sys/menu/updateMenuInterface', isStatic: false, prefix: prefix.core }, // 提交吐槽内容
    getMenuInterfaceByRid: { url: 'sys/menu/getMenuInterfaceByRid', isStatic: false, prefix: prefix.core }, // 以菜单维度根据rid查询详情
    deleteMenuInterface: { url: 'sys/menu/deleteMenuInterface', isStatic: false, prefix: prefix.core }, // 以菜单维度删除接口权限信息
  }
}
export { prefix }
