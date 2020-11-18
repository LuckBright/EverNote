import kanban from '../page/kanbanframe'
import Welcome from '@/login/page/welcome'
import servicePanel from '@/workspace/page/service.panel/list' // 服务看板入口
import Report from '@/arrange/page/reservation/report.vue' // 客服工作站 检查检验报告解读
import Appointregister from '@/arrange/page/reservation/appointregister.vue' // 预约记录
import Appointpanel from '@/arrange/page/appoint/appointpanel.vue' // 预约看板
import Registerpanel from '@/arrange/page/appoint/registerpanel.vue' // 预约看板
import AppointInspect from '@/arrange/page/appoint/appoint-inspect.vue' // 预约检查
import Appointcheck from '@/arrange/page/reservation/appointcheck.vue' // 预约体检
// import Triage from '@/arrange/page/triage/triage.vue' // 门诊分诊
// import MedicalTriage from '@/arrange/page/triage/medicaltriage.vue' // 医技分诊
// import nursemain from '@/arrange/page/nurse/nurse-scheduling.vue' // 护士排班
// import assistant from '@/arrange/page/scheduling/assistant.vue' // 助理排班
// import RoomSetting from '@/arrange/page/setting/roomsetting.vue' // 门诊医生排班-诊室分配
// import RoomRules from '@/arrange/page/setting/roomrules.vue' // 诊室规则维护

import PackageSaleList from '@/crm/page/packagesale/packagesalelist' // 套餐下单-个人下单
import OrderDetails from '@/crm/page/packagesale/orderdetails'// 订单详情
import UseDetailList from '@/crm/page/packagesale/usedetailsinfo'
import PackageInfo from '@/crm/page/packagesale/packageinfo'
/*
import GroupPackageSaleList from '@/crm/page/packagesale/grouppackagesalelist'
import GroupMaintainList from '@/crm/page/packagesale/groupmaintainlist' // 团体下单
*/

