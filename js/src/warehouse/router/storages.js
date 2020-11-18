import Warehouse from '../page/warehouse'
import Home from '../page/storages/home'
import OutPut from '../page/storages/output'
import OutPuts from '../page/storages/output/outputlist'
import OutPutSee from '../page/storages/output/outputsee'
import OutPutEdit from '../page/storages/output/outputedit'
// import OutPutNewEdit from '../page/storages/output/outputnewedit'
// import OutPutOther from '../page/storages/output/outputother'
import Entry from '../page/storages/entry'
import Entrys from '../page/storages/entry/entrylist'
import EntryAdd from '../page/storages/entry/entrynew'
import EntrySee from '../page/storages/entry/entrysee'
import EntryEdit from '../page/storages/entry/entryedit'
import EntryOld from '../page/storages/entry/entryold'
import EntryNews from '../page/storages/entry/entry'
import PurchaseSee from '../page/storages/entry/purchase.see'
import PurchaseEntry from '../page/storages/entry/purchase.entry'
import EntryOther from '../page/storages/entry/entryother'
import EntryNewOther from '../page/storages/entry/entrynewother'
import Business from '../page/storages/business'
import ApplyBusinesses from '../page/storages/business/applybusinesslist'
// import ApplyBusiness from '../page/storages/business/applybusiness'
// 新版申领
const ApplyDismantle = () => import('@/warehouse/page/storages/business/applydismantleadd.vue')

import RetiringBusinesses from '../page/storages/business/retiringbusinesslist'
// import RetiringBusiness from '../page/storages/business/retiringbusiness'
import ReturnBusinesses from '../page/storages/business/returnbusinesslist'
import ReturnBusiness from '../page/storages/business/returnbusiness.new'
import ReturnBusinesSee from '../page/storages/business/returnbusiness.see'
import Splits from '../page/storages/business/splitlist'
import Split from '../page/storages/business/split'
import SplitSee from '../page/storages/business/splitsee'
import Allocations from '../page/storages/business/allocations'
import Allocation from '../page/storages/business/allocationadd'
import Allocationess from '../page/storages/business/allocationess'
import DestroyBusinesses from '../page/storages/business/destroybusinesslist'
import DestroyBusiness from '../page/storages/business/destroybusiness.new'
import DestroyBusinessee from '../page/storages/business/destroybusiness.see'
import Query from '../page/storages/query'
import Querys from '../page/storages/query/inventoryquery'
import QueryEnter from '../page/storages/query/enterpinlivequery'
import QueryEnterDetails from '../page/storages/query/enterpinlivedetails'
import QueryCommodityFlow from '../page/storages/query/commodityflowquery'
import Warning from '../page/storages/warning'
import InventoryWarn from '../page/storages/warning/inventorywarn'
import VlidityWarn from '../page/storages/warning/validitywarn'
import InventoryManage from '../page/storages/warning/inventorymanage'
import SafeStockFit from '../page/storages/warning/inventorymanage/safestockfit'
import MiniStockFit from '../page/storages/warning/inventorymanage/ministockfit'
import Check from '../page/storages/check'
import CheckList from '../page/storages/check/checklist'
import CheckStockTaking from '../page/storages/check/checkstocktaking'
import checkstocktakingAdd from '../page/storages/check/checkstocktakingadd'
// 4.11.1 编码工具暂时注释掉 by lvjiangtao@everjianakng.com
// import Code from '../page/storages/code'
import Reload from '../page/storages/reload'
// 4.11.1 编码工具暂时注释掉 by lvjiangtao@everjianakng.com
// import Tools from '../page/storages/toolpools'

// import ReportForm from '../page/storages/reportform'
// import Outpatient from '../page/storages/reportform/outpatient'
import catalog from '@/bi/page/catalog'
// import DispensingHospital from '../page/storages/dispensinghospital'

// 住院发药 退药
// import BackDrug from '../page/storages/dispensings/ipd/back.drug'

