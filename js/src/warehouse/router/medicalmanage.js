// 病历管理(机构设置工作站)
// 病历模版管理
import templateManage from '@/emr/page/template.manage'
// 病历系统配置
import MedicalSystemConfig from '@/form/page/medicalsystemconfig/manage.index.org'

const MEDICAL_MANAGE = [
  {
    path: 'templatemanage',
    component: templateManage,
    meta: {
      full: true,
      workshopTag: 'orgSetting',
      thirdActiveIndex: '/warehouse/templatemanage',
      rid: 'Auth_menu_clinic_medicalmanage_template'
    }
  },
  {
    path: 'medicalconfig',
    component: MedicalSystemConfig,
    meta: {
      full: true,
      workshopTag: 'orgSetting',
      thirdActiveIndex: '/warehouse/medicalconfig',
      rid: 'Auth_menu_clinic_medicalmanage_config'
    }
  }
]

export default MEDICAL_MANAGE