import UploadInfo from '@/crm/page/packagesale/uploadinfo' // 团体维护
import Triage from '@/arrange/page/triage/standard.triage.vue' // 门诊分诊
// import TriageSetting from '@/arrange/page/triage/triagesetting.vue' // 门诊分诊
import planList from '@/card/page/marketingpackage/guaranteeplan/planlist.vue'
import planDetails from '@/card/page/marketingpackage/guaranteeplan/plandetails.vue'
import MarketingPackage from '@/card/page/marketingpackage/marketingpackagedetail'
export default [
  {
    path: '/kanban',
    name: 'kanban',
    redirect: '/kanban/welcome',
    component: kanban,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      // 当日患者
      {
        path: 'service',
        name: 'service',
        component: servicePanel
      },
      // 预约记录
      {
        path: 'appoint',
        name: 'appoint',
        component: kanban,
        redirect: '/appoint/appointlist',
        children: [
          // 预约记录-门诊预约
          {
            path: 'appointlist',
            name: 'appointlist',
            component: Appointregister
          },
          // 预约记录- 检查预约(type=2,scene=1) 治疗预约(type=3,scene=1) 门诊手术(type=4,scene=1) 检查预约（住院）(type=2,scene=3) 治疗预约（住院）(type=3,scene=3)
          {
            path: 'appointinspect/:type/:scene/',
            name: 'appointinspect',
            component: AppointInspect
          }
        ]
      },
      // 检查检验报告解读
      {
        path: 'report',
        name: 'report',
        component: Report
      },
      // 预约看板
      {
        path: 'appointpanel',
        name: 'appointpanel',
        component: Appointpanel
      },
      // 号片预约
      {
        path: 'registerpanel',
        name: 'registerpanel',
        component: Registerpanel
      },
      // 预约体检(tocheck 没找到入口)
      {
        path: 'appointcheck',
        name: 'appointcheck',
        component: Appointcheck
      },
      // 分诊台
      {
        path: 'triage',
        name: 'triage',
        component: Triage
      },
      // 保障计划下单 kanban/guaranteeplanlist
      {
        path: 'guaranteeplanlist',
        name: 'guaranteeplanlist',
        meta: {
          type: 'plan'
        },
        component: kanban,
        children: [
          {
            path: 'order',
            name: 'order',
            component: PackageSaleList,
            meta: {
              type: 'plan',
              thirdActiveIndex: '/kanban/guaranteeplanlist/order'
            }
          }
        ]
      },
      // 套餐下单
      {
        path: 'package',
        name: 'package',
        component: kanban,
        children: [
          // 套餐下单-订单管理
          {
            path: 'order',
            name: 'order',
            component: PackageSaleList,
            meta: {
              thirdActiveIndex: '/kanban/package/order'
            }
          },
          // 套餐下单-保障计划任务管理
          {
            path: 'plan',
            name: 'plan',
            component: planList,
            meta: {
              thirdActiveIndex: '/kanban/package/plan'
            }
          },
          // 套餐下单-保障计划任务管理-详情
          {
            path: 'plandetails/:id',
            name: 'plandetails',
            component: planDetails,
            meta: {
              thirdActiveIndex: '/kanban/package/plan'
            }
          }
        ]
      },
      // 分诊设置，（迁移到机构设置下面）
      // {
      //   path: 'triageSetting',
      //   name: 'triageSetting',
      //   component: TriageSetting
      // },
      // {
      //   path: 'medicaltriage',
      //   name: 'medicaltriage',
      //   component: MedicalTriage
      // },
      // {
      //   name: 'nursemain',
      //   path: 'nursemain',
      //   component: nursemain
      // },
      // {
      //   name: 'assistant',
      //   path: 'assistant',
      //   component: assistant
      // },
      // {
      //   name: 'roomsetting',
      //   path: 'roomsetting',
      //   component: RoomSetting
      // },
      // {
      //   name: 'roomrules',
      //   path: 'roomrules',
      //   component: RoomRules
      // },
      // 套餐下单-订单管理-订单详情
      {
        path: 'orderdetails/:combinationId',
        name: 'orderdetails',
        component: OrderDetails,
        meta: {
          thirdActiveIndex: '/kanban/package/order'
        }
      },
      // 保障计划-订单管理-订单详情
      {
        path: 'planorderdetails/:combinationId',
        name: 'planorderdetails',
        component: OrderDetails,
        meta: {
          thirdActiveIndex: '/kanban/guaranteeplanlist',
          type: 'plan'
        }
      },
      // 套餐下单-订单管理-使用详情
      {
        path: 'usedetails/:id/:setMealId',
        name: 'usedetails',
        component: UseDetailList,
        meta: {
          type: 'package',
          thirdActiveIndex: '/kanban/package/order'
        }
      },
      // 保障计划-订单管理-使用详情
      {
        path: 'planusedetails/:id/:setMealId',
        name: 'usedetails',
        component: UseDetailList,
        meta: {
          type: 'plan',
          thirdActiveIndex: '/kanban/guaranteeplanlist'
        }
      },
      // 套餐下单-订单管理-套餐详情
      {
        path: 'packageinfo/:id/:setMealId',
        name: 'packageinfo',
        component: PackageInfo,
        meta: {
          thirdActiveIndex: '/kanban/package/order'
        }
      },
      // 保障计划-订单管理-套餐详情
      {
        path: 'planpackageinfo/:id/:setMealId',
        name: 'planpackageinfo',
        component: PackageInfo,
        meta: {
          type: 'plan',
          thirdActiveIndex: '/kanban/guaranteeplanlist'
        }
      },
      // 人员导入-套餐代码有调用这个路由
      {
        path: 'uploadinfo/:id',
        name: 'uploadinfo',
        component: UploadInfo,
      },
      // 保障计划修改任务详情
      {
        path: 'ordermarketingplanedit',
        name: 'ordermarketingplanedit',
        component: MarketingPackage,
        meta: {
          type: 'plan',
        }
      }
    ]
  }
]
