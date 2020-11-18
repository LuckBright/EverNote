const prefix = {
  config: '/medical-record/doctor/'
}

export default {
  commonConfig: {
    getOrgList: {url: '/thc-platform-core/out/organization/getOrgListByIdList'},
    detail: {url: 'systemConfigParent/getItemsByParentId', prefix: prefix.config},
    edit: {url: 'systemConfigParent/updateConfig', prefix: prefix.config},
    delete: {url: 'systemConfigParent/deleteConfig', prefix: prefix.config}
  },
  // 病案首页配置
  medicalConfig: {
    query: {url: 'systemConfigParent/getHomePageList', prefix: prefix.config},
    add: {url: 'systemConfigParent/creatHomePageConfig', prefix: prefix.config}
  },
  // 体温单配置
  temperatureConfig: {
    getInOut: {url: 'templateManage/getOneByCode', prefix: prefix.config},
    query: {url: 'systemConfigParent/getTemperatureList', prefix: prefix.config},
    add: {url: 'systemConfigParent/creatTemperatureConfig', prefix: prefix.config}
  },
  // 时限质控配置
  timeConfig: {
    getWriteType: {url: 'medicalRecordCategory/getTree', prefix: prefix.config},
    query: {url: 'qualityControlConfig/search', prefix: prefix.config},
    add: {url: 'qualityControlConfig/create', prefix: prefix.config},
    edit: {url: 'qualityControlConfig/update', prefix: prefix.config},
    delete: {url: 'qualityControlConfig/delete', prefix: prefix.config}
  },
  // 自动归档配置
  autoConfig: {
    query: {url: 'systemConfigParent/getAutoArchiveList', prefix: prefix.config},
    add: {url: 'systemConfigParent/creatAutoArchiveConfig', prefix: prefix.config}
  },
  // 护理记录单配置
  nursingConfig: {
    query: {url: 'systemConfigParent/getNursingRecordsList', prefix: prefix.config},
    add: {url: 'systemConfigParent/creatNursingRecordsConfig', prefix: prefix.config}
  },
  // 病历书写配置
  writeConfig: {
    query: {url: 'systemConfigParent/getCaseRecordList', prefix: prefix.config},
    add: {url: 'systemConfigParent/creatCaseRecordConfig', prefix: prefix.config}
  },
  // 病历召回配置
  recallConfig: {
    query: {url: 'systemConfigParent/getRecallRecordList', prefix: prefix.config},
    add: {url: 'systemConfigParent/creatRecallRecordConfig', prefix: prefix.config}
  },
}
