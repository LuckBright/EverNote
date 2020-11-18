// 住院护士工作站
import Hospital from '../page/hospital.vue'

import wristbandList from '@/sob/page/wristband/list'
// import docs from '@/inpatient/page/docs'
import docswrapper from '@/inpatient/page/docswrapper'

// 病区管理
// import ward from '@/inpatient/page/ward.mgt.vue'

// 患者管理
import patientmgt from '@/inpatient/page/patient.mgt.vue'

// 医嘱管理
import adviceLayout from '@/inpatient/page/advice.manage/manage.layout'
import adviceReview from '@/inpatient/page/advice.manage/review'
import adviceResolve from '@/inpatient/page/advice.manage/resolve'
import adviceExecute from '@/inpatient/page/advice.manage/execute'
import sampleManage from '@/inpatient/page/advice.manage/sample.manage'

// 执行打印
import printLayout from '@/inpatient/page/execute.print/print.layout'
import executeOrder from '@/inpatient/page/execute.print/execute.order'
import bottlePaper from '@/inpatient/page/execute.print/bottle.paper'
import infusionCard from '@/inpatient/page/execute.print/infusion.card'

// 病历管理
// 解锁申请
import deblockApply from '@/inpatient/page/medicalrecord/deblock.apply.vue'
// 病历借阅
import recordBorrow from '@/inpatient/page/medicalrecord/record.borrow.vue'
// 病历召回
import recordRecall from '@/inpatient/page/medicalrecord/record.recall.vue'

// 患者医嘱
import patientAdvice from '@/inpatient/page/advice.manage/patient.advice'
import patientFeeList from '@/inpatient/page/advice.manage/patient.fee'
// 历史就诊

import patientInfo from '@/crm/components/patiententry_horizontal'

// 体温表
import memberbaseinfo from '@/crm/page/memberbaseinfo'
// 随访
import followup from '@/crm/page/visit'
import mytask from '@/crm/page/mytask'
import alltask from '@/crm/page/alltask'
import newfollowlist from '@/crm/page/healthy/newfollowlist'
import executetask from '@/crm/page/executetask'
import subtaskdetails from '@/crm/page/subtaskdetails'

// 计费模版
import billtemplate from '@/sob/page/recipe.template/layout'
import PrescriptionFeeTplAdd from '@/sob/page/recipe.template/addfeetemplate'
// import DeptFeeTplAdd from '@/sob/page/recipe.template/dptfeetemplate'
// 病历模版管理
// import { getTemplateManageRoute } from '@/emr/router/index.js'

// 病历模版管理
import templateManage from '@/emr/page/template.manage'
// 欠费查询
// import Arrearagequery from '@/rcm/page/hospitalization/arrearagequery'
// 电子病历详情页
import medicalRecord from '@/emr/page/medicalrecord/medicalrecord.index'

