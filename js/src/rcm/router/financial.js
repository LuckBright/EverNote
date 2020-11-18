/*
 * @Author: renpengfei
 * @Date: 2019-08-12 11:21:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-09 17:28:05
 */
import Financial from '../page/financial'
import claim from '../page/medicalinsurance/claim'
import claimedit from '../page/medicalinsurance/claimedit'
import claimapproval from '../page/medicalinsurance/claimapproval'
import newclaimapproval from '../page/medicalinsurance/newclaimapproval'
import claimapprovaldetail from '../page/medicalinsurance/claimapprovaldetail'
import beginclaimedit from '../page/medicalinsurance/beginclaimedit'
import creditmanagement from '../page/medicalinsurance/creditmanagement'
import creditdetail from '../page/medicalinsurance/creditdetail'
import insurrefund from '../page/medicalinsurance/insurrefund'
import protestmanagement from '../page/medicalinsurance/protestmanagement'
import protestdetail from '../page/medicalinsurance/protestdetail'
// import ArPeriodMange from '../page/arperiodmange'
// import reports from '../page/medicalinsurance/reports'
// import FinAccount from '../page/income/account/finaccount'
// import CertificateManage from '../page/income/account/certificateManage'
// import CertificateList from '../page/income/account/certificateList'
// import IncomeDetail from '../page/income/account/incomefindetail'
// import InsuranceInfoManage from '../page/insuranceInfoManage'
// import uploadInsuranceInfo from '../page/uploadInsuranceInfo'
// import PayAbleInvoiceList from '../page/payableinvoicelist'
// import Payment from '../page/payment'
// import PaymentList from '../page/paymentlist'
// import PayAbleInvoice from '../page/payableinvoice'
// import ApPeriodmange from '../page/apperiodmange'
// import PrePaymentList from '../page/prepaymentlist'
// import PrePayment from '../page/prepayment'
// import ApVerifactionList from '../page/apverifactionlist'
// import SearchPrepayVerify from '../page/searchprepayverify'
// import GetInvoiceList from '../page/getinvoicelist'
// import CostCompute from '../page/cost.account/compute'
// import CostComputeDetail from '../page/cost.account/compute.detail'
// import CostUpdate from '../page/cost.account/update'
// import CostAccountParams from '../page/cost.account/settings/params'
// import CostTransaction from '../page/cost.account/settings/transaction'
// import CostPeriod from '../page/cost.account/settings/period'
// import SurvivingReport from '../page/cost.account/settings/survivingreport'

// 内部结算管理
import insideTradeManagement from '@/rcm/page/insidetrademanagement/insidetrademanagement'
import insideSettlement from '@/rcm/page/insidetrademanagement/insidesettlement'
import newInsideSettlement from '@/rcm/page/insidetrademanagement/newinsidesettlement'
import insideSettlementDetail from '@/rcm/page/insidetrademanagement/insidesettlementdetail'
import settlementApproval from '@/rcm/page/insidetrademanagement/settlementapproval'
import receivable from '@/rcm/page/insidetrademanagement/receivable'
import shouldpay from '@/rcm/page/insidetrademanagement/shouldpay'
import CrossAgencyAdvice from '@/rcm/page/insidetrademanagement/crossagencyadvice.vue'

// 核销
// import ReceiptsVerificationShow from '../page/receiptsverificationshow'
// import ReceiptsVerificationList from '../page/receiptsverificationlist'
// 票据管理
import BillStockList from '@/rcm/page/bill.manage/bill.stock.manage/bill.stock.list'
import BillStockDetail from '@/rcm/page/bill.manage/bill.stock.manage/bill.stock.detail'
import BillIssueList from '@/rcm/page/bill.manage/bill.issue.manage/bill.issue.list'
import BillIssueDetail from '@/rcm/page/bill.manage/bill.issue.manage/bill.issue.detail'
import BillUse from '@/rcm/page/bill.manage/billuse/billuse.vue'
// 日结缴款
import dailyPament from '@/rcm/page/dailypament/dailypament.vue'
import dailyPamentHistory from '@/rcm/page/dailypament/dailypamenthistory.vue'

// 采付结算管理 入库、退库收款详情
const PaymentWarehouseDetail = () => import('@/rcm/payment/warehouseing/detail.vue')
// 采付结算管理 入库、退库付款列表
const PaymentWarehouseList = () => import('@/rcm/payment/warehouseing/index.vue')