// 货位管理
import CommodityManage from '../page/storages/commoditymanage'
import CommodityLocationList from '../page/storages/commoditylocation/commoditylocationlist'
import CommodityLocation from '../page/storages/commoditylocation/commoditylocation'

// 采购
import Procurement from '../page/storages/business/procurement'
import ProcurementList from '../page/storages/business/procurement/procurementlist'
import ProcurementDetail from '../page/storages/business/procurement/procurementdetail'
// 新版门诊发药 2019-01-07  （OPD门诊）
// import OPDAccepting from '../page/storages/dispensings/opd/opd.accepting' // 收方发药
// import OPDTaskPrint from '../page/storages/dispensings/opd/opd.task.print' // 任务打印
// import OPDPrescription from '../page/storages/dispensings/opd/opd.prescription' // 处方／院内发药
// import OPDPrescriptionDispensing from '../page/storages/dispensings/opd/opd.prescription.dispensing' // 单人操作  处方发药
// import OPDSearchPrescription from '../page/storages/dispensings/opd/opd.search.prescription' // 处方查询
// import OPDSearchPatient from '../page/storages/dispensings/opd/opd.search.patient' // 患者查询
// import OPDreSearch from '../page/storages/dispensings/opd/opd.research' // 数据查询
// import OPDBack from '../page/storages/dispensings/opd/opd.back' // 门诊退药
// import OPDMail from '../page/storages/dispensings/opd/opd.mail'

// 新版住院发药 2019-01-016  （iPD门诊）
// import IPDDebit from '../page/storages/dispensings/ipd/ipd.debit' // 任务打印
// import IPDPrepare from '../page/storages/dispensings/ipd/ipd.prepare' // 自备药管理
// import IPDPrescription from '../page/storages/dispensings/ipd/ipd.prescription' // 住院发药
// import IPDDrugDispensing from '../page/storages/dispensings/ipd/ipd.drug.dispensing' // 药包发药
// import IPDAbnormal from '../page/storages/dispensings/ipd/ipd.abnormal' // 异常任务
// import IPDSearch from '../page/storages/dispensings/ipd/ipd.search' // 药包查询
// import IPDSearchPrescription from '../page/storages/dispensings/ipd/ipd.search.prescription' // 处方查询
// import IPDSearchPatient from '../page/storages/dispensings/ipd/ipd.search.patient' // 患者查询

// 批次定价路由
import BATCH_PRICE from '@/warehouse/router/batch.storages.js'

