// 集团管理工作站
import GroupManage from '@/manages/manages.vue'
import Welcome from '@/login/page/welcome'

import Configure from '@/manages/page/configure/index'
import FormDemo from '@/manages/components/formdemo' // wh 自定义表单模板使用demo
import RouterBack from '@/manages/components/router.back'
// -------------------------------------------------------------------------------------
import organizationRouteList from '@/manages/router/oss'
// 机构管理
import OrganizationListCustom from '@/warehouse/page/group/view/organization/organizationcustom' // 自定义架构
import OrganizationListCross from '@/warehouse/page/group/view/organization/organizationcross' // 跨机构供应关系
import OrganizationListCrossDetail from '@/warehouse/page/group/view/organization/organizationcrossdetail' // 跨机构供应关系详情
import OrganizationListCrossOrder from '@/warehouse/page/group/view/organization/organizationcrossorder' // 库房权重设置
//
// 物资
import Material from '@/manages/page/material'
import MaterialConcise from '@/manages/page/material/concise.index'
// 物资模版 移动过来
// import MaterialList from '@/warehouse/page/groupmaterial/materiallist'
import MaterialTempletList from '@/warehouse/page/groupmaterial/materialtempletlist'
import MaterialTempletEdit from '@/warehouse/page/groupmaterial/materialtempletedit'
import TempDictionary from '@/warehouse/page/groupmaterial/tempdictionary'
import TempDictionarySee from '@/warehouse/page/groupmaterial/tempdictionarysee'
import TempDictionaryProperty from '@/warehouse/page/groupmaterial/tempdictionaryproperty'

// 物资配置
// import MaterialConfigure from '@/manages/page/material/material.configure'
// 物资新建&详情
import MaterialInfo from '@/manages/page/material/material.info'
// 药理分类
import AgencyPharmacologyList from '@/warehouse/page/agency/view/pharmacology/pharmacologylist'
import AgencyAssociationdDrugList from '@/warehouse/page/agency/view/pharmacology/associationdruglist'
// -------------------------------------------------------------------------------------
// 医嘱项管理、组套项管理、医嘱项管理（简洁）、组套项管理（简洁）合在了一起
// import Stack from '@/manages/page/prescription/stack.vue'
import ServiceManage from '@/manages/page/prescription/service.vue'
import ServiceSetManage from '@/manages/page/prescription/service.set.vue'
// 新增-编辑医嘱项
import ServiceManageDetail from '@/manages/page/prescription/service.detail.vue'
import ServiceSetManageDetail from '@/manages/page/prescription/service.set.detail.vue'

// 身份卡
// import IdCardList from '@/card/page/idcardmanage/idcardlist'
// import IdCardContent from '@/card/page/idcardmanage/idcardcontent'
// 活动管理
import Activitys from '@/card/page/activitymanagement/activitylist'
import ActivityContent from '@/card/page/activitymanagement/activitycontent'
// -------------------------------------------------------------------------------------
// 短信管理路由表
import MESSAGECENTER from '@/msgcenter/router/index.js'
// 套餐管理
import PackageManage from '@/card/page/marketingpackage/packagemanagement'
import MarketingPackage from '@/card/page/marketingpackage/marketingpackagedetail'

// 模板管理
import FollowTemplate from '@/follow/page/template/followtemplate'
import FollowTemplateDetail from '@/follow/page/template/followtemplatedetail'
// import newcreate from '@/follow/page/template/newcreate'

// servicePattern
import processBindList from '@/sob/page/process.bind/list'
import processBindForm from '@/sob/page/process.bind/form'
// 频次管理（core）
import CoreFrequencyList from '@/sob/page/frequency.manage.core/list'
import CoreFrequencyForm from '@/sob/page/frequency.manage.core/form'
// 医嘱排斥组管理
import excludeList from '@/sob/page/advice.exclude/list'
import excludeForm from '@/sob/page/advice.exclude/form'
// 检验耗材管理
import mergeItemsList from '@/sob/page/service.merge/list'
import mergeItemsForm from '@/sob/page/service.merge/form'
// 用法管理
import serviceusageList from '@/sob/page/service.usage/list'
import serviceusageForm from '@/sob/page/service.usage/form'
// 诊断管理
import Groupdiagnosis from '@/warehouse/page/group/view/diagnosisgroup/groupdiagnosis'
import Diagnosismanage from '@/warehouse/page/group/view/diagnosisgroup/diagnosismanage'
import orgDiseaseConfig from '@/warehouse/page/group/view/diagnosisgroup/org-disease-config'
// 患者公共头部信息组件
import commonhead from '@/manages/page/commonhead/commonhead'