let router = [
  {
    path: '/financial',
    name: 'financial',
    redirect: '/financial/claimapproval',
    component: Financial,
    children: [
      // {
      //   path: 'receiptsverificationshow/:receiptCode/:id',
      //   component: ReceiptsVerificationShow,
      //   meta: {
      //     thirdActiveIndex: '/financial/receipts'
      //   }
      // },
      // {
      //   path: 'receiptsverifications',
      //   component: ReceiptsVerificationList
      // },
      // 商保理赔申请
      {
        path: 'claim',
        component: claim,
        meta: {
          type: 1
        }
      },
      // 大客户理赔申请
      {
        path: 'claimcustomer',
        component: claim,
        meta: {
          type: 2
        }
      },
      // 商保理赔申请 新建&编辑 理赔单
      {
        path: 'claimedit',
        component: claimedit,
        meta: {
          thirdActiveIndex: '/financial/claim',
          type: 1
        }
      },
      // 大客户理赔申请 新建&编辑 理赔单
      {
        path: 'claimeditcustomer',
        component: claimedit,
        meta: {
          thirdActiveIndex: '/financial/claimcustomer',
          type: 2
        }
      },
      // 商保账单审批
      {
        path: 'claimapproval',
        component: claimapproval,
        meta: { type: 1 }
      },
      // 大客户账单审批
      {
        path: 'claimapprovalcustomer',
        component: claimapproval,
        meta: { type: 2 }
      },
      // 商保账单审批 新建&编辑审批单
      {
        path: 'newclaimapproval',
        component: newclaimapproval,
        meta: {
          thirdActiveIndex: '/financial/claimapproval',
          type: 1
        }
      },
      // 大客户理赔申请 新建&编辑 审批单
      {
        path: 'newclaimapprovalcustomer',
        component: newclaimapproval,
        meta: {
          thirdActiveIndex: '/financial/claimapprovalcustomer',
          type: 2
        }
      },
      // 商保账单审批 账单审批详情
      {
        path: 'claimapprovaldetail',
        component: claimapprovaldetail,
        meta: {
          thirdActiveIndex: '/financial/claimapproval',
          type: 1
        }
      },
      // 大客户账单审批 账单审批详情
      {
        path: 'claimapprovaldetailcustomer',
        component: claimapprovaldetail,
        meta: {
          thirdActiveIndex: '/financial/claimapprovalcustomer',
          type: 2
        }
      },
      // 商保理赔申请 新建期初理赔单
      {
        path: 'beginclaimedit',
        component: beginclaimedit,
        meta: {
          thirdActiveIndex: '/financial/claim',
          type: 1
        }
      },
      // 大客户理赔申请 新建期初理赔单
      {
        path: 'beginclaimeditcustomer',
        component: beginclaimedit,
        meta: {
          thirdActiveIndex: '/financial/claimcustomer',
          type: 2
        }
      },
      // 商保收款管理
      {
        path: 'creditmanagement',
        component: creditmanagement,
        meta: { type: 1 }
      },
      // 大客户收款管理
      {
        path: 'creditmanagementcustomer',
        component: creditmanagement,
        meta: { type: 2 }
      },
      // 商保收款管理 新增&编辑 收款单
      {
        path: 'creditdetail',
        component: creditdetail,
        meta: {
          thirdActiveIndex: '/financial/creditmanagement',
          type: 1
        }
      },
      // 大客户收款管理 新增&编辑 收款单
      {
        path: 'creditdetailcustomer',
        component: creditdetail,
        meta: {
          thirdActiveIndex: '/financial/creditmanagementcustomer',
          type: 2
        }
      },
      // 商保收款管理
      {
        path: 'insurrefund',
        component: insurrefund,
        meta: {
          thirdActiveIndex: '/financial/creditmanagement',
          type: 1
        }
      },
      // 大客户收款管理
      {
        path: 'insurrefundcustomer',
        component: insurrefund,
        meta: {
          thirdActiveIndex: '/financial/creditmanagementcustomer',
          type: 2
        }
      },
      // 商保拒付管理
      {
        path: 'protestmanagement',
        component: protestmanagement,
        meta: { type: 1 }
      },
      // 大客户拒付管理
      {
        path: 'protestmanagementcustomer',
        component: protestmanagement,
        meta: { type: 2 }
      },
      // 商保 拒付单详情
      {
        path: 'protestdetail',
        component: protestdetail,
        meta: {
          thirdActiveIndex: '/financial/protestmanagement',
          type: 1
        }
      },
      // 大客户 拒付单详情
      {
        path: 'protestdetailcustomer',
        component: protestdetail,
        meta: {
          thirdActiveIndex: '/financial/protestmanagementcustomer',
          type: 2
        }
      },
      // 工作站没有入口注释掉 4101
      // {
      //   path: 'arperiodmange',
      //   component: ArPeriodMange
      // },
      // {
      //   path: 'reports',
      //   component: reports
      // },
      // todo
      // 凭证相关
      // {
      //   path: 'finaccount',
      //   component: FinAccount
      // },
      // {
      //   path: 'certificateManage',
      //   component: CertificateManage
      // },
      // {
      //   path: 'certificateList',
      //   component: CertificateList
      // },
      // 收入明细
      // {
      //   path: 'incomeDetail',
      //   component: IncomeDetail
      // },
      // {
      //   path: 'insuranceInfoManage',
      //   component: InsuranceInfoManage
      // },
      // 归档资料上传
      // {
      //   path: 'uploadInsuranceInfo',
      //   component: uploadInsuranceInfo,
      //   meta: {
      //     thirdActiveIndex: '/financial/insuranceInfoManage'
      //   }
      // },
      // {
      //   path: 'uploadInsuranceInfo/:id',
      //   component: uploadInsuranceInfo,
      //   meta: {
      //     thirdActiveIndex: '/financial/insuranceInfoManage'
      //   }
      // },
      // 发票管理
      // {
      //   path: 'payableinvoices',
      //   component: PayAbleInvoiceList
      // },
      // 采购付款
      // {
      //   path: 'payments/invoice/:id',
      //   component: Payment,
      //   meta: {
      //     thirdActiveIndex: '/financial/payments'
      //   }
      // },
      // {
      //   path: 'payments/prepayment/:id',
      //   component: Payment,
      //   meta: {
      //     thirdActiveIndex: '/financial/payments'
      //   }
      // },
      // {
      //   path: 'payments',
      //   component: PaymentList
      // },
      // {
      //   path: 'paymentsverify',
      //   component: PaymentList
      // },
      // {
      //   path: 'paymentsverify/invoice/:id',
      //   component: Payment
      // },
      // {
      //   path: 'paymentsverify/prepayment/:id',
      //   component: Payment
      // },
      // {
      //   path: 'paymentsconfirm',
      //   component: PaymentList
      // },
      // {
      //   path: 'paymentsconfirm/invoice/:id',
      //   component: Payment
      // },
      // {
      //   path: 'paymentsconfirm/prepayment/:id',
      //   component: Payment
      // },
      // 采购发票管理
      // {
      //   path: 'payableinvoice/:code/:id',
      //   component: PayAbleInvoice,
      //   meta: {
      //     thirdActiveIndex: '/financial/payableinvoices'
      //   }
      // },
      // {
      //   path: 'payableinvoices/:id',
      //   component: PayAbleInvoice,
      //   meta: {
      //     thirdActiveIndex: '/financial/payableinvoices'
      //   }
      // },
      // 预付款信息 相关
      // {
      //   path: 'prepayments',
      //   component: PrePaymentList
      // },
      // {
      //   path: 'prepayment/:id',
      //   component: PrePayment,
      //   meta: {
      //     thirdActiveIndex: '/financial/payments'
      //   }
      // },
      // {
      //   path: 'prepayments/:id',
      //   component: PrePayment,
      //   meta: {
      //     thirdActiveIndex: '/financial/prepayments'
      //   }
      // },
      // {
      //   path: 'apverifactions',
      //   component: ApVerifactionList
      // },
      // 账套管理
      // {
      //   path: 'apperiodmange',
      //   component: ApPeriodmange
      // },
      // 预付款核销查询
      // {
      //   path: 'searchprepayverify/:id',
      //   component: SearchPrepayVerify,
      //   meta: {
      //     thirdActiveIndex: '/financial/apverifactions'
      //   }
      // },
      // 预付款核销查询
      // {
      //   path: 'getinvoicelist/:id',
      //   component: GetInvoiceList
      // },
      // {
      //   path: 'reportmoduleview/:moduleName',
      //   component: ReportModuleView
      // },
      // {
      //   path: 'reportmoduleview/:moduleName/:id',
      //   component: ReportView
      // },
      // {
      //   path: 'compute',
      //   component: CostCompute
      // },
      // {
      //   path: 'compute/:id',
      //   component: CostComputeDetail,
      //   meta: {
      //     thirdActiveIndex: '/financial/compute'
      //   }
      // },
      // {
      //   path: 'update',
      //   component: CostUpdate
      // },
      // {
      //   path: 'params',
      //   component: CostAccountParams
      // },
      // {
      //   path: 'transaction',
      //   component: CostTransaction
      // },
      // {
      //   path: 'period',
      //   component: CostPeriod
      // },
      // {
      //   path: 'survivingreport',
      //   component: SurvivingReport
      // },
      // 内部结算管理
      {
        path: 'insideTradeManagement',
        component: insideTradeManagement,
        redirect: 'insideTradeManagement/insideSettlement',
        children: [
          // 内部结算单 列表
          {
            path: 'insideSettlement',
            component: insideSettlement
          },
          // 内部交易结算单详情
          {
            path: 'insideSettlement/:id',
            component: insideSettlementDetail,
            meta: {
              thirdActiveIndex: '/financial/insideTradeManagement/insideSettlement'
            }
          },
          // 新建内部交易结算单
          {
            path: 'newInsideSettlement',
            component: newInsideSettlement,
            meta: {
              thirdActiveIndex: '/financial/insideTradeManagement/insideSettlement'
            }
          },
          // 结算审批列表
          {
            path: 'settlementApproval',
            component: settlementApproval
          },
          // 结算审批详情
          {
            path: 'settlementApproval/:id',
            component: insideSettlementDetail,
            meta: {
              thirdActiveIndex: '/financial/insideTradeManagement/settlementApproval'
            }
          },
          // 应收单列表
          {
            path: 'receivable',
            component: receivable
          },
          // 应付单列表
          {
            path: 'shouldpay',
            component: shouldpay
          },
          // 跨机构医嘱查询
          {
            path: 'CrossAgencyAdvice',
            component: CrossAgencyAdvice
          }
        ]
      },
      // 票据管理 列表
      {
        path: 'billstocklist',
        component: BillStockList
      },
      // 票据管理 票据信息
      {
        path: 'billstockdetail',
        component: BillStockDetail,
        meta: {
          thirdActiveIndex: '/financial/billstocklist'
        }
      },
      // 票据管理 票据发放管理
      {
        path: 'billissuelist',
        component: BillIssueList
      },
      // 票据管理 票据发放
      {
        path: 'billissuedetail',
        component: BillIssueDetail,
        meta: {
          thirdActiveIndex: '/financial/billissuelist'
        }
      },
      // 票据管理 票据使用
      {
        path: 'billuse',
        component: BillUse
      },
      // 日结缴款
      {
        path: 'dailyPayment/:feeType?',
        component: dailyPament,
        meta: {
          thirdActiveIndex: '/financial/dailyPayment'
        }
      },
      // 日结缴款 缴款历史
      {
        path: 'dailyPamentHistory/:feeType?',
        component: dailyPamentHistory,
        meta: {
          thirdActiveIndex: '/financial/dailyPamentHistory'
        }
      },
      // 采付结算管理 入库付款
      {
        path: 'paymentEntry',
        component: PaymentWarehouseList,
        props: {
          type: 'entry'
        }
      },
      // 采付结算管理 入库付款详情
      {
        path: 'paymentEntryDetail/:id',
        component: PaymentWarehouseDetail,
        name: 'paymentEntryDetail',
        meta: {
          thirdActiveIndex: '/financial/paymentEntry',
          name: '付款信息'
        },
        props: {
          type: 'entry'
        }
      },
      // 采付结算管理 退库收款
      {
        path: 'paymentBack',
        name: 'paymentBack',
        component: PaymentWarehouseList,
        props: {
          type: 'back'
        }
      },
      // 采付结算管理 退库收款详情
      {
        path: 'paymentBackDetail/:id',
        name: 'paymentBackDetail',
        component: PaymentWarehouseDetail,
        meta: {
          thirdActiveIndex: '/financial/paymentBack',
          name: '收款信息'
        },
        props: {
          type: 'back'
        }
      },
      // 采付结算管理 发票列表
      {
        path: 'controlInvoices',
        name: 'controlInvoices',
        component: () => import('@/rcm/payment/invoice/index.vue')
      },
    ]
  }
]
export default router
