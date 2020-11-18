import HealthInsurance from '@/healthinsurance/insurance.vue'
import Welcome from '@/login/page/welcome'

// ----------------基础配置信息管理
// 基础信息查询
import basicInfoQuery from '@/healthinsurance/views/basicinfo-manage/basicinfo/basicinfoquery.vue'
import basicInfoQueryMenus from '@/healthinsurance/views/basicinfo-manage/basicinfo/menus.js'
// 目录管理
import directoryManage from '@/healthinsurance/views/basicinfo-manage/directorymanage/directorymanage.vue'
import directoryManageMenus from '@/healthinsurance/views/basicinfo-manage/directorymanage/menus.js'
// 科室信息查询
import deptManage from '@/healthinsurance/views/basicinfo-manage/depinfomanage/basedepinfo.vue'
import deptManageMenus from '@/healthinsurance/views/basicinfo-manage/depinfomanage/menus.js'
// 医师信息管理
import docInfoManage from '@/healthinsurance/views/basicinfo-manage/docinfomanage/docinfomanage.vue'
import docInfoManageMenus from '@/healthinsurance/views/basicinfo-manage/docinfomanage/menus.js'
// 操作员信息查询
import operatorInfoManage from '@/healthinsurance/views/basicinfo-manage/operatorinfomanage/operatorinfomanage.vue'
import operatorInfoManageMenus from '@/healthinsurance/views/basicinfo-manage/operatorinfomanage/menus.js'
// -----------------医保管控
import Control from '@/healthinsurance/views/control/control.vue'
// 身份管控->医保签到
import ControlIdentity from '@/healthinsurance/views/control/controlidentity.vue'
import SignIn from '@/healthinsurance/views/control/identity/sign.in.vue'
// 审批管理
import Approval from '@/healthinsurance/views/control/approval/approval.vue'
import ApprovalChildren from '@/healthinsurance/views/control/approval/menus.js'
// 住院医保管控
import Reconciliation from '@/healthinsurance/views/control/reconciliation/parent.vue'
// 信息查询
import controlInfoQuery from '@/healthinsurance/views/control/control-info-query/control-info-query.vue'
import controlInfoQueryMenus from '@/healthinsurance/views/control/control-info-query/menus.js'

// ------------------医保统计查询
// 门诊医保统计查询
import Outpatient from '@/healthinsurance/views/insurancestatistics/outpatient/outpatient.vue'
import OutpatientSettlementSummary from '@/healthinsurance/views/insurancestatistics/outpatient/settlementsummary/settlementinfo'
import OutpatientSettlementList from '@/healthinsurance/views/insurancestatistics/outpatient/settlementlist.vue'
import OutpatientPersonalInfo from '@/healthinsurance/views/insurancestatistics/outpatient/personal/personalinfo.vue'

// 住院医保统计查询
import Hospitalization from '@/healthinsurance/views/insurancestatistics/hospitalization/hospitalization.vue'
import HosSettlementSummary from '@/healthinsurance/views/insurancestatistics/hospitalization/settlementsummary/settlementinfo.vue'
import HosSettlementList from '@/healthinsurance/views/insurancestatistics/hospitalization/settlementlist'
import PersonalHistoryInfo from '@/healthinsurance/views/insurancestatistics/hospitalization/personalhistoryinfo'
import PatientCosts from '@/healthinsurance/views/insurancestatistics/hospitalization/patientcosts'

// -------------------医保对账管理
// 医保申报
import medicalReimbursement from '@/healthinsurance/views/medicalcheck/medicalreimbursement/medicalreimbursement.vue'
import medicalReimbursementMenus from '@/healthinsurance/views/medicalcheck/medicalreimbursement/menus.js'

// 医保对账
import medicalcheckreport from '@/healthinsurance/views/medicalcheck/medicalcheckreport/medicalcheckreport.vue'
import medicalcheckreportChildren from '@/healthinsurance/views/medicalcheck/medicalcheckreport/menus.js'

// 结算单查询
import settlementQuery from '@/healthinsurance/views/medicalcheck/settlementquery/settlementquery.vue'
import outpatientQuery from '@/healthinsurance/views/medicalcheck/settlementquery/outpatientquery.vue'
import hospitalQuery from '@/healthinsurance/views/medicalcheck/settlementquery/hospitalquery.vue'

