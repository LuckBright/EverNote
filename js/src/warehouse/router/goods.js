import Warehouse from '../page/warehouse'
import DrugNewBuyList from '../page/purchease/drugbuylist'
import ProcureApply from '../page/purchease/procureapply'
// import Approval from '../page/approval.vue'
// 领用
import ConsumptiveReceive from '@/warehouse/page/getreceive/consumptivereceiveadd.vue'
import ConsumptiveReceiveInfo from '@/warehouse/page/getreceive/consumptivereceive.info'
import ConsumptiveReceiveList from '../page/getreceive/consumptivereceivelist'
const ConsumptiveReceiveBatch = () => import('@/warehouse/page/getreceive/consumptivereceiveadd.batch.vue')
// import DrugPurchease from '../page/purchease/drugpurchease'
import DrugPurcheaseNew from '@/warehouse/page/purchease/component/newdrugpurchease.vue'
// import DrugEnterStorageRoom from '../page/enterstorageroom/drugenterstorageroom'
import DrugBuynesLook from '@/warehouse/page/purchease/component/drugbuyneslook.vue'
// import DrugEnterStorageRoomList from '../page/enterstorageroom/drugenterstorageroomlist'
// import ConsumptiveEnterStorageRoom from '../page/enterstorageroom/consumptivestorageroom'
// import ConsumptiveEnterStorageRoomEdit from '../page/enterstorageroom/consumptivestorageroomedit'
// import ConsumptiveEnterStorageRoomList from '../page/enterstorageroom/consumptivestorageroomlist'
// import EquipmentEnterStorageRoom from '../page/enterstorageroom/equipmentstorageroom'
// import EquipmentEnterStorageRoomEdit from '../page/enterstorageroom/equipmentstorageroomedit'
// import EquipmentEnterStorageRoomList from '../page/enterstorageroom/equipmentstorageroomlist'
// import DrugOutputStorageRoomList from '../page/outputstorageroom/drugoutputstorageroomlist'
// import DrugOutputStorageRoom from '../page/outputstorageroom/drugoutputstorageroom'
// import DrugOutputStorageRoomEdit from '../page/outputstorageroom/drugoutputstorageroomedit'
// import ConsumptiveOutputStorageRoomList from '../page/outputstorageroom/consumptivestorageroomlist'
import ConsumptiveOutputStorageRoom from '../page/outputstorageroom/consumptivestorageroom'
import ConsumptiveOutputStorageRoomEdit from '../page/outputstorageroom/consumptivestorageroomedit'
// import EquipmentOutputStorageRoomList from '../page/outputstorageroom/equipmentstorageroomlist'
// import EquipmentOutputStorageRoom from '../page/outputstorageroom/equipmentstorageroom'
// import EquipmentOutputStorageRoomEdit from '../page/outputstorageroom/equipmentstorageroomedit'

// 供应商管理
import Supplier from '../page/supplier'
import NewSupplier from '../page/newsupplier'
import SupplierList from '../page/supplierlist'
import SupplierPrice from '../page/supplierprice'
// 采购申请
import ProcurementList from '../page/purchease/procurementlist'
import SummaryList from '../page/purchease/summarylist'
import SummaryDetail from '../page/purchease/summarydetail'
import ProcurementDetail from '../page/purchease/procurementdetail'

// 集中采购   新增2020-02-04
import FocusProcurementList from '../page/purchease/focusprocurementlist'
// import FocusProcurementListHz from '../page/purchease/focusprocurementlist.hz'
import FocusProcurementDetail from '../page/purchease/focusprocurementdetail'
import FocusDrugbuyList from '@/warehouse/page/purchease/focusdrugbuylist.vue'

// 合同管理
import ContractManagement from '@/warehouse/page/purchease/contract/contractmanagement.vue'
import AddContract from '@/warehouse/page/purchease/contract/addcontrct.vue'

// 处方点评
import review from '@/warehouse/page/prescription.review/router'

// 首页
import Home from '@/warehouse/page/Integrated/home.vue'