export default [
  {
    path: '/storages',
    component: Warehouse,
    name: 'storages',
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
          thirdActiveIndex: '/storages/home'
        }
      },
      // 编码工具
      // {
      //   path: 'tools',
      //   name: 'tools',
      //   component: Tools,
      //   redirect: '/storages/tools/code',
      //   children: [
      //     {
      //       path: 'code',
      //       name: 'code',
      //       component: Code,
      //       meta: {
      //         thirdActiveIndex: '/storages/tools',
      //         rid: 'Auth_menu_treasury_businessmanagement_tool'
      //       }
      //     }
      //   ]
      // },
      // 出库
      {
        path: 'output',
        name: 'output',
        component: OutPut,
        meta: {
          keepAlive: true
        },
        redirect: 'output/outputs/20',
        children: [
          {
            path: 'outputs/:status',
            name: 'outputs',
            component: OutPuts,
            meta: {
              thirdActiveIndex: '/storages/output',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_output'
            }
          },
          {
            path: 'outputsee/:id',
            name: 'outputsee',
            component: OutPutSee,
            meta: {
              thirdActiveIndex: '/storages/output',
              rid: 'Auth_menu_treasury_businessmanagement_output'
            }
          },
          {
            path: 'outputedit/:id',
            name: 'outputedit',
            meta: {
              source: '2',
              thirdActiveIndex: '/storages/output',
              rid: 'Auth_menu_treasury_businessmanagement_output'
            },
            component: OutPutEdit
          },
          // 4.11.1 去掉这两个路由 by lvjiangtao@everjiankang.com
          // {
          //   path: 'outputnewedit/:id',
          //   name: 'outputnewedit',
          //   component: OutPutNewEdit,
          //   meta: {
          //     thirdActiveIndex: '/storages/output'
          //   }
          // },
          // {
          //   path: 'outputotheredit/:id',
          //   name: 'outputotheredit',
          //   component: OutPutOther,
          //   meta: {
          //     thirdActiveIndex: '/storages/output'
          //   }
          // }
        ]
      },
      // 入库
      {
        path: 'entry',
        name: 'entry',
        component: Entry,
        redirect: 'entry/entrys/10',
        children: [
          {
            path: 'entrys/:status',
            name: 'entrys',
            component: Entrys,
            meta: {
              thirdActiveIndex: '/storages/entry',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            }
          },
          {
            path: 'entryadd/:id?',
            name: 'entryadd',
            component: EntryNews,
            meta: {
              thirdActiveIndex: '/storages/entry'
            }
          },
          {
            path: 'purchasesee/:id',
            name: 'purchasesee',
            component: PurchaseSee,
            meta: {
              thirdActiveIndex: '/storages/entry'
            }
          },
          {
            path: 'purchaseentry/:id',
            name: 'purchaseentry',
            component: PurchaseEntry,
            meta: {
              thirdActiveIndex: '/storages/entry'
            }
          },
          {
            path: 'entrynewadd',
            name: 'entrynewadd',
            component: EntryAdd,
            meta: {
              thirdActiveIndex: '/storages/entry',
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            }
          },
          {
            path: 'entrysee/:id',
            name: 'entrysee',
            component: EntrySee,
            meta: {
              thirdActiveIndex: '/storages/entry',
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            }
          },
          {
            path: 'entryedit/:id',
            name: 'entryedit',
            meta: {
              source: '10',
              thirdActiveIndex: '/storages/entry',
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            },
            component: EntryEdit
          },
          {
            path: 'entryold/:id',
            name: 'entryold',
            component: EntryOld,
            meta: {
              thirdActiveIndex: '/storages/entry',
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            }
          },
          {
            path: 'entryother/:id',
            name: 'entryother',
            component: EntryOther,
            meta: {
              thirdActiveIndex: '/storages/entry',
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            }
          },
          {
            path: 'entrynewother/:id',
            name: 'entrynewother',
            component: EntryNewOther,
            meta: {
              thirdActiveIndex: '/storages/entry',
              rid: 'Auth_menu_treasury_businessmanagement_entry'
            }
          }
        ]
      },
      // 业务
      {
        path: 'business',
        name: 'business',
        component: Business,
        redirect: 'business/procurement',
        meta: {
          rid: 'Auth_menu_treasury_businessmanagement_business'
        },
        children: [
          // 批次定价
          ...BATCH_PRICE,
          {
            path: 'procurement',
            name: 'procurement',
            component: Procurement,
            // procurement/procurementlist 本期暂时隐藏 3.9.1
            redirect: 'applybusinesses',
            children: [
              {
                path: 'procurementlist',
                name: 'procurementlist',
                component: ProcurementList,
                meta: {
                  thirdActiveIndex: '/storages/business'
                }
              },
              {
                path: 'procurementdetail/:id',
                name: 'procurementdetail',
                component: ProcurementDetail,
                meta: {
                  thirdActiveIndex: '/storages/business'
                }
              }
            ]
          },
          {
            path: 'applybusinesses',
            name: 'applybusinesses',
            component: ApplyBusinesses,
            meta: {
              thirdActiveIndex: '/storages/business',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'applybusinessadd',
            name: 'applybusinessadd',
            // 懒加载
            component: ApplyDismantle,
            meta: {
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'applybusinessadd/:id',
            name: 'applybusinessadds',
            component: ApplyDismantle,
            meta: {
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'applybusiness/:id',
            name: 'applybusiness',
            component: () => import('@/warehouse/page/storages/business/applybusiness.info.vue'),
            meta: {
              source: '6',
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'retiringbusinesses',
            name: 'retiringbusinesses',
            component: RetiringBusinesses,
            meta: {
              thirdActiveIndex: '/storages/business',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'retiringbusinadd',
            name: 'retiringbusinadd',
            component: () => import('@/warehouse/page/storages/business/retiringbusinadd.vue'),
            meta: {
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'retiringbusiness/:id',
            name: 'retiringbusiness',
            component: () => import('@/warehouse/page/storages/business/retiringbusiness.info.vue'),
            meta: {
              source: '6',
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'returnbusinesses',
            name: 'returnbusinesses',
            component: ReturnBusinesses,
            meta: {
              thirdActiveIndex: '/storages/business',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'returnbusinessadd',
            name: 'returnbusinessadd',
            component: ReturnBusiness,
            meta: {
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'returnbusiness/:id',
            name: 'returnbusiness',
            component: ReturnBusiness,
            meta: {
              source: '7',
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'returnbusinessee/:id',
            name: 'returnbusinessee',
            component: ReturnBusinesSee,
            meta: {
              source: '7',
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'destroybusinesses',
            name: 'destroybusinesses',
            component: DestroyBusinesses,
            meta: {
              thirdActiveIndex: '/storages/business',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'destroybusinessadd/:id?',
            name: 'destroybusinessadd',
            component: DestroyBusiness,
            meta: {
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'destroybusinessee/:id',
            name: 'destroybusinessee',
            component: DestroyBusinessee,
            meta: {
              source: '100',
              thirdActiveIndex: '/storages/business'
            }
          },
          {
            path: 'splits',
            name: 'splits',
            component: Splits,
            meta: {
              thirdActiveIndex: '/storages/business',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'splitadd',
            name: 'splitadd',
            component: Split,
            meta: {
              thirdActiveIndex: '/storages/business',
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'split/:id',
            name: 'split',
            component: Split,
            meta: {
              thirdActiveIndex: '/storages/business',
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'splitsee/:id',
            name: 'splitsee',
            component: SplitSee,
            meta: {
              thirdActiveIndex: '/storages/business',
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'allocations',
            name: 'allocations',
            component: Allocations,
            meta: {
              thirdActiveIndex: '/storages/business',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'allocationadd',
            name: 'allocationadd',
            component: Allocation,
            meta: {
              thirdActiveIndex: '/storages/business',
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          },
          {
            path: 'allocationess/:id',
            name: 'allocationess',
            component: Allocationess,
            meta: {
              thirdActiveIndex: '/storages/business',
              rid: 'Auth_menu_treasury_businessmanagement_business'
            }
          }
        ]
      },
      // 数据查询
      {
        path: 'query',
        name: 'query',
        component: Query,
        redirect: 'query/querys',
        children: [
          {
            path: 'querys',
            name: 'querys',
            component: Querys,
            meta: {
              keepAlive: true,
              thirdActiveIndex: '/storages/query',
              rid: 'Auth_menu_treasury_businessmanagement_dataquery'
            }
          },
          {
            path: 'queryenter',
            name: 'queryenter',
            component: QueryEnter,
            meta: {
              keepAlive: true,
              thirdActiveIndex: '/storages/query',
              rid: 'Auth_menu_treasury_businessmanagement_dataquery'
            }
          },
          {
            path: 'queryenterdetails/:id',
            name: 'queryenterdetails',
            component: QueryEnterDetails,
            meta: {
              thirdActiveIndex: '/storages/query',
              rid: 'Auth_menu_treasury_businessmanagement_dataquery'
            }
          },
          {
            path: 'commodityflow',
            name: 'commodityflow',
            component: QueryCommodityFlow,
            meta: {
              thirdActiveIndex: '/storages/query',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_dataquery'
            }
          }
        ]
      },
      // 预警
      {
        path: 'warning',
        name: 'warning',
        component: Warning,
        redirect: 'warning/inventorywarn',
        children: [
          {
            path: 'inventorywarn',
            name: 'inventorywarn',
            component: InventoryWarn,
            meta: {
              thirdActiveIndex: '/storages/warning',
              keepAlive: true,
              rid: 'Auth_menu_treasury_businessmanagement_warning'
            }
          },
          {
            path: 'validitywarn',
            name: 'validitywarn',
            component: VlidityWarn,
            meta: {
              thirdActiveIndex: '/storages/warning',
              rid: 'Auth_menu_treasury_businessmanagement_warning'
            }
          },
          {
            path: 'inventorymanage',
            name: 'inventorymanage',
            component: InventoryManage,
            redirect: 'inventorymanage/safestockfit',
            children: [
              {
                path: 'safestockfit',
                name: 'safestockfit',
                component: SafeStockFit,
                meta: {
                  thirdActiveIndex: '/storages/warning'
                }
              },
              {
                path: 'ministockfit',
                name: 'ministockfit',
                component: MiniStockFit,
                meta: {
                  thirdActiveIndex: '/storages/warning'
                }
              }
            ]
          }
        ]
      },
      // 盘点
      {
        path: 'check',
        name: 'check',
        component: Check,
        redirect: 'check/checkstocktakingadd',
        children: [
          {
            path: 'checklist',
            name: 'checklist',
            component: CheckList,
            meta: {
              thirdActiveIndex: '/storages/check',
              rid: 'Auth_menu_treasury_businessmanagement_inventory'
            }
          },
          {
            path: 'checkstocktakingadd',
            name: 'checkstocktakingadd',
            component: checkstocktakingAdd,
            meta: {
              thirdActiveIndex: '/storages/check',
              rid: 'Auth_menu_treasury_businessmanagement_inventory'
            }
          },
          {
            path: 'checkstocktaking/:id',
            name: 'checkstocktakingid',
            component: CheckStockTaking,
            meta: {
              thirdActiveIndex: '/storages/check',
              rid: 'Auth_menu_treasury_businessmanagement_inventory'
            }
          },
          {
            path: 'checkstocktaking/:id/:num',
            name: 'checkstocktakingnum',
            component: CheckStockTaking,
            meta: {
              thirdActiveIndex: '/storages/check',
              rid: 'Auth_menu_treasury_businessmanagement_inventory'
            }
          }
        ]
      },
      // 首页
      {
        path: 'reload',
        name: 'reload',
        component: Reload
      },
      // 报表
      {
        path: 'reportform/catalog',
        name: 'bicatalog',
        component: catalog,
        meta: {
          showCodeList: ['warehouse'],
          // secActiveIndex: '/storages/reportform/catalog'
        }
        // redirect: 'reportform/catalog',
        // children: [
        //   {
        //     path: 'catalog/:code?',
        //     name: 'bicatalog',
        //     component: catalog,
        //
        //   },
        // ]
      },
      // 货位管理
      {
        path: 'commoditymanage',
        name: 'commoditymanage',
        component: CommodityManage,
        redirect: 'commoditymanage/commoditylocations',
        children: [
          {
            path: 'commoditylocations',
            name: 'commoditylocations',
            component: CommodityLocationList,
            meta: {
              keepAlive: true,
              thirdActiveIndex: '/storages/commoditymanage/commoditylocations'
            }
          },
          {
            path: 'commoditylocationadd',
            name: 'commoditylocationadd',
            component: CommodityLocation,
            meta: {
              thirdActiveIndex: '/storages/commoditymanage/commoditylocations'
            }
          },
          {
            path: 'commoditylocation/:id',
            name: 'commoditylocation',
            component: CommodityLocation,
            meta: {
              thirdActiveIndex: '/storages/commoditymanage/commoditylocations'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/storages/*',
    component: Warehouse,
  }
]