import configManagesDetail from '@/manages/page/commonhead/configmanagesdetail'
// 客户编号管理
import Membernumberlist from '@/crm/page/membernumber/membernumberlist'
import Membernumberedit from '@/crm/page/membernumber/membernumberedit'
// 计费规则设置
import billingrule from '@/warehouse/page/group/view/billing/billingrule'
import billingruleEdit from '@/warehouse/page/group/view/billing/billingrule.edit'
// 开单属性管理
import schemaSetList from '@/sob/page/schema.manage/schema.list.vue'
import schemaSetEdit from '@/sob/page/schema.manage/schema.edit.vue'
// 开单属性关联
import schemaRelateList from '@/sob/page/schema.manage/schema.relate.list.vue'
import schemaRelateEdit from '@/sob/page/schema.manage/schema.relate.edit.vue'
// 过敏规则
import AllergyRule from '@/warehouse/page/components/wh.material.irritability.vue'

// 住院护士打印规则
import NurseAutoprintSet from '@/sob/page/nurseautoprint.set'

// 大客户档案
import keyAccountManage from '@/warehouse/page/group/view/keyaccountmanage/keyaccountmanage.vue'
import profiles from '@/warehouse/page/group/view/keyaccountmanage/profilelist.vue'
import profile from '@/warehouse/page/group/view/keyaccountmanage/profile.vue'
import welfareProgrammes from '@/warehouse/page/group/view/keyaccountmanage/welfarelist.vue'
import welfare from '@/warehouse/page/group/view/keyaccountmanage/welfare.vue'
// 排班预约设置 班次
import Workmain from '@/warehouse/page/group/view/operationsManagement/workmain/main.vue'
import Numbermain from '@/warehouse/page/group/view/operationsManagement/numberrule/numbermain.vue'
import Appointment from '@/warehouse/page/group/view/operationsManagement/appointmentrule/appointment.vue'
// import Templatemain from '@/arrange/page/template/main.vue'
import Operatingmain from '@/arrange/page/scheduling/main.vue'
import Organizationscheduling from '@/warehouse/page/group/view/operationsManagement/organizationscheduling/organization.vue'
import Personscheduling from '@/warehouse/page/group/view/operationsManagement/personscheduling/person.vue'

// 预约规则配置
import appointConfig from '@/arrange/page/rules/config.vue'
import rulesList from '@/arrange/page/rules/ruleslist.vue'
// 问卷管理
// import Survey from '@/manages/page/survey/list.vue'
// import SurveyMain from '@/manages/page/survey/main.vue'
import SurveyNewMain from '@/manages/page/survey/newmain.vue'
// import SurveyAnswerList from '@/manages/page/survey/answerlist.vue'
// import SurveyDetail from '@/manages/page/survey/detail.vue'
// import SurveyReport from '@/manages/page/survey/report.vue'
// import SurveyAnswer from '@/manages/page/survey/answer.vue'

// 租户账户
import account from '@/manages/page/account/index.vue'
// 快递费用
import express from '@/manages/page/express/index.vue'
import expressSet from '@/manages/page/express/set.vue'

// import monitor from '@/manages/page/monitor/index.vue'
// 病历字典管理
import TemplateType from '@/form/page/anamnesistype/medicalmanageindex'
// 病历模版管理
import templateManage from '@/emr/page/template.manage'
// 病历系统配置
import MedicalSystemConfig from '@/form/page/medicalsystemconfig/manage.index'

// 集团供应商管理
import SupplierMangaes from '@/manages/page/supplier/index.vue'
import SupplierAdded from '@/manages/page/supplier/views/manages.supplieradd.vue'

// 调价历史
import PriceDetails from '@/rcm/page/tariffs/price.details/price.details.vue'
import PriceDetailsList from '@/rcm/page/tariffs/price.details/price.details.list.vue'