import patientdetail from '@/phr/page/patientdetail/index.vue'
import patientdetailChild from '@/phr/router/patientdetail.js'
export default [
  {
    name: 'inpatient',
    path: '/inpatient',
    redirect: '/inpatient/patientmgt',
    meta: {
      space: 'inpatient',
      type: '3', // 1-门诊；2-急诊；3-住院
      role: '2', // 角色 护士 - '2' | 医生 - '1'
      medicalType: '3' // 1住院 3 护理
    },
    component: Hospital,
    children: [
      // ...getTemplateManageRoute({
      //   workshopTag: 'hospitalForNurse'
      // }),
      // {
      //   path: 'template',
      //   name: 'template',
      //   redirect: 'template/templatemanage',
      //   children: [
      //     ...getTemplateManageRoute({
      //       workshopTag: 'hospitalForNurse'
      //     }),
      //   ]
      // },
      {
        name: 'templatemanage',
        path: 'tplmanage/templatemanage',
        component: templateManage,
        meta: {
          workshopTag: 'hospitalForNurse',
          thirdActiveIndex: '/inpatient/tplmanage/templatemanage'
        }
      },

      // {
      //   // 病区管理
      //   name: 'ward',
      //   path: 'ward',
      //   component: ward,
      //   meta: {
      //     active: '/inpatient/ward'
      //   }
      // },
      // 费用模版
      {
        path: 'billtemplate/:visitType',
        name: 'feeTemplateList',
        component: billtemplate,
        meta: {
          needSelectProvider: 'yes'
        }
      },
      {
        path: 'billtemplate/:id/:visitType',
        name: 'feeTemplateAdd',
        component: PrescriptionFeeTplAdd,
        meta: {
          secActiveIndex: '/inpatient/billtemplate/5'
        }
      },
      {
        // 患者管理
        name: 'patientmgt',
        path: 'patientmgt',
        component: patientmgt,
        redirect: '/inpatient/patientmgt/advice',
        meta: {
          fullscreen: true,
          needSelectProvider: 'yes'
        },
        children: [
          {
            path: 'docs',
            component: docswrapper,
            meta: {
              prole: 2, // 护士
              ptype: 1, // 住院
              sceneType: 3, // 1-住院医生 2-急诊 3-护理//权限控制要用
              qualityControl: 3, // 1门诊 2医生 3护士 //时限质控要用
              handleType: 1, // 操作类型
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'advice',
            component: patientAdvice,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'fee',
            component: patientFeeList,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'patientinfo',
            component: patientInfo,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            }
          },
          {
            path: 'patientdetail',
            component: patientdetail,
            meta: {
              secActiveIndex: '/inpatient/patientmgt'
            },
            children: [
              ...patientdetailChild
            ]
          }
        ]
      },
      {
        name: 'ivisit',
        path: 'ivisit',
        component: followup
      },
      {
        name: 'imytask',
        path: 'imytask',
        component: mytask
      },
      {
        name: 'ialltask',
        path: 'ialltask',
        component: alltask
      },
      {
        name: 'inewfollowlist',
        path: 'inewfollowlist',
        component: newfollowlist
      },
      {
        name: 'iexecutetask',
        path: 'iexecutetask/:patientId/:taskId',
        component: executetask
      },
      {
        name: 'isubtaskdetails',
        path: 'isubtaskdetails/:taskId/:patientId',
        component: subtaskdetails
      },
      // {
      //   path: 'docs/:id?',
      //   component: docswrapper
      // },
      {
        path: 'memberbaseinfo/:id?',
        component: memberbaseinfo
      },
      {
        // 腕带管理
        name: 'wristband',
        path: 'wristband',
        component: wristbandList,
        meta: {
          active: '/inpatient/wristband/2'
        }
      },
      {
        // 腕带管理
        name: 'wristbandPage',
        path: 'wristband/:type',
        component: wristbandList,
        meta: {
          active: '/inpatient/wristband/2'
        }
      },
      {
        name: 'adviceManage',
        path: 'advice',
        component: adviceLayout,
        redirect: 'advice/review',
        meta: {
          needSelectProvider: 'yes'
        },
        children: [
          {
            name: 'review',
            path: 'review',
            component: adviceReview,
            meta: {
              active: '/inpatient/advice/review',
            }
          },
          {
            name: 'resolve',
            path: 'resolve',
            component: adviceResolve,
            meta: {
              active: '/inpatient/advice/review',
            }
          },
          {
            name: 'execute',
            path: 'execute',
            component: adviceExecute,
            meta: {
              active: '/inpatient/advice/review',
            }
          },
          {
            name: 'sampleManage',
            path: 'sampleManage',
            component: sampleManage,
            meta: {
              active: '/inpatient/advice/review',
            }
          }
        ]
      },
      {
        name: 'executePrint',
        path: 'print',
        component: printLayout,
        redirect: 'print/executeOrder',
        meta: {
          needSelectProvider: 'yes'
        },
        children: [
          {
            name: 'executeOrder',
            path: 'executeOrder',
            component: executeOrder,
            meta: {
              active: '/inpatient/print/executeOrder',
            }
          },
          {
            name: 'bottlePaper',
            path: 'bottlePaper',
            component: bottlePaper,
            meta: {
              active: '/inpatient/print/bottlePaper',
            }
          },
          {
            name: 'infusionCard',
            path: 'infusionCard',
            component: infusionCard,
            meta: {
              active: '/inpatient/print/infusionCard',
            }
          }
        ]
      },
      {
        // 病历管理-解锁申请
        name: 'nur_deblockapply',
        path: '/inpatient/medicalmanage/deblockapply',
        component: deblockApply,
        meta: {
          secActiveIndex: '/inpatient/medicalmanage'
        }
      },
      {
        // 病历管理-病历借阅
        name: 'nur_recordborrow',
        path: '/inpatient/medicalmanage/recordborrow',
        component: recordBorrow,
        meta: {
          secActiveIndex: '/inpatient/medicalmanage'
        }
      },
      {
        // 病历管理-病历召回
        name: 'recordrecallForNurse',
        path: '/inpatient/medicalmanage/recordrecall',
        component: recordRecall,
        meta: {
          secActiveIndex: '/inpatient/medicalmanage'
        }
      },
      {
        // 病历管理-病历详情
        name: 'medicalRecordDetailForNurse',
        path: '/inpatient/medicalmanage/docs',
        component: medicalRecord,
        meta: {
          prole: 2, // 护士
          ptype: 1, // 住院
          sceneType: 3, // 1-住院医生 2-急诊 3-护理//权限控制要用
          secActiveIndex: '/inpatient/medicalmanage'
        }
      },
      // {
      //   // 欠费查询
      //   name: 'arrearagequery',
      //   path: 'arrearagequery',
      //   component: Arrearagequery
      // }
    ]
  }
]
