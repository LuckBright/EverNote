import Welcome from '@/login/page/welcome'
import Warehouse from '../page/warehouse'
import StorageRoom from '../page/storageroom'
import StorageRoomAdd from '../page/storageroom.new'
import StorageRoomList from '../page/storageroomlist'
import StorageRoomSystemConfig from '../page/storageroom.systemconfig'
// import Manufacturer from '../page/manufacturer'
// import ManufacturerList from '../page/manufacturerlist'

// SRM 院内供应关系
import Organization from '@/warehouse/views/organization/router/index.js'

// 诊疗设置
import Commondiagnosis from '@/sob/page/commondiagnosis'
// import WristbandSettings from '@/sob/page/wristband/settings'
import Medicalrecords from '@/sob/page/medicalrecords'
// import Inspect from '../page/inspect'
// import InspectList from '../page/inspectlist'
// import InspectDetail from '../page/inspectdetail'

// 机构设置
// import ManufacturerCheck from '../page/manufacturermanage/manufacturercheck'

// 物资列表
// import MaterialTableList from '../page/materialtable/materialtablelist'
// import CreateMaterial from '../page/materialtable/creatematerial'
// import MaterialSee from '../page/materialtable/materialsee'

// 物资设置
// import MaterialBusiness from '../page/institutionmaterial/materialbusiness'
import MaterialLists from '../page/institutionmaterial/materiallist'
const MaterialListPrice = () => import('@/warehouse/page/institutionmaterial/materialist.price.vue')
import MaterialListsee from '../page/institutionmaterial/materialsee'
import MaterialDetail from '../page/institutionmaterial/materialdetail'
// import RelationMaterial from '../page/institutionmaterial/relationmaterial'
// import DictionarySee from '@/warehouse/page/groupmaterial/dictionarysee'

// 终端管理
import DeviceList from '@/warehouse/page/devicemanage/view/devicelist.vue'
import SelfhelpMechineCon from '@/warehouse/page/devicemanage/view/selfhelpcon.vue'
import LargescreenCon from '@/warehouse/page/devicemanage/view/largescreencon.vue'

// 分诊设置
import TriageSetting from '@/arrange/page/triage/triagesetting.vue'

// phr 模版
// import phrtpllist from '@/form/page/phrtpllist'

// 短信管理路由表
import MESSAGECENTER from '@/msgcenter/router/index.js'

// 数据导入路由表
import DATAIMPORT from '@/warehouse/page/dataimport/router/index'

// 日志
import PatientLog from '../page/patientlog.vue'
// 中转路由
import routerBack from '@/manages/components/router.back'

// 打印路由
import PRINTROUTER from '@/print/router'
import organizationRouteList from '@/manages/router/oss'

// 建筑 病区 病房 床位 等等
import buildingRouter from '@/warehouse/page/building/router/router'
// 长春医保签到
import insurancesignin from '@/rcm/page/insurancesignin'
// 医保目录对照
import medicalItemList from '@/rcm/otmdiscomponent/medicalitemlist.vue'

// 医保对账数据上传
import reconciliationUpload from '@/rcm/otmdiscomponent/reconciliation/data.upload.vue'
// 医保对账费用申报
import costDeclaration from '@/rcm/otmdiscomponent/reconciliation/cost.declaration.vue'
// 医保审批管理 转院审批
import transferApproval from '@/rcm/otmdiscomponent/insurance-approval/transfer-approval'
// 医保审批管理 疾病审批上报
import diseaseApproval from '@/rcm/otmdiscomponent/insurance-approval/disease-approval'
// 病历模版
import MEDICAL_MANAGE from '@/warehouse/router/medicalmanage'

// 诊断管理
import Groupdiagnosis from '@/warehouse/page/group/view/diagnosisgroup/groupdiagnosis'
import Diagnosismanage from '@/warehouse/page/group/view/diagnosisgroup/diagnosismanage'
import diseaseConfig from '@/warehouse/page/group/view/diagnosisgroup/disease-config'

