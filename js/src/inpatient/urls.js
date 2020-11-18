import { prefix as commonPrefix } from '@/util/urls'
const prefix = {
  ...commonPrefix,
  templateManage: 'medical-record/doctor/'
}
export default {
  // 获取电子病历设置
  getConfig: {
    getAll: { url: 'systemConfigRelation/getAll', prefix: prefix.templateManage }
  },
  // 病历书写
  medicalRecord: {
    // 病历类型+病历实例
    getInstanceTree: { url: 'medicalRecordCategory/getMedicalTree', prefix: prefix.templateManage },
    // 模版列表
    tplList: {url: 'templateScope/search', prefix: prefix.templateManage},
    // 暂存和更新实例（草稿状态的）
    saveDraftInstance: {url: 'medicalRecord/temporaryStorage', prefix: prefix.templateManage},
    // 更新已提交的实例
    saveSubmitInstance: {url: 'medicalRecord/storage', prefix: prefix.templateManage},
    // 删除实例
    deleteInstance: {url: 'medicalRecord/delete', prefix: prefix.templateManage},
    // 另存为模版
    saveAsTpl: {url: 'templateScope/create', prefix: prefix.templateManage},
    // 提交病历
    submitInstance: {url: 'medicalRecord/submit', prefix: prefix.templateManage},
    // 和文档编辑器相关的接口
    // 获取文档模版
    getDocTpl: {url: 'form-engine/FormTemplate/queryTemplateDetail/', prefix: ''},
    // 获取回显
    getDocEchoDisplay: { url: '/form-engine/echo/getVisitData/', prefix: '' },
    // 获取病历
    getInstance: {url: 'medicalRecord/getByRecordId4FormData', prefix: prefix.templateManage},
    // 申请编辑
    applyEdit: {url: 'medicalRecord/applyEdit', prefix: prefix.templateManage},
    // 通过code获取分类
    getCategoryByCode: {url: 'medicalRecordCategory/getByCode', prefix: prefix.templateManage},
    // 获取权限
    getAuthority: {url: 'medicalRecord/getAuthority', prefix: prefix.templateManage},
    // 时限质控
    qualityControl: { url: 'qualityControl/get', prefix: prefix.templateManage },
    // 护理文书汇总结果
    addSummary: { url: 'summary/addSummary', prefix: prefix.templateManage }
  },
  // 引用
  quote: {
    // 医嘱
    yizhu: '/thc-phr/doctor/adviceExecute/getCompleteExecute',
    jianyan: '/thc-phr/doctor/inspection/getAll',
    jiancha: '/thc-phr/doctor/examineView/listFinished',
    history: {
      all: '/thc-phr/doctor/visit/getAll',
      tree: '/medical-record/doctor/medicalRecordCategory/getMedicalHistoryTree'
    }
  }
}
export { prefix }
