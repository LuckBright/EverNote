// 电子病历相关的接口
const prefix = {
  medicalRecord: 'medical-record/doctor/',
  formEngine: 'form-engine/'
}
export default{
  // 模版管理
  templateManage: {
    getTemplateTree: { url: 'medicalRecordCategory/getTemplateTree', prefix: prefix.medicalRecord },
    upOrDown: { url: 'medicalRecordCategory/upOrDown', prefix: prefix.medicalRecord },
    checkName: { url: 'templateScope/checkName', prefix: prefix.medicalRecord },
    getTplList: { url: 'templateScope/superiorSearch', prefix: prefix.medicalRecord },
    getFormDataById: {url: 'formData/getFormDataById', isStatic: false, prefix: prefix.formEngine},
    getOldTplList: { url: 'FormTemplate/queryTemplate', prefix: prefix.formEngine },
    saveTpl: { url: 'templateScope/create', prefix: prefix.medicalRecord },
    updateTpl: { url: 'templateScope/update', prefix: prefix.medicalRecord },
    delTpl: { url: 'templateScope/delete', isStatic: false, prefix: prefix.medicalRecord },
    getOrgTree: {url: 'templateScope/getOrgTree', prefix: prefix.medicalRecord},
    getCategoryId: {url: 'medicalRecordCategory/getByCode', prefix: prefix.medicalRecord},
    getsystemConfigDisabled: {url: 'systemConfigParent/isDisabled', prefix: prefix.medicalRecord},
    reviewTemplate: {url: 'templateScope/audit', prefix: prefix.medicalRecord},
  },
  // 病案管理
  recordManage: {
    getCategoryTreeExistMedical: {url: 'medicalRecordCategory/getCategoryTreeExistMedical', prefix: prefix.medicalRecord},
    batchPrint: {url: 'medicalRecord/findPrintContinueRecords', prefix: prefix.medicalRecord},
    getPrintContinueRecords: {url: '/medicalRecord/getPrintContinueRecords', prefix: prefix.medicalRecord}
  },
  // 表单相关
  form: {
    // 体温单查询数据和模版接口
    getTmpData: {url: 'medicalRecord/getTemperatureByVisitId', prefix: prefix.medicalRecord},
    create: {url: 'medicalRecord/create', prefix: prefix.medicalRecord}
  },
  // 体温单
  temperature: {
    getChartData: {url: 'temperatureRecord/getChartData', prefix: prefix.medicalRecord}
  },
  // 借阅相关
  borrow: {
    searchBorrowApply: {url: 'recordManage/borrowAndRecallSearch', prefix: prefix.medicalRecord}, // 查询借阅申请
    queryBorrowing: {url: 'medicalRecordBorrowing/queryBorrowing', prefix: prefix.medicalRecord}, // 查询借阅记录
    addBorrowing: {url: 'medicalRecordBorrowing/addBorrowing', prefix: prefix.medicalRecord}, // 添加借阅记录（借阅申请）
    adoptBorrowing: {url: 'medicalRecordBorrowing/adoptBorrowing', prefix: prefix.medicalRecord}, // 借阅审核通过
    refuseBorrowing: {url: 'medicalRecordBorrowing/refuseBorrowing', prefix: prefix.medicalRecord}, // 借阅拒绝
    returnBorrowing: {url: 'medicalRecordBorrowing/returnBorrowing', prefix: prefix.medicalRecord}, // 借阅归还/借阅强制归还
  },
  // 解锁相关
  unlock: {
    medicalRecordLock: {url: 'medicalRecord/lock', prefix: prefix.medicalRecord}, // 病历加锁
    medicalRecordUnlock: {url: 'medicalRecord/unlock', prefix: prefix.medicalRecord}, // 病历解锁
    applyUnlock: {url: 'medicalRecordLock/apply/unlock', prefix: prefix.medicalRecord}, // 申请解锁
    relieveLock: {url: 'medicalRecordLock/unlock', prefix: prefix.medicalRecord}, // 解除病历锁
    searchLock: {url: 'medicalRecordLock/apply/search', prefix: prefix.medicalRecord}, // 解锁审核记录
    searchApplyUnLock: {url: 'medicalRecordLock/lock/search', prefix: prefix.medicalRecord}, // 申请解锁记录
  },
  // 召回相关
  recall: {
    recallApplyListForDoctor: {url: 'recordManage/recallDoctorSearch', prefix: prefix.medicalRecord},
    recallApplyListForNurse: {url: 'recordManage/recallNurseSearch', prefix: prefix.medicalRecord},
    addRecall: {url: 'medicalRecordRecall/addRecall', prefix: prefix.medicalRecord}, // 召回申请
    recallRecord: {url: 'medicalRecordRecall/getRecallRecord', prefix: prefix.medicalRecord}, // 病案召回列表
    qualityAudit: {url: 'medicalRecordRecall/getQcRecallAuditRecord', prefix: prefix.medicalRecord}, // 质控审核列表
    qualityAgree: {url: 'medicalRecordRecall/qcAdopt', prefix: prefix.medicalRecord}, // 质控通过
    qualityRefuse: {url: 'medicalRecordRecall/qcRefuse', prefix: prefix.medicalRecord}, // 质控拒绝
    medicalRecordAudit: {url: 'medicalRecordRecall/getMrRecallAuditRecord', prefix: prefix.medicalRecord}, // 病案审核列表
    medicalRecordAgree: {url: 'medicalRecordRecall/mrAdopt', prefix: prefix.medicalRecord}, // 病案通过
    medicalRecordRefuse: {url: 'medicalRecordRecall/mrRefuse', prefix: prefix.medicalRecord}, // 病案拒绝
  },
  // 病历相关
  record: {
    getById: {url: 'medicalRecord/getById', prefix: prefix.medicalRecord}
  }
}