// 医保结算上报
import SettlementReport from '@/healthinsurance/views/medicalcheck/settlementreport/settlementreport.vue'
import SettlementReportMenus from '@/healthinsurance/views/medicalcheck/settlementreport/menus.js'
export default [
  {
    path: '/hi/',
    component: HealthInsurance,
    redirect: '/hi/welcome',
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      // 基础配置信息管理
      {
        path: 'basicConfigInfo',
        component: Control,
        redirect: 'basicConfigInfo/basicInfoQuery',
        children: [{
          path: 'basicInfoQuery',
          component: basicInfoQuery,
          children: basicInfoQueryMenus
        },
        {
          path: 'directoryManage',
          component: directoryManage,
          children: directoryManageMenus
        },
        {
          path: 'deptManage',
          component: deptManage,
          children: deptManageMenus
        },
        {
          path: 'docInfoManage',
          component: docInfoManage,
          children: docInfoManageMenus
        },
        {
          path: 'OperatorManage',
          component: operatorInfoManage,
          children: operatorInfoManageMenus
        }]
      },
      {
        path: 'control',
        component: Control,
        redirect: 'control/controlidentity',
        children: [{
          path: 'controlidentity',
          component: ControlIdentity,
          children: [
            {
              path: 'signin',
              component: SignIn,
              meta: {
                thirdActiveIndex: '/hi/control/controlidentity'
              }
            }
          ]
        },
        // 审批
        {
          path: 'approval',
          component: Approval,
          children: ApprovalChildren
        },
        {
          path: 'controlhospitalization',
          component: Reconciliation,
          meta: {
            notFull: true
          }
        },
        {
          path: 'controlInfoQuery',
          component: controlInfoQuery,
          children: controlInfoQueryMenus
        }]
      },
      {
        path: 'medicalcheck',
        component: Control,
        redirect: 'medicalcheck/settlementQuery',
        children: [
          // 结算单查询
          {
            path: 'settlementQuery',
            component: settlementQuery,
            redirect: 'settlementQuery/outpatientQuery',
            children: [{
              path: 'outpatientQuery',
              component: outpatientQuery,
              meta: {
                thirdActiveIndex: '/hi/medicalcheck/settlementQuery'
              }
            },
            {
              path: 'hospitalQuery',
              component: hospitalQuery,
              meta: {
                thirdActiveIndex: '/hi/medicalcheck/settlementQuery'
              }
            }]
          },
          // 医保申报
          {
            path: 'medicalReimbursement',
            component: medicalReimbursement,
            redirect: 'medicalReimbursement/dataUpload',
            children: medicalReimbursementMenus
          },
          // 医保结算上报
          {
            path: 'settlementreport',
            component: SettlementReport,
            children: SettlementReportMenus
          },
          // 医保对账
          {
            path: 'medicalcheckreport',
            component: medicalcheckreport,
            children: medicalcheckreportChildren
          }]
      },
      {
        path: 'insurancestatistics',
        component: Control,
        redirect: 'insurancestatistics/outpatient',
        children: [
          {
            path: 'outpatient',
            component: Outpatient,
            children: [
              {
                path: 'summary',
                component: OutpatientSettlementSummary,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/outpatient'
                }
              },
              {
                path: 'list',
                component: OutpatientSettlementList,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/outpatient'
                }
              },
              {
                path: 'personalinfo',
                component: OutpatientPersonalInfo,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/outpatient'
                }
              }
            ]
          },
          {
            path: 'hospitalization',
            component: Hospitalization,
            children: [
              {
                path: 'summary',
                component: HosSettlementSummary,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/hospitalization'
                }
              },
              {
                path: 'list',
                component: HosSettlementList,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/hospitalization'
                }
              },
              {
                path: 'personalhistory',
                component: PersonalHistoryInfo,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/hospitalization'
                }
              },
              {
                path: 'patientcosts',
                component: PatientCosts,
                meta: {
                  thirdActiveIndex: '/hi/insurancestatistics/hospitalization'
                }
              }
            ]
          }
        ]
      }
    ]
  },
]
