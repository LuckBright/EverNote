// 住院医生工作站
import Hospital from '@/inpatient/page/hospital.vue'

// 随访
import followup from '@/crm/page/visit'
import mytask from '@/crm/page/mytask'
import alltask from '@/crm/page/alltask'
import newfollowlist from '@/crm/page/healthy/newfollowlist'
import executetask from '@/crm/page/executetask'
import subtaskdetails from '@/crm/page/subtaskdetails'
import Treatment from '@/inpatient/page/open.vue'
import docswrapper from '@/inpatient/page/docswrapper'
import Bed from '@/inpatient/page/bed.vue'

// 患者管理
import patientmgt from '@/inpatient/page/patient.mgt.vue'

// 院感查询
// import infectedquery from '@/inpatient/page/infectedquery.vue'

// 医嘱模版管理
import PrescriptionTplList from '@/sob/page/recipe.template/layout'
import PrescriptionTplAdd from '@/sob/page/recipe.template/addtemplate'

// 新建随访
import addvisitDialog from '@/crm/page/addvisit.dialog'

// 病历管理
// import Case from '@/inpatient/page/case.mgt.vue'

// 解锁申请
import deblockApply from '@/inpatient/page/medicalrecord/deblock.apply.vue'
// 病历借阅
import recordBorrow from '@/inpatient/page/medicalrecord/record.borrow.vue'
// 病历召回
import recordRecall from '@/inpatient/page/medicalrecord/record.recall.vue'
// 电子病历详情页
import medicalRecord from '@/emr/page/medicalrecord/medicalrecord.index'

// 病历模版管理

// 病历模版管理
import templateManage from '@/emr/page/template.manage'

import patientdetail from '@/phr/page/patientdetail/index.vue'
import patientdetailChild from '@/phr/router/patientdetail.js'
export default [
  {
    name: 'resident',
    path: '/resident',
    redirect: '/resident/patientmgt',
    meta: {
      space: 'resident',
      type: '3', // 1-门诊；2-急诊；3-住院
      role: '1', // 角色 护士 - '2' | 医生 - '1'
      medicalType: '1' // 1住院 3 护士
    },
    component: Hospital,
    children: [
      {
        name: 'visit',
        path: 'visit',
        component: followup
      },
      {
        name: 'mytask',
        path: 'mytask',
        component: mytask
      },
      {
        name: 'alltask',
        path: 'alltask',
        component: alltask
      },
      {
        name: 'newfollowlist',
        path: 'newfollowlist',
        component: newfollowlist
      },
      {
        name: 'executetask',
        path: 'executetask/:patientId/:taskId',
        component: executetask
      },
      {
        name: 'subtaskdetails',
        path: 'subtaskdetails/:taskId/:patientId',
        component: subtaskdetails
      },
      {
        // 病区管理
        name: 'bed_resident',
        path: 'bed',
        component: Bed
      },
      {
        // 患者管理
        name: 'patientmgt_resident',
        path: 'patientmgt',
        redirect: '/resident/patientmgt/open',
        component: patientmgt,
        meta: {
          fullscreen: true,
          needSelectProvider: 'yes'
        },
        children: [
          {
            // 住院登记
            name: 'open',
            path: 'open',
            component: Treatment,
            meta: {
              topType: 2,
              // active: '/resident/patient',
              secActiveIndex: '/resident/patientmgt/open'
            }
          },
          {
            name: 'docs',
            path: 'docs/:id?',
            component: docswrapper,
            meta: {
              prole: 1, // 医生
              ptype: 1, // 住院
              sceneType: 1, // 1-住院医生 2-急诊 3-护理  权限控制要用
              qualityControl: 2, // 1门诊 2医生 3护士 //时限质控要用
              secActiveIndex: '/resident/patientmgt'
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
      // {
      //   //  病历管理
      //   name: 'case_resident',
      //   path: 'case',
      //   component: Case,
      //   meta: {
      //     secActiveIndex: '/resident/case'
      //   }
      // },
      // {
      //   //  院内感染查询
      //   name: 'infectedquery',
      //   path: 'infectedquery',
      //   component: infectedquery,
      //   meta: {
      //     secActiveIndex: '/resident/infectedquery'
      //   }
      // },
      // {
      //   // 医嘱模版
      //   name: 'residentTpleList',
      //   path: 'prescription/template/list/:visitType',
      //   component: PrescriptionTplList,
      //   meta: {
      //     noreg: true
      //   }
      // },
      // {
      //   // 医嘱个人模版
      //   name: 'templateAdd',
      //   path: 'prescription/template/add/:visitType',
      //   component: PrescriptionTplAdd,
      //   meta: {
      //     thirdActiveIndex: '/hospital/prescription/template/list/:visitType'
      //   }
      // },
      // {
      //   // 医嘱科室模版
      //   name: 'templateDptAdd',
      //   path: 'prescription/template/adddpt/:visitType',
      //   component: DeptTplAdd,
      //   meta: {
      //     thirdActiveIndex: '/hospital/prescription/template/list/:visitType'
      //   }
      // },
      // 医嘱模版
      {
        name: 'templateList',
        path: 'prescription/template/list/:visitType',
        component: PrescriptionTplList,
        meta: {
          noreg: true,
          needSelectProvider: 'yes'
        }
      },
      {
        name: 'templateEdit',
        path: 'prescription/template/editor/:visitType/:id',
        component: PrescriptionTplAdd,
        meta: {
          thirdActiveIndex: '/resident/prescription/template/list/3',
          needSelectProvider: 'yes'
        }
      },
      {
        name: 'templateAdd',
        path: 'prescription/template/:id/:visitType',
        component: PrescriptionTplAdd,
        meta: {
          thirdActiveIndex: '/resident/prescription/template/list/3',
          needSelectProvider: 'yes'
        }
      },
      {
        name: 'doc_templatemanage',
        path: 'prescription/template/templatemanage',
        component: templateManage,
        meta: {
          workshopTag: 'hospitalForDoctor',
          thirdActiveIndex: '/resident/prescription/template/templatemanage'
        }
      },
      {
        name: 'addvisitdialog',
        path: 'addvisitdialog',
        component: addvisitDialog,
        meta: {
          secActiveIndex: '/resident/addvisitdialog'
        }
      },
      {
        // 病历管理-解锁申请
        name: 'doc_deblockapply',
        path: '/resident/medicalmanage/deblockapply',
        component: deblockApply,
        meta: {
          secActiveIndex: '/resident/medicalmanage'
        }
      },
      {
        // 病历管理-病历借阅
        name: 'doc_recordborrow',
        path: '/resident/medicalmanage/recordborrow',
        component: recordBorrow,
        meta: {
          secActiveIndex: '/resident/medicalmanage'
        }
      },
      {
        // 病历管理-病历召回
        name: 'recordrecallForDoctor',
        path: '/resident/medicalmanage/recordrecall',
        component: recordRecall,
        meta: {
          secActiveIndex: '/resident/medicalmanage'
        }
      },
      {
        // 病历管理-病历召回
        name: 'medicalRecordDetailForDoctor',
        path: '/resident/medicalmanage/docs',
        component: medicalRecord,
        meta: {
          prole: 1, // 医生
          ptype: 1, // 住院
          sceneType: 1, // 1-住院医生 2-急诊 3-护理  权限控制要用
          secActiveIndex: '/resident/medicalmanage'
        }
      },
    ]
  }
]