/* ---------------诊疗设置---------------- */
// 医嘱项管理
import ServiceManageList from '@/sob/page/service.manage/list'
// import ServiceManageCreate from '@/sob/page/service.manage/create.form'
import ServiceManageEdit from '@/sob/page/service.manage/edit.form'
// 组套管理
import Serviceset from '@/sob/page/serviceset.manage/form'
import ServicesetList from '@/sob/page/serviceset.manage/list'
// 门急诊医生自动打印
import AutoprintSet from '@/sob/page/autoprint.set'
// 住院医护打印、门急诊医生打印规则
import NurseAutoprintSet from '@/sob/page/nurseautoprint.set'
// 计费规则设置
import billingrule from '@/warehouse/page/group/view/billing/billingrule'
// 附加费管理
import surchargeLayOut from '@/sob/page/service.surcharge/surcharge.layout.vue'
// 附加费管理 - 用法管理
// import serviceusageList from '@/sob/page/service.usage/list'
import serviceusageForm from '@/sob/page/service.usage/form'
// 附加费管理 - 煎法管理
// import serviceDecoctList from '@/sob/page/service.surcharge/decoct.vue'
// 调价历史
import PriceDetails from '@/rcm/page/tariffs/price.details/price.details.vue'
import PriceDetailsList from '@/rcm/page/tariffs/price.details/price.details.list.vue'

// 显著医保报账
import xzCostDeclaration from '@/rcm/otmdiscomponent/xz.reconciliation/xz.cost.declaration'
import xzCostSupplement from '@/rcm/otmdiscomponent/xz.reconciliation/xz.cost.supplement'

// 蛟河的对账报表
import jljhybSettleInfo from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-ybsettleinfo.vue'
import jljhInhosQuery from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-inhosquery.vue'
import jljhApproval from '@/rcm/otmdiscomponent/jljhmedical/jljh-report/jljh-approval.vue'

// 第三方对接配置
import TechThirdConfig from '@/systemset/page/otherfeature/tech.third.config.vue'