// 知识库
import diseaseRepository from '@/manages/page/repository/disease.vue'
import diagnosisRepository from '@/manages/page/repository/diagnosis.vue'
import drugRepository from '@/manages/page/repository/drug.vue'

// 供应商管理路由表
const SUPPLIER = [
  // 供应商列表
  {
    path: 'supplier',
    meta: {
      location: 'supplier'
    },
    component: SupplierMangaes
  },
  // 新增&编辑供应商
  {
    path: 'supplieradded/:id?',
    component: SupplierAdded,
    meta: {
      thirdActiveIndex: '/manages/supplier'
    }
  }
]
// 科室路由表
const DEPARTMENT = [
  // 排班预约-班次
  {
    path: 'workmain',
    name: 'workmain',
    component: Workmain,
    meta: {
      thirdActiveIndex: '/manages/workmain'
    }
  },
  // 排班预约-号别规则
  {
    path: 'numberrule',
    name: 'numberrule',
    component: Numbermain,
    meta: {
      thirdActiveIndex: '/manages/numberrule'
    }
  },
  // 排班预约-放号规则
  {
    path: 'appointmentrule',
    name: 'appointmentrule',
    component: Appointment,
    meta: {
      thirdActiveIndex: '/manages/appointmentrule'
    }
  },
  // 排班预约-好像是模板管理 4.11.1 by lvjiangtao@everjiankang.com 去掉这个路由
  // {
  //   path: 'templatemain',
  //   name: 'templatemain',
  //   component: Templatemain,
  //   meta: {
  //     thirdActiveIndex: '/manages/templatemain'
  //   }
  // },
  // 排班预约-门诊排班
  {
    path: 'operatingmain/out',
    name: 'operatingmain',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/out'
    }
  },
  // 排班预约-检查排班
  {
    path: 'operatingmain/examine',
    name: 'operatingmain_examine',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/examine'
    }
  },
  // 排班预约-检验排班
  {
    path: 'operatingmain/checkout',
    name: 'operatingmain_checkout',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/checkout'
    }
  },
  // 排班预约-治疗排班
  {
    path: 'operatingmain/treatment',
    name: 'operatingmain_treatment',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/treatment'
    }
  },
  // 排班预约-手术排班
  {
    path: 'operatingmain/surgery',
    name: 'operatingmain_surgery',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/surgery'
    }
  },
  // 排班预约-视频问诊排班
  {
    path: 'operatingmain/video',
    name: 'operatingmain_video',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/video'
    }
  },
  // 排班预约-图文问诊排班
  {
    path: 'operatingmain/imgtext',
    name: 'operatingmain_imgtext',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/imgtext'
    }
  },
  // 排班预约-在线咨询排班
  {
    path: 'operatingmain/online',
    name: 'operatingmain_online',
    component: Operatingmain,
    meta: {
      thirdActiveIndex: '/manages/operatingmain/online'
    }
  },
  // 排班预约-机构排班
  {
    path: 'organizationscheduling',
    name: 'organizationscheduling',
    component: Organizationscheduling,
    meta: {
      thirdActiveIndex: '/manages/organizationscheduling'
    }
  },
  // 排班预约-人员排班
  {
    path: 'personscheduling',
    name: 'personscheduling',
    component: Personscheduling,
    meta: {
      thirdActiveIndex: '/manages/personscheduling'
    }
  },
  // 预约排班-预约挂号规则
  {
    path: 'appointconfig',
    name: 'appointconfig',
    component: appointConfig
  },
  // 预约排班-匹配预约挂号规则
  {
    path: 'ruleslist',
    name: 'ruleslist',
    component: rulesList
  },
  // 物资字典-物资管理
  {
    path: 'material',
    meta: {
      location: 'material'
    },
    component: Material
  },
  // 物资字典-物资管理
  {
    path: 'materialconcise',
    name: 'materialconcise',
    meta: {
      thirdActiveIndex: '/manages/materialconcise'
    },
    component: MaterialConcise
  },
  // {
  //   path: 'materialfigure',
  //   component: MaterialConfigure,
  //   meta: {
  //     thirdActiveIndex: '/manages/material'
  //   }
  // },
  // 物资字典-物资管理编辑页面
  {
    path: 'materialinfo/:id?',
    name: 'materialinfo',
    component: MaterialInfo,
    meta: {
      location: 'material',
      thirdActiveIndex: '/manages/material'
    }
  },
  // 4.11.1 by lvjiangtao@everjiankang.com 废弃页面
  // {
  //   path: 'materials',
  //   name: 'materials',
  //   component: MaterialList,
  //   meta: {
  //     keepAlive: true
  //   }
  // },
  // 物资模版
  {
    path: 'materialtemplets',
    name: 'materialtemplets',
    component: MaterialTempletList
  },
  // 物资模版-编辑
  {
    path: 'materialtempletedit',
    name: 'materialtempletedit',
    component: MaterialTempletEdit,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  // 物资模版-编辑
  {
    path: 'tempdictionaryproperty/:id',
    name: 'tempdictionary_property',
    component: TempDictionaryProperty,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  // 物资模版-新建模版
  {
    path: 'tempdictionaryadd',
    name: 'tempdictionary_add',
    component: TempDictionary,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  // 物资模版-属性项设置
  {
    path: 'tempdictionary/:id',
    name: 'tempdictionary_id',
    component: TempDictionary,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  // 物资模版-模版编辑
  {
    path: 'tempdictionarysee/:id',
    name: 'tempdictionary_see',
    component: TempDictionarySee,
    meta: {
      thirdActiveIndex: '/manages/materialtemplets'
    }
  },
  // 物资字典-药理分类
  {
    path: 'agencypharmacologys',
    name: 'agencypharmacologys',
    component: AgencyPharmacologyList
  },
  // 物资字典-药理分类-查看已关联药品
  {
    path: 'agencyassociationdrugs/:id',
    name: 'agencyassociationdrugs',
    component: AgencyAssociationdDrugList,
    meta: {
      thirdActiveIndex: '/manages/agencypharmacologys'
    }
  },
]
// 机构管理路由表
const COLLECTION = [
  {
    path: 'organizationscustom',
    name: 'organizationscustom',
    component: OrganizationListCustom
  },
  // 跨机构供应-跨机构供应关系设置
  {
    path: 'organizationscross',
    name: 'organizationscross',
    component: OrganizationListCross
  },
  // 跨机构供应-跨机构供应关系设置-添加
  {
    path: 'organizationscrossadd',
    name: 'organizationscrossadd',
    component: OrganizationListCrossDetail,
    meta: {
      thirdActiveIndex: '/manages/organizationscross'
    }
  },
  // 跨机构供应-跨机构供应关系设置-编辑
  {
    path: 'organizationscrossdetail/:id',
    name: 'organizationscrossdetail',
    component: OrganizationListCrossDetail,
    meta: {
      thirdActiveIndex: '/manages/organizationscross'
    }
  },
  // 跨机构供应-库房权重设置
  {
    path: 'organizationscrossorder/:id',
    name: 'organizationscrossorder',
    component: OrganizationListCrossOrder,
    meta: {
      thirdActiveIndex: '/manages/organizationscross'
    }
  },
]
// 诊疗设置
const CLINIC_SETTING = [
  // 诊疗设置-servicePattern
  {
    path: 'processbind',
    component: processBindList,
    meta: { childNavPath: '/manages/processbindform/' }
  },
  // 诊疗设置-servicePattern-增加&编辑
  {
    path: 'processbindform/:id?',
    component: processBindForm,
    meta: { thirdActiveIndex: '/manages/processbind' }
  },
  // 频次管理（platform-core）
  {
    path: 'core-frequency',
    component: CoreFrequencyList
  },
  {
    path: 'core-frequency/:id',
    component: CoreFrequencyForm,
    meta: { thirdActiveIndex: '/manages/core-frequency' }
  },
  // 排斥组管理
  {
    path: 'exclude',
    component: excludeList
  },
  {
    path: 'exclude/:id',
    component: excludeForm,
    meta: { thirdActiveIndex: '/manages/exclude' }
  },
  // 检验耗材管理
  {
    path: 'mergeitems',
    component: mergeItemsList
  },
  {
    path: 'mergeitems/:id',
    component: mergeItemsForm,
    meta: { thirdActiveIndex: '/manages/mergeitems' }
  },
  // 用法管理
  {
    path: 'serviceusage',
    component: serviceusageList
  },
  {
    path: 'serviceusage/:id',
    component: serviceusageForm,
    meta: {
      thirdActiveIndex: '/manages/serviceusage'
    }
  },
  // 诊断分组管理
  {
    path: 'diagnosismanage',
    component: Diagnosismanage
  },
  // 诊断管理
  {
    path: 'groupdiagnosis',
    component: Groupdiagnosis
  },
  // 诊断配置
  {
    path: 'orgDiseaseConfig',
    component: orgDiseaseConfig
  },
  // 患者信息组件
  {
    path: 'commonhead/:index?', // 根据index展示tab
    name: 'commonhead',
    component: commonhead,
    meta: {
      childNavPath: '/manages/commonhead_edit',
      thirdActiveIndex: '/manages/commonhead',
    }
  },
  {
    path: 'configmanagesdetail/:code/:id?',
    name: 'configmanagesdetail',
    component: configManagesDetail,
    meta: {
      thirdActiveIndex: '/manages/commonhead'
    }
  },
  // 客户编号管理
  {
    path: 'member',
    name: 'membernumberlist',
    component: Membernumberlist
  },
  {
    path: 'member/membernumberedit',
    name: 'membernumberedit',
    component: Membernumberedit,
    meta: {
      thirdActiveIndex: '/manages/member'
    }
  },
  // 计费规则设置
  {
    name: 'billingrule',
    path: 'billingrule',
    component: billingrule,
    meta: {
      childNavPath: '/manages/billingrule_edit'
    }
  },
  {
    name: 'billingruleEdit',
    path: 'billingrule_edit/:orgType/:id',
    component: billingruleEdit,
    meta: {
      thirdActiveIndex: '/manages/billingrule'
    }
  },
  // 开单属性管理
  {
    path: 'schemamanage',
    component: schemaSetList,
    meta: {
      childNavPath: '/manages/schemaedit'
    }
  },
  {
    path: 'schemaedit/:id?',
    component: schemaSetEdit,
    meta: {
      thirdActiveIndex: '/manages/schemamanage'
    }
  },
  // 开单属性关联
  {
    path: 'schemarelate',
    component: schemaRelateList,
    meta: {
      childNavPath: '/manages/schemareledit'
    }
  },
  {
    path: 'schemareledit/:id?',
    component: schemaRelateEdit,
    meta: {
      thirdActiveIndex: '/manages/schemarelate'
    }
  },
  // 过敏规则
  {
    path: 'allergyrule',
    component: AllergyRule
  },
  {
    path: 'groupnurseautoprintset',
    component: NurseAutoprintSet,
    meta: {
      thirdActiveIndex: '/manages/groupnurseautoprintset'
    }

  },
  {
    path: 'groupyihuautoprintset',
    component: NurseAutoprintSet,
    meta: {
      thirdActiveIndex: '/manages/groupyihuautoprintset'
    }
  },
]

// 病历管理
const MEDICAL_MANAGE = [
  // 病历管理-病历字典管理
  {
    path: 'templatetype',
    component: TemplateType,
    meta: {
      workshopTag: 'groupManage',
      thirdActiveIndex: '/manages/templatetype'
    }
  },
  // 病历管理-病历模版管理
  {
    path: 'templatemanage',
    component: templateManage,
    meta: {
      workshopTag: 'groupManage',
      thirdActiveIndex: '/manages/templatemanage',
      rid: 'Auth_menu_manages_medicalrecord_template'
    }
  },
  // 病历管理-病历系统配置
  {
    path: 'medicalconfig',
    component: MedicalSystemConfig,
    meta: {
      workshopTag: 'groupManage',
      thirdActiveIndex: '/manages/medicalconfig',
      rid: 'Auth_menu_manages_medicalrecord_config'
    }
  }
]

// 医嘱字典
const SERVICE_DICTIONARY = [
  // 医嘱字典-医嘱项管理
  {
    name: 'prescription',
    path: 'prescription',
    component: ServiceManage,
    meta: {
      thirdActiveIndex: '/manages/prescription'
    }
  },
  // 医嘱字典-医嘱项管理-添加
  {
    name: 'prescriptionCreate',
    path: 'prescriptionadd',
    component: ServiceManageDetail,
    meta: { active: '/global/services/1', thirdActiveIndex: '/manages/prescription' }
  },
  // 医嘱字典-医嘱项管理-编辑
  {
    name: 'prescriptionEdit',
    path: 'prescription/editor/:id',
    component: ServiceManageDetail,
    meta: { active: '/global/services/2', thirdActiveIndex: '/manages/prescription' }
  },
  // 医嘱字典-组套管理
  {
    name: 'stack',
    path: 'stack',
    component: ServiceSetManage,
    meta: {
      thirdActiveIndex: '/manages/stack'
    }
  },
  // 医嘱字典-组套管理-添加
  {
    name: 'stackCreate',
    path: 'stackadd',
    component: ServiceSetManageDetail,
    meta: { active: '/global/services/1', thirdActiveIndex: '/manages/stack' }
  },
  // 医嘱字典-组套管理-编辑
  {
    name: 'stackEdit',
    path: 'stack/editor/:id',
    component: ServiceSetManageDetail,
    meta: { active: '/global/services/2', thirdActiveIndex: '/manages/stack' }
  },
]
let routerArr = [
  {
    path: '/manages/',
    component: GroupManage,
    redirect: '/manages/welcome',
    meta: {
      manage: true
    },
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      // 调价历史-详情
      {
        path: 'pricedetailslist',
        component: PriceDetailsList,
        meta: {
          isTenant: true,
          pathVal: 'manages',
        }
      },
      // 调价历史
      {
        path: 'pricelist', // 不带头部返回111
        component: PriceDetailsList,
        meta: {
          isTenant: true,
          pathVal: 'manages',
          noHead: true
        }
      },
      // 调价历史-详情
      {
        path: 'pricedetails',
        component: PriceDetails,
        meta: {
          notFull: true,
          secActiveIndex: '/manages/pricelist'
        }
      },
      // 集团管控-集中管控开关
      {
        path: 'configure',
        component: Configure
      },
      // 新建科室 动态增加schema tocheck 没找到到入口
      {
        path: 'formdemo/:id?',
        name: 'form',
        alias: 'form',
        component: FormDemo
      },
      {
        path: 'routerback',
        name: 'routerback',
        component: RouterBack
      },
      // 4.11.1 by lvjiangtao@everjiankang.com 集团工作站下面无相关路由
      // {
      //   path: 'idcards',
      //   name: 'idcards',
      //   component: IdCardList,
      //   meta: {
      //     thirdActiveIndex: '/manages/idcards'
      //   }
      // },
      // {
      //   name: 'idcard',
      //   path: 'idcard',
      //   component: IdCardContent,
      //   meta: {
      //     thirdActiveIndex: '/manages/idcards'
      //   }
      // },
      // {
      //   path: 'idcardedit/:code',
      //   name: 'idcardedit',
      //   component: IdCardContent,
      //   meta: {
      //     thirdActiveIndex: '/manages/idcards'
      //   }
      // },
      // 活动管理
      {
        path: 'activitys',
        name: 'activitys',
        component: Activitys,
        meta: {
          thirdActiveIndex: '/manages/activitys'
        }
      },
      // 活动管理-新增
      {
        path: 'activityadd',
        name: 'activityadd',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/manages/activitys'
        }
      },
      // 活动管理-详情
      {
        path: 'activitydetail/:code',
        name: 'activitydetail',
        component: ActivityContent,
        meta: {
          thirdActiveIndex: '/manages/activitys'
        }
      },
      // 套餐管理
      {
        path: 'packagemanage',
        name: 'packagemanage',
        component: PackageManage,
        meta: {
          thirdActiveIndex: '/manages/packagemanage'
        }
      },
      // 套餐管理-新建套餐
      {
        path: 'marketingpackageadd',
        component: MarketingPackage,
        meta: {
          source: 'manages',
          thirdActiveIndex: '/manages/packagemanage',
          isAdd: 1
        }
      },
      // 套餐管理-编辑套餐
      {
        path: 'marketingpackageedit',
        component: MarketingPackage,
        meta: {
          source: 'manages',
          thirdActiveIndex: '/manages/packagemanage'
        }
      },
      // 随访路由
      {
        path: 'follow/template',
        component: FollowTemplate,
        meta: {
          thirdActiveIndex: '/manages/follow/template'
        }
      },
      // 随访路由
      {
        path: 'follow/template/detail/:id?/:categoryId?',
        component: FollowTemplateDetail,
        meta: {
          thirdActiveIndex: '/manages/follow/template'
        }
      },
      ...DEPARTMENT,
      ...organizationRouteList,
      // 知识库管理
      {
        path: 'repository',
        name: 'repository',
        component: diseaseRepository,
        children: [
          // 知识库管理-疾病知识库
          {
            path: 'disease',
            name: 'disease',
            component: diseaseRepository,
            meta: {
              type: 1
            }
          },
          // 知识库管理-诊疗知识库
          {
            path: 'diagnosis',
            name: 'diagnosis',
            component: diagnosisRepository,
            meta: {
              type: 2,
            }
          },
          // 知识库管理-药品知识库
          {
            path: 'drug',
            name: 'drug',
            component: drugRepository,
            meta: {
              type: 3
            }
          }
        ]
      },
      ...SUPPLIER,
      ...SERVICE_DICTIONARY, // 医嘱字典
      {
        path: 'surveynew',
        component: SurveyNewMain,
      },
      // {
      //   path: 'survey',
      //   component: SurveyMain,
      //   children: [
      //     {
      //       path: '',
      //       name: 'survey',
      //       component: Survey,
      //       meta: {
      //         thirdActiveIndex: '/manages/survey'
      //       }
      //     },
      //     {
      //       path: 'answerList',
      //       name: 'surveyAnswerList',
      //       component: SurveyAnswerList,
      //       meta: {
      //         thirdActiveIndex: '/manages/survey'
      //       }
      //     },
      //     {
      //       path: 'detail/:surveyId',
      //       name: 'surveyDetail',
      //       component: SurveyDetail,
      //       meta: {
      //         thirdActiveIndex: '/manages/survey'
      //       }
      //     },
      //     {
      //       path: 'report/:surveyId',
      //       name: 'surveyReport',
      //       component: SurveyReport,
      //       meta: {
      //         thirdActiveIndex: '/manages/survey'
      //       }
      //     },
      //     {
      //       path: 'answer/:surveyId',
      //       name: 'surveyAnswer',
      //       component: SurveyAnswer,
      //       meta: {
      //         thirdActiveIndex: '/manages/survey'
      //       }
      //     },
      //   ],
      // },
      ...MESSAGECENTER({
        thirdActiveIndex: '/manages/message',
        msgListRid: 'Auth_menu_manages_message'
      }),
      ...COLLECTION,
      ...CLINIC_SETTING, // 诊疗设置
      ...MEDICAL_MANAGE, // 病历模版
      // 大客户管理
      {
        path: 'keyAccountManage',
        redirect: 'keyAccountManage/profiles',
        component: keyAccountManage,
        children: [
          // 大客户管理-大客户档案
          {
            path: 'profiles',
            component: profiles
          },
          // 大客户管理-大客户档案-新增
          {
            name: 'profileadd',
            path: 'profileadd',
            component: profile,
            meta: {
              thirdActiveIndex: '/manages/keyAccountManage/profiles'
            }
          },
          // 大客户管理-大客户档案-编辑
          {
            path: 'profiles/:id',
            component: profile,
            meta: {
              thirdActiveIndex: '/manages/keyAccountManage/profiles'
            }
          },
          // 大客户管理-报销方案
          {
            path: 'welfare',
            component: welfareProgrammes
          },
          // 大客户管理-报销方案-新增
          {
            name: 'welfareadd',
            path: 'welfareadd',
            component: welfare,
            meta: {
              thirdActiveIndex: '/manages/keyAccountManage/welfare'
            }
          },
          // 大客户管理-报销方案-编辑
          {
            path: 'welfare/:id',
            component: welfare,
            meta: {
              thirdActiveIndex: '/manages/keyAccountManage/welfare'
            }
          }
        ]
      },
      // 租户账户
      {
        path: 'account',
        component: account
      },
      // 快递费用
      {
        path: 'express',
        component: express
      },
      // 快递费用-设置
      {
        path: 'express_set',
        component: expressSet
      },
      // {
      //   path: 'monitor',
      //   component: monitor
      // }
    ]
  },
]
export default routerArr
