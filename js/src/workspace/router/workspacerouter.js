import Workspace from '../page/workspace.vue'
import outpatient from '../page/outpatient/index.vue'

// phr 模版
// import phrtpllist from '@/form/page/phrtpllist'

// 处方模版
import PrescriptionTplLayout from '@/sob/page/prescription.template/layout'
import PrescriptionTplList from '@/sob/page/recipe.template/layout'
import PrescriptionTplAdd from '@/sob/page/recipe.template/addtemplate'

// 常用诊断
import Commondiagnosis from '@/sob/page/commondiagnosis'
// 随访
import followup from '@/crm/page/visit'
import mytask from '@/crm/page/mytask'
import alltask from '@/crm/page/alltask'
import newfollowlist from '@/crm/page/healthy/newfollowlist'
import executetask from '@/crm/page/executetask'
import subtaskdetails from '@/crm/page/subtaskdetails'
// 药品目录
import MaterialLists from '@/warehouse/page/institutionmaterial/materiallist.vue'
import MaterialListsee from '@/warehouse/page/institutionmaterial/materialsee.vue'
import MaterialDetail from '@/warehouse/page/institutionmaterial/materialdetail'

import adverseDrug from '@/workspace/page/adverse.drug.vue'

// 处方点评
import prescriptionReview from '@/workspace/page/prescription.review.vue'

// 病历模版管理
import templateManage from '@/emr/page/template.manage'
export default [
  {
    path: '/workspace/',
    redirect: '/workspace/outpatient',
    name: 'workspace',
    meta: {
      space: 'workspace',
      role: '1', // 角色 护士 - '2' | 医生 - '1'
      type: '1' // 1-门诊；2-急诊；3-住院
    },
    component: Workspace,
    children: [
      {
        path: 'prescriptionreview',
        name: 'prescriptionreview',
        component: prescriptionReview
      },
      { // 不良药品反应
        name: 'adverseDrug',
        path: 'adverseDrug',
        component: adverseDrug
      },
      {
        path: 'outpatient',
        name: 'patientcase',
        component: outpatient,
        meta: {
          active: '/workspace/outpatient'
        }
      },
      // {
      //   name: 'phrtpllist',
      //   path: 'phrtpllist',
      //   component: phrtpllist,
      //   meta: {
      //     thirdActiveIndex: '/workspace/phrtpllist'
      //   }
      // },
      {
        name: 'prescipeTpl',
        path: 'prescription/template/:tplType/:belong/:page',
        component: PrescriptionTplLayout
      },
      // 处方模版
      {
        name: 'templateList',
        path: 'prescription/template/list/:visitType',
        component: PrescriptionTplList,
        meta: {
          noreg: true
        }
      },
      {
        name: 'templateEdit',
        path: 'prescription/template/editor/:visitType/:id',
        component: PrescriptionTplAdd,
        meta: {
          thirdActiveIndex: '/workspace/prescription/template/list/:visitType'
        }
      },
      {
        name: 'templateAdd',
        path: 'prescription/template/:id/:visitType',
        component: PrescriptionTplAdd,
        meta: {
          thirdActiveIndex: '/workspace/prescription/template/list/:visitType'
        }
      },
      {
        path: 'commondiagnosis',
        component: Commondiagnosis
      },
      {
        name: 'templatemanage',
        path: 'prescription/template/templatemanage',
        component: templateManage,
        meta: {
          workshopTag: 'clinic',
          thirdActiveIndex: '/workspace/prescription/template/templatemanage'
        }
      },
      {
        name: 'followup',
        path: '/workspace/followup',
        component: followup
      },
      {
        name: 'mytask',
        path: '/workspace/mytask',
        component: mytask
      },
      {
        name: 'alltask',
        path: '/workspace/alltask',
        component: alltask
      },
      {
        name: 'newfollowlist',
        path: '/workspace/newfollowlist',
        component: newfollowlist
      },
      {
        name: 'executetask',
        path: '/workspace/executetask',
        component: executetask
      },
      {
        name: 'subtaskdetails',
        path: '/workspace/subtaskdetails',
        component: subtaskdetails
      },
      {
        name: 'druglist',
        path: 'druglist',
        component: MaterialLists
      },
      {
        name: 'drugdetail',
        path: 'drugdetail/:id',
        component: MaterialListsee
      },
      {
        name: 'materialdetail',
        path: 'materialdetail/:id',
        component: MaterialDetail
      }
    ]
  }
]
