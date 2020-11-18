/**
 * @Description: urlMap
 * @author fuyongbo@everjiankang.com
 * @date 2019-04-11
*/
// import { prefixBase as prefix } from '@/util/urls.base'
/* mock文件存放的默认地址 这里的文件在线上环境是可以删除的 */
export const staticPath = 'static/assets/mock/'
/* 请求前缀 根据需要划分级别 */

export const prefix = {
  demo: 'demo/',
  base: 'platform-extend/base/',
  core: 'thc-platform-core/',
  arrange: 'arrange/',
  warehouse: 'warehouse/',
  dataimport: 'platform-extend/filemanage/',
  follow: {
    template: 'follow-up/template/',
    syscode: 'follow-up/syscode/',
    sysnodeFit: 'follow-up/sysnodeFit/',
    task: 'follow-up/templateJob/',
    material: 'follow-up/templateNodeMaterialJob/',
    sysoperationLog: 'follow-up/sysoperationLog/',
    materialQnaire: 'follow-up/materialQnaire/',
    materialPhone: 'follow-up/phoneTemplate/',
    materialCustom: 'follow-up/materialCustom/',
    templateNodeMaterial: 'follow-up/templateNodeMaterial/',
    templateNodeMaterialJobSub: 'follow-up/templateNodeMaterialJobSub/',
    patientRegister: 'c-union/doctor/patientRegister/',
    templateNode: 'follow-up/templateNode/',
    property: 'follow-up/property/',
    propertyRuleTemplate: 'follow-up/propertyRuleTemplate/',
    propertyRule: 'follow-up/propertyRule/',
    scheduledtask: 'follow-up/scheduledtask/template/',
    sysEvent: 'follow-up/scheduledtask/sysEvent/'
  },
  mall: {
    spu: 'titan-mall/third/spu/'
  },
  titan: {
    video: 'titan-video-cms/video/cms/'
  },
  scheduledtask: {
    template: 'follow-up/scheduledtask/template/',
    task: 'follow-up/scheduledtask/instance/'
  },
  ppc: 'platform-extend/ppc/',
  survey: {
    // create: 'survey/design/my-survey-design/',
    create: 'survey/surveyManager/',
    response: 'survey/response/'
  }
}
const urlMap = {
  // 示例url
  demo: {
    remote: { url: 'remote/get', isStatic: true, prefix: prefix.demo },
    remote2: { url: 'remote/get2', isStatic: true, prefix: prefix.demo },
  },
  // 注意：在即将发布正式环境之前，以下的isStatic务必全部改为false，否则测试接口时取得的是静态数据
  // 获取表格配置文件
  getTableConfig: { url: 'userdata/tableconf/qry', isStatic: false, prefix: prefix.base }, // 获取表格的配置文件
  // 保存表格配置文件
  saveTableConfig: { url: 'userdata/tableconf/config/save', isStatic: false, prefix: prefix.base }, // 保存表格的配置文件
  saveTablePageSize: { url: 'userdata/tableconf/pagesize/save', isStatic: false, prefix: prefix.base }, // 保存表格的配置文件
  // packageapi
  packageapi: {
    // 对于后台已经完成了的接口，可以直接调用，不需要加isStatic
    setmealOrder: 'market/doctor/setmealOrder/search',
  },
  arrangeapi: {
    queryMyTask: { url: 'appointment/queryMyTask', prefix: prefix.arrange },
  },
  follow: {
    template: {
      getByBusinessTemplateId: {url: 'getByBusinessTemplateId', isStatic: false, prefix: prefix.scheduledtask.template},
      findByCriteria: { url: 'findByCriteria', isStatic: false, prefix: prefix.follow.template },
      delTemplateById: { url: 'delTemplateById', isStatic: false, prefix: prefix.follow.template },
      create: { url: 'create', isStatic: false, prefix: prefix.follow.template },
      modify: { url: 'modify', isStatic: false, prefix: prefix.follow.template },
      detailById: { url: 'detailById', isStatic: false, prefix: prefix.follow.template },
      updateScope: { url: 'updateScope', isStatic: false, prefix: prefix.follow.template },
      updateScopeNodes: { url: 'updateScopeNodes', isStatic: false, prefix: prefix.follow.template },
      enable: { url: 'enable', isStatic: false, prefix: prefix.follow.template },
      selectPhoneTemplate: { url: 'selectPhoneTemplate', isStatic: false, prefix: prefix.follow.template },
      updateTemplateNode: { url: 'updateTemplateNode', isStatic: false, prefix: prefix.follow.template }, // 更新模板适用阶段
      createPersonal: { url: 'createPersonal', isStatic: false, prefix: prefix.follow.template }, // 存为个人模板
      updateTemplateNodeMaterial: { url: 'updateTemplateNodeMaterial', isStatic: false, prefix: prefix.follow.template } // 存为个人模板
    },
    syscode: {
      findByTypeId: { url: 'findByTypeId', isStatic: false, prefix: prefix.follow.syscode },
      deleteById: { url: 'deleteById', isStatic: false, prefix: prefix.follow.syscode },
      modify: { url: 'modify', isStatic: false, prefix: prefix.follow.syscode },
      create: { url: 'create', isStatic: false, prefix: prefix.follow.syscode },
    },
    sysnodeFit: {
      selectByCategoryId: { url: 'selectByCategoryId', isStatic: false, prefix: prefix.follow.sysnodeFit }, // 根据分类获取事件节点列表
    },
    task: {
      findByCriteria: { url: 'searchMaster', isStatic: false, prefix: prefix.scheduledtask.task }, // 主任务列表
      detailById: { url: 'getMasterInfo', isStatic: false, prefix: prefix.scheduledtask.task }, // 获取主任务详情
      selectMaterialJobList: { url: 'searchTask', isStatic: false, prefix: prefix.scheduledtask.task }, // 子任务维度任务列表
      getById: { url: 'getById', isStatic: false, prefix: prefix.scheduledtask.task },
      runTask: { url: 'runTask', isStatic: false, prefix: prefix.scheduledtask.task }, // 执行任务
      stopTask: { url: 'stopTask', isStatic: false, prefix: prefix.scheduledtask.task },
      stopMasterTask: { url: 'stopMasterTask', isStatic: false, prefix: prefix.scheduledtask.task },
      checkMaster: {url: 'checkMaster', isStatic: false, prefix: prefix.scheduledtask.task},
      findStatusGroupByCriteria: { url: 'findStatusGroupByCriteria', isStatic: false, prefix: prefix.follow.task }, // 状态分类列表
      startTemplateJobById: { url: 'startTemplateJobById', isStatic: false, prefix: prefix.follow.task }, // 审核通过
      cancleTemplateJobById: { url: 'cancleTemplateJobById', isStatic: false, prefix: prefix.follow.task }, // 审核不通过
      stopTemplateJobById: { url: 'stopTemplateJobById', isStatic: false, prefix: prefix.follow.task }, // 终止任务
      selectJobListById: { url: 'selectJobListById', isStatic: false, prefix: prefix.follow.task }, // 根据用户id查询随访任务接口
      freeJob: { url: 'freeJob', isStatic: false, prefix: prefix.follow.task }, // 诊间随访生成任务
      dealFreeJob: { url: 'dealFreeJob', isStatic: false, prefix: prefix.follow.task }, // 诊间随访生成任务
      findMaterialJobStatusGroupByCriteria: { url: 'findMaterialJobStatusGroupByCriteria', isStatic: false, prefix: prefix.follow.task }, // 子任务状态分类
      cunoinFreeJob: { url: 'cunoinFreeJob', isStatic: false, prefix: prefix.follow.task } // 会员增加随访
    },
    material: {
      detailById: { url: 'detailById', isStatic: false, prefix: prefix.follow.material },
      findByCriteria: { url: 'findByCriteria', isStatic: false, prefix: prefix.follow.templateNodeMaterialJobSub },
      startExecuteMaterialJobById: { url: 'startExecuteMaterialJobById', isStatic: false, prefix: prefix.follow.material }, // 执行任务
      cancleExecuteMaterialJobById: { url: 'cancleExecuteMaterialJobById', isStatic: false, prefix: prefix.follow.material }, // 取消任务
      saveExecuteMaterialJobById: { url: 'saveExecuteMaterialJobById', isStatic: false, prefix: prefix.follow.material }, // 保存记录
      finishExecuteMaterialJobById: { url: 'finishExecuteMaterialJobById', isStatic: false, prefix: prefix.follow.material }, // 完成任务
      startExecuteMaterialJobMsgById: { url: 'startExecuteMaterialJobMsgById', isStatic: false, prefix: prefix.follow.material } // 完成任务
    },
    sysoperationLog: {
      findPageByBizId: { url: 'findPageByBizId', isStatic: false, prefix: prefix.follow.sysoperationLog },
    },
    materialQnaire: {
      findByCriteria: { url: 'findByCriteria', isStatic: false, prefix: prefix.follow.materialQnaire }, // 全部问卷列表分页条件查询
      create: { url: 'create', isStatic: false, prefix: prefix.follow.materialQnaire },
      detail: { url: 'detail', isStatic: false, prefix: prefix.follow.materialQnaire },
      update: { url: 'update', isStatic: false, prefix: prefix.follow.materialQnaire },
      delete: { url: 'delete', isStatic: false, prefix: prefix.follow.materialQnaire },
      updateStatus: { url: 'updateStatus', isStatic: false, prefix: prefix.follow.materialQnaire },
      copyNewSurvey: { url: 'copyNewSurvey', isStatic: false, prefix: prefix.follow.materialQnaire }
    },
    materialPhone: {
      findByCriteria: { url: 'findByCriteria', isStatic: false, prefix: prefix.follow.materialPhone }, // 全部问卷列表分页条件查询
    },
    materialCustom: {
      detail: { url: 'detail', isStatic: false, prefix: prefix.follow.materialCustom },
      selectVideos: { url: 'selectVideos', isStatic: false, prefix: prefix.follow.materialCustom }
    },
    templateNodeMaterial: {
      delete: { url: 'delete', isStatic: false, prefix: prefix.follow.templateNodeMaterial },
      update: { url: 'update', isStatic: false, prefix: prefix.follow.materialQnaire }
    },
    patientRegister: {
      checkByPatientId: { url: 'checkByPatientId', isStatic: false, prefix: prefix.follow.patientRegister }, // 验证是否填写过
      create: { url: 'create', isStatic: false, prefix: prefix.follow.patientRegister }, // 新客户登记表-提交保存
      getByPatientId: { url: 'getByPatientId', isStatic: false, prefix: prefix.follow.patientRegister }, // 获取客户登记表内容
    },
    templateNode: {
      delete: { url: 'delete', isStatic: false, prefix: prefix.follow.templateNode }
    },
    property: {
      searchEnable: { url: 'searchEnable', isStatic: false, prefix: prefix.follow.property },
      getDynamicData: { url: 'getDynamicData', isStatic: false, prefix: prefix.follow.property }
    },
    propertyRuleTemplate: {
      createRule: { url: 'createRule', isStatic: false, prefix: prefix.follow.propertyRuleTemplate },
      getByTemplateId: { url: 'getByTemplateId', isStatic: false, prefix: prefix.follow.propertyRuleTemplate }
    },
    propertyRule: {
      deleteRuleItem: { url: 'deleteRuleItem', isStatic: false, prefix: prefix.follow.propertyRule },
      modifyRuleItem: { url: 'modifyRuleItem', isStatic: false, prefix: prefix.follow.propertyRule }
    },
    scheduledtask: {
      create: { url: 'create', isStatic: false, prefix: prefix.follow.scheduledtask },
      delete: { url: 'delete', isStatic: false, prefix: prefix.follow.scheduledtask },
      modify: { url: 'modify', isStatic: false, prefix: prefix.follow.scheduledtask },
      getByBusinessTemplateId: { url: 'getByBusinessTemplateId', isStatic: false, prefix: prefix.follow.scheduledtask },
      getById: { url: 'getById', isStatic: false, prefix: prefix.follow.scheduledtask },
      getByParentId: { url: 'getByParentId', isStatic: false, prefix: prefix.follow.scheduledtask },
      checkMedicalTask: { url: 'checkMedicalTask', isStatic: false, prefix: prefix.follow.scheduledtask },
    },
    sysEvent: {
      searchEnableCategory: { url: 'searchEnableCategory', isStatic: false, prefix: prefix.follow.sysEvent },
      getEnableByCategoryId: { url: 'getEnableByCategoryId', isStatic: false, prefix: prefix.follow.sysEvent },
    }
  },
  mall: {
    spu: {
      list: { url: 'list', isStatic: false, prefix: prefix.mall.spu }
    }
  },
  titan: {
    video: {
      query: { url: 'query', isStatic: false, prefix: prefix.titan.video }
    }
  },
  // 诊断
  searchDiagnose: 'platform-extend/disease/diseaseOrig/search',
  // 医嘱
  searchForBrowser: 'sob/service/searchForBrowser',
  arrangeServiceList: 'sob/service/arrangeServiceList',
  warehouse: {
    getSectionVoListForService: { url: 'sectionRecord/getSectionVoListForService', prefix: prefix.warehouse }, // 集团科室列表
    getLocalSectionVoListForService: { url: 'localSectionRecord/getLocalSectionVoListForService', prefix: prefix.warehouse }, // 机构科室列表
  },
  userOpLogInfo: {
    getUserOpLogInfos: { url: 'userOpLogInfo/getUserOpLogInfos', isStatic: false, prefix: prefix.core },
  },
  rabbitmqSend: {
    getRabbitmqSends: { url: 'rabbitmqSend/getRabbitmqSends', isStatic: false, prefix: prefix.core },
    getRabbitmqSend: { url: 'rabbitmqSend/getRabbitmqSend', isStatic: false, prefix: prefix.core },
    getNodeDroList: { url: 'rabbitmqSend/getNodeDroList', isStatic: false, prefix: prefix.core },
    getSendBizDomainCodeDroList: { url: 'rabbitmqSend/getSendBizDomainCodeDroList', isStatic: false, prefix: prefix.core },
    getExchangeNameDroList: { url: 'rabbitmqSend/getExchangeNameDroList', isStatic: false, prefix: prefix.core },
    getRoutingkeyDroList: { url: 'rabbitmqSend/getRoutingkeyDroList', isStatic: false, prefix: prefix.core },
    createRabbitmqSend: { url: 'rabbitmqSend/createRabbitmqSend', isStatic: false, prefix: prefix.core },
    updateRabbitmqSend: { url: 'rabbitmqSend/updateRabbitmqSend', isStatic: false, prefix: prefix.core },
    exportMQSend: { url: 'rabbitmqSend/exportMQSend', isStatic: false, prefix: prefix.core }, // 导出mq事件
    exportMQReceive: { url: 'rabbitmqSend/exportMQReceive', isStatic: false, prefix: prefix.core }, // 导出队列
  },
  rabbitmqReceive: {
    getRabbitmqReceives: { url: 'rabbitmqReceive/getRabbitmqReceives', isStatic: false, prefix: prefix.core },
    getRabbitmqReceive: { url: 'rabbitmqReceive/getRabbitmqReceive', isStatic: false, prefix: prefix.core },
    updateRabbitmqReceive: { url: 'rabbitmqReceive/updateRabbitmqReceive', isStatic: false, prefix: prefix.core },
    createRabbitmqReceive: { url: 'rabbitmqReceive/createRabbitmqReceive', isStatic: false, prefix: prefix.core },
  },
  nodeInfo: {
    getBizDomainMap: { url: 'nodeInfo/getBizDomainMap', isStatic: false, prefix: prefix.core },
    getBizMap: { url: 'nodeInfo/getBizMap', isStatic: false, prefix: prefix.core },
  },
  // 数据导入
  dataimport: {
    queryTempletModule: { url: 'queryTempletModule', isStatic: false, prefix: prefix.dataimport },
    upLoadTemplet: { url: 'upLoadTemplet', isStatic: false, prefix: prefix.dataimport },
    templetRecord: { url: 'queryTempletRecord', isStatic: false, prefix: prefix.dataimport },
    upLoadTempletData: { url: 'upLoadTempletData', isStatic: false, prefix: prefix.dataimport },
    downLoadTemplet: { url: 'downLoadTemplet', isStatic: false, prefix: prefix.dataimport },
    downLoadTempletData: { url: 'downLoadTempletData', isStatic: false, prefix: prefix.dataimport },
    queryTempletActionLog: { url: 'queryTempletActionLog', isStatic: false, prefix: prefix.dataimport },
    verifiData: { url: 'verifiData', isStatic: false, prefix: prefix.dataimport },
    keepActionResult: { url: 'keepActionResult', isStatic: false, prefix: prefix.dataimport },
    platformDownLoad: { url: 'download', isStatic: false, prefix: prefix.dataimport },
    getImportDataStatus: { url: 'getImportDataStatus', isStatic: false, prefix: prefix.dataimport },
  },
  printlist: {
    list: { url: 'print-data/listPage', prefix: prefix.ppc },
    log: { url: 'print-his/add', prefix: prefix.ppc },
    loglist: { url: 'print-his/listPage', prefix: prefix.ppc }
  },
  // 问卷
  survey: {
    // create: { url: 'save.do', isStatic: false, prefix: prefix.survey.create }, // 新增问卷
    create: { url: 'create', isStatic: false, prefix: prefix.survey.create }, // 新增问卷
    save: { url: 'save.do', isStatic: false, prefix: prefix.survey.response }, // 答卷保存电脑
    saveMobile: { url: 'saveMobile.do', isStatic: false, prefix: prefix.survey.response }, // 答卷保存移动端
    getAnswerNumBySurveyId: { url: 'getAnswerNumBySurveyId', isStatic: false, prefix: prefix.survey.create }, // 答题人数
  },
  // 值集管理
  valueSet: {
    getValueSets: { url: 'valueSet/getValueSets', isStatic: false, prefix: prefix.core }, // 查询值列表
    createValueSet: { url: 'valueSet/createValueSet', isStatic: false, prefix: prefix.core }, // 创建值明细
    deleteById: { url: 'valueSet/deleteById', isStatic: false, prefix: prefix.core }, // 删除值集
    updateValueSet: { url: 'valueSet/updateValueSet', isStatic: false, prefix: prefix.core }, // 更新值
    getValueSet: { url: 'valueSet/getValueSet', isStatic: false, prefix: prefix.core }, // 查询值集明细
    getValueSetItem: { url: 'valueSet/getValueSetItem', isStatic: false, prefix: prefix.core }, // 查询集明细
    getValueSetItems: { url: 'valueSetItem/getValueSetItems', isStatic: false, prefix: prefix.core }, // 查询集（按名称和code模糊查）
    getValueSetItemsForWeb: { url: 'valueSetItem/getValueSetItemsForWeb', isStatic: false, prefix: prefix.core }, // 查询集（按名称和code模糊查）可以查出禁用的值集
    updateValueSetItem: { url: 'valueSetItem/updateValueSetItem', isStatic: false, prefix: prefix.core }, // 更新集
    deleteValueById: { url: 'valueSetItem/deleteById', isStatic: false, prefix: prefix.core }, // 删除集
    createValueSetItem: { url: 'valueSetItem/createValueSetItem', isStatic: false, prefix: prefix.core }, // 创建集明细
    getValueListByCode: { url: 'valueSet/getValueListBySetCode', isStatic: false, prefix: prefix.core }, // 根据code查询集
    createValueSetAttr: { url: 'valueSetAttr/createValueSetAttr', isStatic: false, prefix: prefix.core }, // 创建一个集扩展
    updateValueSetAttr: { url: 'valueSetAttr/updateValueSetAttr', isStatic: false, prefix: prefix.core }, // 编辑集扩展
    deleteById1: { url: 'valueSetAttr/deleteById', isStatic: false, prefix: prefix.core }, // 删除一个集扩展
    getValueSetItemAttrsForWeb: { url: 'valueSetItemAttr/getValueSetItemAttrsForWeb', isStatic: false, prefix: prefix.core }, // 查询值扩展列表
    createValueSetItemAttr: { url: 'valueSetItemAttr/createValueSetItemAttr', isStatic: false, prefix: prefix.core }, // 创建值扩展
    updateValueSetItemAttr: { url: 'valueSetItemAttr/updateValueSetItemAttr', isStatic: false, prefix: prefix.core }, // 更新值扩展
    deleteValueById1: { url: 'valueSetItemAttr/deleteById', isStatic: false, prefix: prefix.core }, // 删除值扩展
    copyItemToAttr: { url: 'valueSetItemAttr/copyItemToAttr', isStatic: false, prefix: prefix.core }, // 扩展列表中导入数据
    getValueSetItemByCodeForWeb: { url: 'valueSetItem/getValueSetItemByCodeForWeb', isStatic: false, prefix: prefix.core }, // 查询集（按名称和code模糊查）可以查出禁用的值集
    exportValueSet: { url: 'valueSet/exportValueSet', isStatic: false, prefix: prefix.core }, // 导出集sql
    exportValueSetItem: { url: 'valueSet/exportValueSetItem', isStatic: false, prefix: prefix.core }, // 导出值sql
  }
}
export default urlMap
