import adt from '../page/hospitalization'
import Welcome from '@/login/page/welcome'
import register from '@/adt/page/register' // 入院办理 入院登记
import bedSearch from '@/adt/page/bedsearch' // 床位查询
import inHosManage from '@/adt/page/inhosmanage' // 在院患者管理
import moneyManage from '@/adt/page/moneymanage' // 催款管理
import moneyRules from '@/adt/page/moneyrules' // 催款规则
import member from '@/crm/page/member' // 客户管理
import leaveHospita from '@/adt/page/leavehospita' // 出院管理
import patientdialog from '@/adt/page/patientdialog' // 在院管理详情
import patientdetails from '@/adt/page/patientdetails'
import leavepatient from '@/adt/page/leavepatientdialog'
import depositManage from '@/rcm/page/hospitalization/depositmanage'

// rcm 业务
import chargetab from '@/rcm/page/hospitalization/chargetab'
import refundhospital from '@/rcm/page/hospitalization/refundhospital'
import HospitalizationDateForm from '@/rcm/page/income/hospitalizationday/hospitalizationdateform'
import hosdaily from '@/rcm/page/income/hospitalizationday/hosdaily'
import CostListSearch from '@/rcm/page/hospitalization/costlistsearch'
import Reports from '@/rcm/page/hospitalization/reports'
import drugsummary from '@/rcm/page/hospitalization/drugsummary'
import drugdetail from '@/rcm/page/hospitalization/drugdetail'

// 20200724调整住院收费菜单
import hospitalSettle from '@/rcm/page/hospitalization/hospitalsettle.vue'
import depositPayment from '@/rcm/page/hospitalization/depositpayment.vue'
import depositPaymentDetail from '@/rcm/page/hospitalization/depositpaymentdetail.vue'
import settlementPay from '@/rcm/page/hospitalization/settlementpay.vue'
import settlementPayDetail from '@/rcm/page/hospitalization/settlementpaydetail.vue'
import settlementQuery from '@/rcm/page/hospitalization/settlementquery.vue'
import settlementQueryDetail from '@/rcm/page/hospitalization/settlementquerydetail.vue'
// 住院 支付流水查询
import hospitalPaymentFlow from '@/rcm/page/hospitalization/hospitalpaymentflow.vue'
// 住院 费用明细查询
import hospitalExpenseDetails from '@/rcm/page/hospitalization/hospitalexpensedetails.vue'

export default [
  {
    path: '/adt',
    name: 'adt',
    redirect: '/adt/register',
    component: adt,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      // 入院登记
      {
        path: 'register',
        name: 'register',
        component: register
      },
      // 床位查询
      {
        path: 'bedsearch',
        component: bedSearch
      },
      // 客户管理
      {
        path: 'member',
        component: member
      },
      // 出院管理-患者详情(列表)
      {
        path: 'leaveHospita',
        component: leaveHospita
      },
      // 出院管理-患者详情-详情
      {
        path: 'leavepatient',
        component: leavepatient
      },
      {
        path: 'patientdialog',
        redirect: 'patientdialog/patientdetails',
        component: patientdialog,
        children: [
          // 患者详情-详情（只读）tocheck没找到入口
          {
            path: 'patientdetails',
            component: patientdetails,
            meta: {
              thirdActiveIndex: '/adt/patientdialog/patientdetails'
            }
          },
          // 患者详情-详情（只读）tocheck没找到入口
          {
            path: 'depositmanage',
            component: depositManage,
            meta: {
              thirdActiveIndex: '/adt/patientdialog/depositmanage',
              type: 1
            }
          },
          // 患者详情-详情（只读）tocheck没找到入口
          {
            path: 'chargetab',
            component: chargetab,
            meta: {
              thirdActiveIndex: '/adt/patientdialog/chargetab'
            }
          }
        ]
      },
      // 在院管理-在院患者管理
      {
        path: 'inhosmanage',
        component: inHosManage,
        children: [
          {
            path: 'chargedetail',
            component: chargetab,
            meta: {
              thirdActiveIndex: '/adt/chargedetail'
            }
          },
          {
            path: 'retirementmanage',
            component: refundhospital,
            meta: {
              thirdActiveIndex: '/adt/retirementmanage'
            }
          },
        ]
      },
      // 在院管理-催款管理
      {
        path: 'moneymanage',
        component: moneyManage,
        meta: {
          thirdActiveIndex: '/adt/moneymanage'
        }
      },
      // 在院管理-欠费规则
      {
        path: 'moneyrules',
        component: moneyRules,
        meta: {
          thirdActiveIndex: '/adt/moneyrules'
        }
      },
      // 住院收费
      {
        path: 'hospitalSettle',
        component: hospitalSettle,
        redirect: 'hospitalSettle/depositPayment',
        children: [
          // 住院收费-押金收费
          {
            path: 'depositPayment',
            component: depositPayment
          },
          // 住院收费-押金收费-详情
          {
            path: 'depositPayment/detail',
            component: depositPaymentDetail,
            meta: {
              thirdActiveIndex: '/adt/hospitalSettle/depositPayment'
            }
          },
          // 住院收费-结算收费
          {
            path: 'settlementPay',
            component: settlementPay
          },
          // 住院收费-结算收费-详情
          {
            path: 'settlementPay/detail',
            component: settlementPayDetail,
            meta: {
              thirdActiveIndex: '/adt/hospitalSettle/settlementPay'
            }
          },
          // 住院收费-结算单查询
          {
            path: 'settlementQuery',
            component: settlementQuery
          },
          // 住院收费-支付流水查询
          {
            path: 'hospitalpaymentflow',
            component: hospitalPaymentFlow
          },
          // 住院收费-费用明细查询
          {
            path: 'hospitalexpensedetails',
            component: hospitalExpenseDetails
          },
          // 住院收费-结算单查询
          {
            path: 'settlementQuery/detail',
            component: settlementQueryDetail,
            meta: {
              thirdActiveIndex: '/adt/hospitalSettle/settlementQuery'
            }
          }
        ]
      },
      // 日结处理-住院收费日结（feeType=1） 预交金日结（feeType=0）
      {
        path: 'daily/settlement/:feeType/:id?',
        name: 'hospitalizationettlementId',
        component: HospitalizationDateForm
      },
      // 日结处理-住院日结
      {
        path: 'daily/hosdaily',
        component: hosdaily
      },
      // 统计查询-费用清单查询
      {
        path: 'costlistsearch',
        component: CostListSearch
      },
      // 统计查询-收款报表
      {
        path: 'reports',
        component: Reports
      },
      // 统计查询-住院药品汇总
      {
        path: 'drugsummary',
        component: drugsummary
      },
      // 统计查询-住院药品明细
      {
        path: 'drugdetail',
        component: drugdetail
      },
    ]
  }
]
