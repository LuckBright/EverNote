// 财务设置工作站下相关路由
import Rcm from '@/rcm/page/rcm'
// import Coaaccount from '@/rcm/page/coaaccount'
// import CoaaccountNew from '@/rcm/page/coaaccountnew'
// import SubledgerList from '@/rcm/page/subledgerlist'
// import Subledger from '@/rcm/page/subledger'
// import SubledgerMapping from '@/rcm/page/subledgermapping'
// import PeriodControlList from '@/rcm/page/periodcontrollist'
// import PeriodControl from '@/rcm/page/periodcontrol'
// import Vouchertemplate from '@/rcm/page/vouchertemplate'
// import Basedata from '@/rcm/page/basedata'
// import MappingSetupList from '@/rcm/page/mappingsetuplist'
// import MappingSetup from '@/rcm/page/mappingsetup'

// 支付方式
import PaymentMethod from '@/warehouse/page/payment/paymentmethod'
import Priority from '@/rcm/page/priority'
// import CombinationConfig from '@/warehouse/page/payment/combinationconfig'
import DiscountProportion from '@/warehouse/page/payment/discountproportion'
import BizDict from '@/rcm/page/bizdict/bizdict'
import discountPerson from '@/rcm/page/bizdict/discountperson'
import discountRemark from '@/rcm/page/bizdict/discountremark'
import makeupfee from '@/rcm/page/bizdict/makeupfee'
// 支付渠道配置
import paychannelconfig from '@/rcm/page/paychannelconfig/paychannelconfig'
import paychannel from '@/rcm/page/paychannelconfig/paychannellist'
import paychanneldetail from '@/rcm/page/paychannelconfig/paychanneldetail'
// import PeriodSetup from '@/rcm/page/periodsetup'
// import PeriodSetupDetail from '@/rcm/page/periodsetupdetail'

// 成本设置
// import CostItems from '@/warehouse/page/costsetting/costitems'
// import CostItemsAdd from '@/warehouse/page/costsetting/costitemsadd'
// import ApportionmentType from '@/warehouse/page/costsetting/apportionmenttype'
// import CostCorresponding from '@/warehouse/page/costsetting/costcorresponding'
// import CostCorrespondence from '@/warehouse/page/costsetting/costcorrespondence'

// 财务分类映射关系
import FinancialControl from '@/rcm/page/financial.control'

// 内部交易价
import InsideTariffs from '@/rcm/page/tariffs/insidetariffs/insidetariffslist'
import InsideTariffsAdd from '@/rcm/page/tariffs/insidetariffs/insidetariffsadd'

// 授权管理
import AuthMain from '@/rcm/page/auth.manage/auth.main.vue'
import UserMain from '@/rcm/page/auth.manage/user.main.vue'
import AuthRecord from '@/rcm/page/auth.manage/auth.record.vue'

