import Rcm from '../page/rcm'
import Welcome from '@/login/page/welcome'
import SettlementList from '../page/settlementlist'
import PaymentFlowQuery from '../page/paymentflowquery'
// import GetInvoiceList from '../page/getinvoicelist'
import WeixinPay from '../page/weixinpay'
// import ExportSettlementsInfo from '../page/exportsettlementsinfo'
// import Helpmeds from '../page/helpmeds'
// import CostAccount from '../page/cost.account/layout'
// import CostCompute from '../page/cost.account/compute'
// import CostComputeDetail from '../page/cost.account/compute.detail'
// import CostUpdate from '../page/cost.account/update'
// import CostAccountParams from '../page/cost.account/settings/params'
// import CostTransaction from '../page/cost.account/settings/transaction'
// import CostPeriod from '../page/cost.account/settings/period'
// import DailySettle from '../page/income/dailySettlement'
import SettlementInfo from '@/rcm/page/income/dailysettlement/settlementinfo'
import collectDailySettle from '@/rcm/page/income/dailySettlementCollect'
import MallSettlementInfo from '../page/income/dailysettlement/mallsettlementinfo.vue'
import DailySettleList from '../page/income/dailySettlementQuery'
import OutpatientIncomeForm from '../page/income/reportForms/outpatient'
import OutpatientIncomeSummary from '../page/income/reportForms/incomeSummary'
// import accountCheck from '../page/account.check/list'
// import accountCheckDetail from '../page/account.check/detail'
import receipt from '../page/receipt/receipt'
import receiptTabs from '../page/receipt/components/tabs'
import receiptDetail from '../page/receipt/components/receiptDetail'
import paymentDetail from '../page/receipt/components/paymentDetail'
import scanCodePayment from '../page/receipt/components/scanCodePayment'
// 财务基础1
// import PeriodSetup from '@/rcm/page/periodsetup'
// import PeriodSetupDetail from '@/rcm/page/periodsetupdetail'

import settlepaymenthome from '@/rcm/page/outpatientSettlement/settlepaymenthome'
// 发票管理
import invoicemanage from '@/rcm/page/invoicemanage/invoicemanage'
// import medicaretransaction from '@/rcm/page/medicaretransaction'
import landtaxmanage from '@/rcm/page/invoicemanage/landtaxmanage'
import billuse from '@/rcm/page/bill.manage/billuse/billuse'

// 统计分析
// import BiRouter from '@/bi/router/index.js'
import Reportsets from '@/bi/page/reportlist'
import indexcatalog from '@/bi/page/catalog'

// 医保预结算
import outpatientMedicalManage from '@/rcm/otmdiscomponent/jlcc-medical-manage/jlcc-outpatient-medical-manage.vue'

// import cssycs from '@/rcm/page/pay/cssycs'
// 纠纷退费查询
import disputeRefund from '@/rcm/page/query/dispute-refund.vue'