export default [
  {
    path: '/warehouse',
    redirect: '/warehouse/welcome',
    name: 'warehouse',
    component: Warehouse,
    children: [
      {
        path: 'welcome',
        name: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'routerback',
        name: 'routerback',
        component: routerBack
      },
      ...MEDICAL_MANAGE,
      ...buildingRouter,
      ...DATAIMPORT({
        thirdActiveIndex: '/warehouse/dataimport/list'
      }),
      ...MESSAGECENTER({
        thirdActiveIndex: '/warehouse/message',
        msgListRid: 'Auth_menu_clinic_messageset'
      }),
      ...PRINTROUTER(),
      ...organizationRouteList,

      // SRM 院内供应关系
      ...Organization,
      {
        path: 'pricedetailslist',
        component: PriceDetailsList,
        meta: {
          isTenant: false,
          pathVal: 'warehouse'
        }
      },
      {
        path: 'pricelist', // 不带头部返回
        component: PriceDetailsList,
        meta: {
          isTenant: false,
          pathVal: 'warehouse',
          noHead: true
        }
      },
      {
        path: 'pricedetails',
        component: PriceDetails
      },
      // {
      //   path: 'materialtables',
      //   name: 'materialtables',
      //   component: MaterialTableList,
      //   redirect: '/warehouse/materialtables/drugs',
      //   children: [
      //     {
      //       path: 'drugs',
      //       name: 'materialDrugs',
      //       component: MaterialTableList
      //     },
      //     {
      //       path: 'expandables',
      //       name: 'materialExpandables',
      //       component: MaterialTableList
      //     },
      //     {
      //       path: 'equipments',
      //       name: 'materialEquipments',
      //       component: MaterialTableList
      //     }
      //   ]
      // },
      // {
      //   path: 'busienss',
      //   name: 'busienss',
      //   component: MaterialBusiness
      // },
      {
        path: 'materiallists/unifiedpricing',
        name: 'unifiedpricing',
        component: MaterialLists,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'materiallists/batchpriceings',
        name: 'batchpriceings',
        component: MaterialListPrice,
        meta: {
          keepAlive: true
        }
      },
      // {
      //   path: 'relationmaterial',
      //   name: 'relationmaterial',
      //   component: RelationMaterial,
      //   meta: {
      //     thirdActiveIndex: '/warehouse/materiallists'
      //   }
      // },
      {
        path: 'materialdetail/:id?',
        name: 'materialdetail',
        component: MaterialDetail,
        meta: {
          thirdActiveIndex: '/warehouse/materiallists/unifiedpricing'
        }
      },
      {
        path: 'materiallistsee/:id',
        name: 'materiallistsee',
        component: MaterialListsee,
        meta: {
          thirdActiveIndex: '/warehouse/materiallists'
        }
      },
      // {
      //   path: 'dictionarysee/:id',
      //   name: 'dictionarysee',
      //   component: DictionarySee,
      //   meta: {
      //     thirdActiveIndex: '/warehouse/materiallists'
      //   }
      // },
      {
        path: 'materiallistsnew',
        name: 'materiallistsnew',
        component: MaterialLists
      },
      // {
      //   path: 'materialsee/:id',
      //   name: 'materialsee',
      //   component: MaterialSee
      // },
      // {
      //   path: 'creatematerialadd',
      //   name: 'creatematerialadd',
      //   component: CreateMaterial
      // },
      // 库房管理
      {
        path: 'storageroomadd',
        component: StorageRoomAdd,
        meta: {
          thirdActiveIndex: '/warehouse/storagerooms'
        }
      },
      {
        path: 'storagerooms/:id',
        component: StorageRoom,
        meta: {
          thirdActiveIndex: '/warehouse/storagerooms'
        }
      },
      {
        path: 'storagerooms',
        component: StorageRoomList
      },
      {
        path: 'storageroomconfig',
        meta: {
          thirdActiveIndex: '/warehouse/storageroomconfig'
        },
        component: StorageRoomSystemConfig
      },
      // 生产厂商管理
      // {
      //   path: 'manufactureradd',
      //   component: Manufacturer,
      //   meta: {
      //     thirdActiveIndex: '/warehouse/manufacturers'
      //   }
      // },
      // {
      //   path: 'manufacturers/:id',
      //   component: Manufacturer,
      //   meta: {
      //     thirdActiveIndex: '/warehouse/manufacturers'
      //   }
      // },
      // {
      //   path: 'manufacturers',
      //   component: ManufacturerList
      // },
      /* -----------------诊疗设置------------------------ */
      {
        path: 'services/:belong',
        component: ServiceManageList,
        meta: {
          thirdActiveIndex: '/warehouse/services/2'
        }
      },
      {
        path: 'services/:belong/:id',
        component: ServiceManageEdit,
        meta: {
          thirdActiveIndex: '/warehouse/services/2'
        }
      },
      {
        path: 'serviceset/:belong',
        component: ServicesetList,
        meta: {
          thirdActiveIndex: '/warehouse/serviceset/2'
        }
      },
      {
        path: 'serviceset/:belong/:id',
        component: Serviceset,
        meta: {
          thirdActiveIndex: '/warehouse/serviceset/2'
        }
      },
      // 门诊医生自动打印
      {
        path: 'autoprintset',
        component: AutoprintSet
      },
      // 住院医护打印配置
      {
        path: 'nurseautoprintset',
        component: NurseAutoprintSet,
        meta: {
          thirdActiveIndex: '/warehouse/nurseautoprintset'
        }
      },
      // 计费规则配置
      {
        path: 'billingrule',
        component: billingrule
      },
      // 门急诊医生打印规则
      {
        path: 'yihuautoprintset',
        component: NurseAutoprintSet,
        meta: {
          thirdActiveIndex: '/warehouse/yihuautoprintset'
        }
      },
      // 附加费管理(用法管理，煎法管理)
      {
        path: 'surcharge',
        component: surchargeLayOut
      },
      {
        path: 'surcharge/:id',
        component: serviceusageForm,
        meta: {
          thirdActiveIndex: '/warehouse/surcharge?type=usage'
        }
      },
      {
        path: 'techthirdconfig',
        name: 'techthirdconfig',
        component: TechThirdConfig,
        meta: {
          thirdActiveIndex: '/warehouse/techthirdconfig'
          // Auth_menu_clinic_medicalset_techthirdconfig
          // 第三方对接设置
        }
      },
      /* -----------------诊疗设置 end------------------------ */
      // 常用诊断
      {
        path: 'commondiagnosis',
        component: Commondiagnosis
      },
      // {
      //   name: 'phrtpllist',
      //   path: 'phrtpllist',
      //   component: phrtpllist,
      //   meta: {
      //     thirdActiveIndex: '/warehouse/phrtpllist'
      //   }
      // },
      {
        path: 'medicalrecords',
        name: 'medicalrecords',
        component: Medicalrecords
      },
      // 检验项目管理
      // {
      //   path: 'inspects',
      //   component: InspectList
      // },
      // {
      //   path: 'inspectadd',
      //   component: Inspect
      // },
      // {
      //   path: 'inspects/:id',
      //   component: Inspect
      // },
      // {
      //   path: 'inspectdetail/:id',
      //   component: InspectDetail
      // },
      // {
      //   path: 'manufacturercheck/:id',
      //   component: ManufacturerCheck
      // },
      // 腕带管理 （腕带设置在打印工具里面配置，这是原来的配置，4.11.1去掉 by lvjiangtao@everjiankang.com）
      // {
      //   path: 'wristband',
      //   component: WristbandSettings
      // },
      // 新建自助机
      {
        path: 'selfhelpmechinecon',
        name: 'selfhelpmechinecon',
        component: SelfhelpMechineCon,
        meta: {
          thirdActiveIndex: '/warehouse/devicelist'
        }
      },
      // 自助机大屏列表
      {
        path: 'devicelist',
        name: 'devicelist',
        component: DeviceList,
        meta: {
          thirdActiveIndex: '/warehouse/devicelist'
        }
      },
      // 新建大屏
      {
        path: 'largescreencon',
        name: 'largescreencon',
        component: LargescreenCon,
        meta: {
          thirdActiveIndex: '/warehouse/devicelist'
        }
      },
      // 分诊设置
      {
        path: 'triagesetting',
        name: 'triagesetting',
        component: TriageSetting
      },
      // 日志列表
      {
        path: 'log',
        name: 'log',
        component: PatientLog,
      },
      // 医保签到
      {
        path: 'insurancesignin',
        name: 'insurancesignin',
        component: insurancesignin,
      },
      {
        path: 'xzcostsupplement',
        component: xzCostSupplement
      },
      {
        path: 'xzcostdeclaration',
        component: xzCostDeclaration
      },
      // 医保目录对照
      {
        path: 'medicalItemList',
        component: medicalItemList
      },
      // 数据上传
      {
        path: 'reconciliationupload',
        component: reconciliationUpload
      },
      {
        path: 'diseaseapproval',
        component: diseaseApproval
      },
      {
        path: 'transferapproval',
        component: transferApproval
      },
      {
        path: 'costdeclaration',
        component: costDeclaration
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
      // 诊断版本配置
      {
        path: 'diseaseconfig',
        component: diseaseConfig
      },
      // 吉林蛟河
      {
        path: 'jljhybSettleInfo',
        component: jljhybSettleInfo
      },
      {
        path: 'jljhInhosQuery',
        component: jljhInhosQuery
      },
      {
        path: 'jljhApproval',
        component: jljhApproval
      }
    ]
  }
]