export default [
  {
    path: '/financeistall',
    component: Rcm,
    children: [
      // 授权管理-授权维护
      {
        path: 'authmain',
        component: AuthMain
      },
      // 授权管理-用户维护
      {
        path: 'usermain',
        component: UserMain
      },
      // 授权管理-授权记录
      {
        path: 'authrecord',
        component: AuthRecord
      },
      // {
      //   path: 'costitems',
      //   component: CostItems
      // },
      // {
      //   path: 'costitemsadd',
      //   component: CostItemsAdd
      // },
      // {
      //   path: 'costitemsedit/:id',
      //   component: CostItemsAdd
      // },
      // 分摊参数
      // {
      //   path: 'apportionmenttype',
      //   component: ApportionmentType
      // },
      // 内部服务项目
      // {
      //   path: 'costcorresponding',
      //   component: CostCorresponding
      // },
      // 成本项目科目对应
      // {
      //   path: 'costcorrespondence',
      //   component: CostCorrespondence
      // },
      // 映射管理
      // {
      //   path: 'mappingsetupadd',
      //   component: MappingSetup
      // },
      // {
      //   path: 'mappingsetup/:id',
      //   component: MappingSetup
      // },
      // {
      //   path: 'mappingsetups',
      //   component: MappingSetupList
      // },
      // {
      //   path: 'vouchertemplate',
      //   component: Vouchertemplate
      // },
      // {
      //   path: 'basedata',
      //   component: Basedata
      // },
      // {
      //   path: 'periodcontrol',
      //   component: PeriodControl,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/periodcontrols'
      //   }
      // },
      // {
      //   path: 'periodcontrols',
      //   component: PeriodControlList
      // },
      // 账套管理
      // {
      //   path: 'subledgeradd',
      //   component: Subledger,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/subledgers'
      //   }
      // },
      // {
      //   path: 'subledgermapping/:setid/:accid',
      //   component: SubledgerMapping
      // },
      // {
      //   path: 'subledger/:id',
      //   component: Subledger,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/subledgers'
      //   }
      // },
      // {
      //   path: 'subledgers',
      //   component: SubledgerList
      // },
      // {
      //   path: 'coaaccounts',
      //   component: Coaaccount
      // },
      // {
      //   path: 'coaaccountadd',
      //   component: CoaaccountNew,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/coaaccounts'
      //   }
      // },
      // {
      //   path: 'coaaccount/:id',
      //   component: CoaaccountNew,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/coaaccounts'
      //   }
      // },
      // 会计期间相关的路由
      // {
      //   path: 'periodsetups',
      //   component: PeriodSetup
      // },
      // {
      //   path: 'periodadd',
      //   component: PeriodSetupDetail,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/periodsetups'
      //   }
      // },
      // {
      //   path: 'periodsetupdetail/:id',
      //   component: PeriodSetupDetail,
      //   meta: {
      //     thirdActiveIndex: '/financeistall/periodsetups'
      //   }
      // },
      // 支付方式
      {
        path: 'paymentmethod',
        component: PaymentMethod
      },
      // 支付方组合配置
      // {
      //   path: 'combinationconfig',
      //   component: CombinationConfig
      // },
      // 卡券使用优先级
      {
        path: 'priority',
        component: Priority
      },
      // 业务分类映射
      {
        path: 'financialcontrol',
        component: FinancialControl
      },
      // 内部交易价目表管理
      {
        path: 'insidetariffs',
        component: InsideTariffs
      },
      // 内部交易价目表管理-新增
      {
        path: 'insidetariffsadd',
        component: InsideTariffsAdd,
        meta: {
          secActiveIndex: '/financeistall/financialcontrol'
        }
      },
      // 内部交易价目表管理-维护
      {
        path: 'insidetariffsedit/:id',
        component: InsideTariffsAdd,
        meta: {
          secActiveIndex: '/financeistall/financialcontrol'
        }
      },
      // 财务参数设置
      {
        path: 'discountproportion',
        component: DiscountProportion
      },
      // 业务字典
      {
        path: 'bizdict',
        component: BizDict,
        redirect: 'bizdict/discountperson',
        children: [
          // 打折人
          {
            path: 'discountperson',
            component: discountPerson,
          },
          // 打折备注
          {
            path: 'discountRemark',
            component: discountRemark,
            meta: {
              secActiveIndex: '/financeistall/bizdict/discountperson'
            }
          },
          // 补费项目列表
          {
            path: 'makeupfee',
            component: makeupfee,
            meta: {
              secActiveIndex: '/financeistall/bizdict/discountperson'
            }
          }
        ]
      },
      // 支付渠道配置
      {
        path: 'paychannelconfig',
        component: paychannelconfig,
        redirect: 'paychannelconfig/paychannel',
        children: [
          {
            path: 'paychannel',
            component: paychannel,
          },
          {
            name: 'paychanneladd',
            path: 'paychanneladd',
            component: paychanneldetail,
            meta: {
              secActiveIndex: '/financeistall/paychannelconfig/paychannel'
            }
          },
          {
            path: 'paychannel/:id',
            component: paychanneldetail,
            meta: {
              secActiveIndex: '/financeistall/paychannelconfig/paychannel'
            }
          }
        ]
      },
      // 采购支付方式
      {
        path: 'purchasePayment',
        component: () => import('@/rcm/payment/purchase/index.vue'),
      },
    ]
  }
]