// 院外处方审核
import WmsPrescribe from '@/warehouse/page/wmsprescribe/index'

export default [
  {
    path: '/goods',
    component: Warehouse,
    redirect: '/goods/home',
    children: [
      ...review,
      {
        path: 'home',
        name: 'goodshome',
        component: Home
      },
      // 集中采购单
      {
        path: 'focusdrugbuynews',
        component: FocusDrugbuyList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'focusdrugpurchease/:id',
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/focusdrugbuynews'
        },
        component: DrugPurcheaseNew
      },
      {
        path: 'focusdrugpurcheaseadd/:id',
        component: DrugPurcheaseNew,
        meta: { thirdActiveIndex: '/goods/focusdrugbuynews' }
      },
      // 供应商管理
      {
        path: 'suppliers',
        component: SupplierList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'supplieradd',
        component: Supplier,
        meta: {
          thirdActiveIndex: '/goods/suppliers'
        }
      },
      // {
      //   path: 'suppliers/:id',
      //   component: Supplier,
      //   meta: {
      //     thirdActiveIndex: '/goods/suppliers'
      //   }
      // },
      {
        path: 'suppliers/:id/:supplierId',
        component: NewSupplier,
        meta: {
          thirdActiveIndex: '/goods/suppliers'
        }
      },
      {
        path: 'supplierprice/:supplierId/:id/:intelligenceId',
        component: SupplierPrice,
        meta: {
          thirdActiveIndex: '/goods/suppliers'
        }
      },
      // 入库 药品入库 迁移到库发工作站下面 重新做了
      // {
      //   path: 'drugenterstorageroomadd',
      //   component: DrugEnterStorageRoom
      // },
      // {
      //   path: 'drugenterstorageroom/:id',
      //   component: DrugEnterStorageRoom
      // },
      {
        path: 'drugenterstorageroomedit/:id',
        component: DrugBuynesLook,
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/drugbuynews'
        }
      },
      // {
      //   path: 'drugenterstoragerooms/:status',
      //   component: DrugEnterStorageRoomList
      // },
      // 入库 耗材入库 迁移到库发工作站下面 重新做了
      // {
      //   path: 'consumptiveenterstorageroomadd',
      //   component: ConsumptiveEnterStorageRoom
      // },
      // {
      //   path: 'consumptiveenterstorageroom/:id',
      //   component: ConsumptiveEnterStorageRoom
      // },
      // {
      //   path: 'consumptiveenterstorageroomedit/:id',
      //   component: ConsumptiveEnterStorageRoomEdit
      // },
      // {
      //   path: 'consumptiveenterstoragerooms/:status',
      //   component: ConsumptiveEnterStorageRoomList
      // },
      // {
      //   path: 'equipmententerstorageroomadd',
      //   component: EquipmentEnterStorageRoom
      // },
      // {
      //   path: 'equipmententerstorageroom/:id',
      //   component: EquipmentEnterStorageRoom
      // },
      // {
      //   path: 'equipmententerstorageroomedit/:id',
      //   component: EquipmentEnterStorageRoomEdit
      // },
      // {
      //   path: 'equipmententerstoragerooms/:status',
      //   component: EquipmentEnterStorageRoomList
      // },
      // {
      //   path: 'drugoutputstorageroom',
      //   component: DrugOutputStorageRoom
      // },
      // {
      //   path: 'drugoutputstorageroom/:id',
      //   component: DrugOutputStorageRoom
      // },
      // {
      //   path: 'drugoutputstorageroomedit/:id',
      //   component: DrugOutputStorageRoomEdit
      // },
      // {
      //   path: 'drugoutputstoragerooms/:status',
      //   component: DrugOutputStorageRoomList
      // },
      {
        path: 'consumptiveoutputstorageroom',
        component: ConsumptiveOutputStorageRoom
      },
      {
        path: 'consumptiveoutputstorageroom/:id',
        component: ConsumptiveOutputStorageRoom
      },
      {
        path: 'consumptiveoutputstorageroomedit/:id',
        component: ConsumptiveOutputStorageRoomEdit
      },
      // {
      //   path: 'consumptiveoutputstoragerooms/:status',
      //   component: ConsumptiveOutputStorageRoomList
      // },
      // {
      //   path: 'equipmentoutputstorageroom',
      //   component: EquipmentOutputStorageRoom
      // },
      // {
      //   path: 'equipmentoutputstorageroom/:id',
      //   component: EquipmentOutputStorageRoom
      // },
      // {
      //   path: 'equipmentoutputstorageroomedit/:id',
      //   component: EquipmentOutputStorageRoomEdit
      // },
      // {
      //   path: 'equipmentoutputstoragerooms/:status',
      //   component: EquipmentOutputStorageRoomList
      // },
      // 集团审核汇总
      {
        path: 'procureapply',
        component: ProcureApply,
        meta: {
          keepAlive: true,
        },
      },
      {
        path: 'summarylist',
        name: 'summarylist',
        component: SummaryList,
        meta: {
          keepAlive: true,
          thirdActiveIndex: '/goods/procureapply',
        }
      },
      {
        path: 'summarydetail/:id?',
        name: 'summarydetail',
        component: SummaryDetail,
        meta: {
          thirdActiveIndex: '/goods/procureapply',
        }
      },
      // 机构自主采购单
      {
        path: 'drugbuynews',
        component: DrugNewBuyList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'drugpurcheaseadd',
        component: DrugPurcheaseNew,
        meta: { thirdActiveIndex: '/goods/drugbuynews' }
      },
      {
        path: 'drugpurcheaseadd/:id',
        component: DrugPurcheaseNew,
        meta: { thirdActiveIndex: '/goods/drugbuynews' }
      },
      {
        path: 'drugpurchease/:id',
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/drugbuynews'
        },
        component: DrugPurcheaseNew
      },
      // 机构采购申请单
      {
        path: 'procurementlist',
        component: ProcurementList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'procurementdetail/:id?',
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/procurementlist'
        },
        component: ProcurementDetail
      },
      {
        path: 'drugprocurementdetail/:id?',
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/drugbuynews'
        },
        component: ProcurementDetail
      },
      // 集中采购申请单
      {
        path: 'focuspurchase',
        component: FocusProcurementList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'focusprocurementdetail',
        name: 'focusprocurementdetail',
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/focuspurchase'
        },
        component: FocusProcurementDetail
      },
      {
        path: 'focusprocurementdetail/:id',
        name: 'focusprocurementdetails',
        meta: {
          source: '1',
          thirdActiveIndex: '/goods/focuspurchase'
        },
        component: FocusProcurementDetail
      },
      // 领用申请
      {
        path: 'consumptivereceives',
        component: ConsumptiveReceiveList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'consumptivereceiveadd/:id?',
        component: ConsumptiveReceive,
        meta: { thirdActiveIndex: '/goods/consumptivereceives' }
      },
      // 批次定价领用
      {
        path: 'consumptivereceiveaddbatch/:id?',
        component: ConsumptiveReceiveBatch,
        meta: { thirdActiveIndex: '/goods/consumptivereceives' }
      },
      {
        path: 'consumptivereceive/:id',
        name: 'consumptivereceive',
        meta: {
          source: '41',
          thirdActiveIndex: '/goods/consumptivereceives'
        },
        component: ConsumptiveReceiveInfo
      },
      // 合同管理
      {
        path: 'contractmanagement',
        component: ContractManagement,
        meta: {
          keepAlive: true
        }
      },
      {
        path: 'addcontract/:id?',
        component: AddContract,
        meta: {
          thirdActiveIndex: '/goods/contractmanagement'
        },
      },
      // 院外处方审核
      {
        path: 'wmsprescribe',
        name: 'wmsprescribe',
        component: WmsPrescribe
      }
      // {
      //   path: 'approval',
      //   component: Approval
      // },
      // {
      //   path: 'approval/:id/:status',
      //   component: Approval
      // },
    ]
  }
]
