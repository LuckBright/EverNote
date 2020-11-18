// 电子病历相关的接口
const prefix = {
  templateManage: 'sob/medicalSkillCategory/',
  Skill: 'sob/medicalSkillTemplateScope/',
  tech: 'sob/medicalTechnology/',
  formEngine: '/form-engine/'
}
export default{
  // 模版管理
  templateManage: {
    getTemplateTree: { url: 'getTemplateTree', prefix: prefix.templateManage },
    upOrDown: { url: 'upOrDown', prefix: prefix.templateManage },
    checkName: { url: 'checkName', prefix: prefix.Skill },
    getTplList: { url: 'superiorSearch', prefix: prefix.Skill },
    getFormDataById: {url: 'formData/getFormDataById', prefix: prefix.formEngine},
    getOldTplList: { url: 'queryTemplate', prefix: prefix.Skill },
    saveTpl: { url: 'create', prefix: prefix.Skill },
    updateTpl: { url: 'update', prefix: prefix.Skill },
    delTpl: { url: 'delete', isStatic: false, prefix: prefix.Skill },
    getOrgTree: { url: 'medical-record/doctor/templateScope/getOrgTree', prefix: '' },
    getCategoryId: { url: 'getByCode', prefix: prefix.templateManage }
  },
  medicalRecord: {
    // // 病历类型+病历实例
    // getInstanceTree: { url: 'medicalRecordCategory/getMedicalTree', prefix: prefix.templateManage },
    // // 模版列表
    tplList: {url: 'search', prefix: prefix.templateManage},
    skill_tplList: {url: 'search/', prefix: prefix.Skill},
    // // 暂存和更新实例（草稿状态的）
    // saveDraftInstance: {url: 'medicalRecord/temporaryStorage', prefix: prefix.templateManage},
    // 保存或者更新
    submitForm: {url: 'submitForm', prefix: prefix.tech},
    // // 删除实例
    delete: {url: 'delForm', prefix: prefix.tech},
    // // 另存为模版
    // saveAsTpl: {url: 'templateScope/create', prefix: prefix.templateManage},
    // // 提交病历
    // submitInstance: {url: 'medicalRecord/submit', prefix: prefix.templateManage},
    // 和文档编辑器相关的接口
    // 获取文档模版
    getDocTpl: {url: 'form-engine/FormTemplate/queryTemplateDetail/', prefix: ''},
    // // 获取回显
    getDocEchoDisplay: { url: '/form-engine/echo/getVisitData/', prefix: '' },
    // // 获取病历
    // getInstance: {url: 'medicalRecord/getByRecordId4FormData', prefix: prefix.templateManage},
    // // 申请编辑
    // applyEdit: {url: 'medicalRecord/applyEdit', prefix: prefix.templateManage},
    // // 通过code获取分类
    // getCategoryByCode: {url: 'medicalRecordCategory/getByCode', prefix: prefix.templateManage},
    // // 获取权限
    // getAuthority: {url: 'medicalRecord/getAuthority', prefix: prefix.templateManage},
    // // 时限质控
    // qualityControl: { url: 'qualityControl/get', prefix: prefix.templateManage }
  },
}
