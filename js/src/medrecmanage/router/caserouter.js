// 病历管理工作站
import Hospital from '@/inpatient/page/hospital.vue'

// 运行病历
import RunRecord from '@/medrecmanage/page/recordmanage/runrecord.vue'
// 病历归档
import RecordArchive from '@/medrecmanage/page/recordmanage/recordarchive.vue'
// 病历打印
import RecordPrint from '@/medrecmanage/page/recordmanage/recordprint.vue'
// 解锁审核
import unlockAudit from '@/medrecmanage/page/recordmanage/unlock.audit.vue'
// 召回审核
import recallAudit from '@/medrecmanage/page/recordmanage/recall.audit.vue'
// 借阅审核
import ApprovBorrow from '@/medrecmanage/page/recordmanage/approv.borrow.vue'
// 电子病历详情页
import medicalRecord from '@/emr/page/medicalrecord/medicalrecord.index'
export default [
  {
    name: 'case',
    path: '/case',
    redirect: '/case/runrecord',
    component: Hospital,
    meta: {
      secActiveIndex: '/case/runrecord',
      route: 'case'
    },
    children: [
      {
        name: 'case_runrecord',
        path: 'runrecord',
        component: RunRecord,
        meta: {
          thirdActiveIndex: '/case/runrecord'
        }
      },
      {
        name: 'case_recordarchive',
        path: 'recordarchive',
        component: RecordArchive,
        meta: {
          thirdActiveIndex: '/case/recordarchive'
        }
      },
      {
        name: 'case_recordprint',
        path: 'recordprint',
        component: RecordPrint,
        meta: {
          // secActiveIndex: '/case/runrecord',
          thirdActiveIndex: '/case/recordprint',
          prole: 2// 需要用到打印权限,护士
        }
      },
      {
        name: 'unlockAudit',
        path: 'unlockaudit',
        component: unlockAudit,
        meta: {
          thirdActiveIndex: '/case/unlockaudit'
        }
      },
      {
        name: 'recallAudit',
        path: 'recallaudit',
        component: recallAudit,
        meta: {
          thirdActiveIndex: '/case/recallaudit'
        }
      },
      {
        name: 'case_approvborrow',
        path: 'approvborrow',
        component: ApprovBorrow,
        meta: {
          thirdActiveIndex: '/case/approvborrow'
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
      {
        // 病历管理-病历详情
        name: 'medicalRecordDetailForDoctor',
        path: '/resident/medicalmanage/docs',
        component: medicalRecord,
        meta: {
          prole: 1, // 医生
          ptype: 1, // 住院
          sceneType: 1, // 1-住院医生 2-急诊 3-护理  权限控制要用
          secActiveIndex: '/resident/medicalmanage'
        }
      }
    ]
  }
]