// 黑龙江医保预警
import prewarning from '@/rcm/otmdiscomponent/hljmedical/prewarning.vue'
let RcmRouterArr = [
  // {
  //   path: '/cost',
  //   component: CostAccount,
  //   children: [
  //     {
  //       path: '',
  //       redirect: '/cost/compute'
  //     },
  //     {
  //       path: 'compute',
  //       component: CostCompute
  //     },
  //     {
  //       path: 'compute/:id',
  //       component: CostComputeDetail
  //     },
  //     {
  //       path: 'update',
  //       component: CostUpdate
  //     },
  //     {
  //       path: 'params',
  //       component: CostAccountParams
  //     },
  //     {
  //       path: 'transaction',
  //       component: CostTransaction
  //     },
  //     {
  //       path: 'period',
  //       component: CostPeriod
  //     },
  //   ]
  // },
  // {
  //   path: '/rcm/',
  //   name: 'outpatientfee',
  //   component: Rcm,
  //   redirect: '/rcm/reconstruct'
  // },
  {
    path: '/rcm',
    name: 'rcm',
    redirect: '/rcm/reconstruct',
    component: Rcm,
    children: [
      // 查询统计-门诊查询
      {
        path: 'reportlist/:code?',
        name: 'reportsets',
        component: Reportsets,
        meta: {
          editMode: false,
          moduleSelect: false,
          searchMode: false,
        }
      },
      // 查询统计-报表详情
      {
        path: 'catalog',
        name: 'bicatalog',
        component: indexcatalog,
        meta: {
          showCodeList: ['outpatient', 'medical_skills', 'hospitalization', 'medical_supplies', 'warehouse', 'internet_hospital', 'insurance'],
          thirdActiveIndex: '/rcm/reportlist/outpatient'
        }
      },
      // ...BiRouter({
      //   editMode: false,
      //   moduleSelect: false,
      //   searchMode: false,
      //   // secActiveIndex: '/rcm/comins',
      //   thirdActiveIndex: '/rcm/reportlist/outpatient'
      // }),
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      // 发票管理-票据使用
      {
        path: 'invoicemanage',
        component: invoicemanage
      },
      // 超市收银
      // {
      //   path: 'cssycs',
      //   component: cssycs
      // },
      // 发票管理-票据使用
      {
        path: 'billuse',
        component: billuse,
        meta: {
          disabled: true
        },
      },
      // 地税发票
      {
        path: 'landtaxmanage',
        component: landtaxmanage
      },
      // 当日门诊收费总览
      {
        path: 'paymenthome',
        component: settlepaymenthome
      },
      // 不知道是干啥的
      // {
      //   path: 'medicaretransaction',
      //   component: medicaretransaction
      // },
      // 不知道是干啥的
      // {
      //   path: 'exportsettlementsinfo',
      //   component: ExportSettlementsInfo
      // },
      // 收银台
      {
        path: 'weixinpay',
        component: WeixinPay
      },
      // 查询统计-结算单查询
      {
        path: 'settlements',
        component: SettlementList
      },
      // 查询统计-支付流水查询
      {
        path: 'paymentflowquery',
        name: 'paymentflowquery',
        component: PaymentFlowQuery
      },
      // {
      //   path: 'getinvoicelist/:id',
      //   component: GetInvoiceList
      // },
      // 日结处理-营销日结
      {
        path: 'daily/rcmSettlement',
        component: MallSettlementInfo
      },
      // 日结处理-收费日结（feeType=1） 挂号日结（feeType=3）
      {
        path: 'daily/settlement/:feeType/:id?',
        component: SettlementInfo,
      },
      // 门诊日结汇总查询 一张帆软报表，用润乾的报表替换
      {
        path: 'daily/collectSettlement',
        component: collectDailySettle
      },
      // 查询统计-营销日结查询（feeType=7）门诊日结单据查询（无feeType）
      {
        path: 'dailysettlement/list/:feeType?',
        component: DailySettleList
      },
      // 查询统计-收费明细查询
      {
        path: 'outpatient/form',
        component: OutpatientIncomeForm
      },
      // 查询统计-收费汇总查询
      {
        path: 'outpatient/summary',
        component: OutpatientIncomeSummary
      },
      // 查询统计-纠纷退费查询
      {
        path: 'outpatient/disputeRefund',
        component: disputeRefund
      },
      // 银行收款对账
      // {
      //   path: 'account/check',
      //   component: accountCheck
      // },
      // {
      //   path: 'account/check/:id',
      //   component: accountCheckDetail,
      //   meta: {
      //     thirdActiveIndex: '/rcm/account/check'
      //   }
      // },
      // {
      //   path: 'helpmeds',
      //   component: Helpmeds
      // },
      // 营销收费 tabs/:status 待结算-0 结算中-1 已完成-2
      {
        path: 'receipt',
        component: receipt,
        redirect: 'receipt/tabs/0',
        children: [
          {
            path: 'tabs/:status',
            component: receiptTabs,
            meta: {
              thirdActiveIndex: '/rcm/receipt/tabs/0'
            }
          }
        ]
      },
      // 营销收费-待结算状态下的明细
      {
        path: 'receiptDetail',
        component: receiptDetail,
        meta: {
          thirdActiveIndex: '/rcm/receipt/tabs/0'
        }
      },
      // 营销收费-结算中的收款/退款  以计算的详情
      {
        path: 'paymentDetail',
        component: paymentDetail,
        meta: {
          thirdActiveIndex: '/rcm/receipt/tabs/0'
        }
      },
      // 扫描支付（不知道在什么地方用到，暂时保留）
      {
        path: 'scanCodePayment',
        component: scanCodePayment
      },
      {
        path: 'outpatientMedicalManage',
        component: outpatientMedicalManage
      },
      // 黑龙江预警管理
      {
        path: 'prewarning',
        component: prewarning
      }
    ]
  },
]

export default RcmRouterArr
