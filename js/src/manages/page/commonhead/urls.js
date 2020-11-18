export default {
  thcPageHeadConfig: {
    getAll: 'platform-extend/doctor/thcPageHeadConfig/getAll',
    delete: 'platform-extend/doctor/thcPageHeadConfig/delete',
    insert: 'platform-extend/doctor/thcPageHeadConfig/insert',
    update: 'platform-extend/doctor/thcPageHeadConfig/update',
    page: 'platform-extend/doctor/thcPageHeadConfig/page',
  },
  thcPageHeadTemplateConfig: {
    getAll: 'platform-extend/doctor/thcPageHeadTemplateConfig/getAll',
    insert: 'platform-extend/doctor/thcPageHeadTemplateConfig/insert',
    delete: 'platform-extend/doctor/thcPageHeadTemplateConfig/delete',
    modifyConfig: 'platform-extend/doctor/thcPageHeadTemplateConfig/modifyConfig',
    modifyIsOpen: 'platform-extend/doctor/thcPageHeadTemplateConfig/modifyIsOpen',
    getDetailByCode: 'platform-extend/doctor/thcPageHeadTemplateConfig/getDetailByCode',
  },
  // 各个业务组获取患者头信息
  headInfo: {
    // 在调用其他业务组的接口之前，先调用thc-phr的接口，获取到 visitSerialTypeCode 作为调用其他业务接口的参数
    'thc-phr': 'thc-phr/extend/patientHeadInfo',
    'thc-c-union': 'c-union/extend/patientHeadInfo',
  },
  'c-union': {
    busiInsur: 'c-union/doctor/busiInsur/getByPatientId'
  }
}
