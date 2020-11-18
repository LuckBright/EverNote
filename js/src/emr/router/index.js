// 病历模版管理
import templateManage from '@/emr/page/template.manage'
// 病历管理
export const MEDICAL_MANAGE = [
  {
    path: 'templatemanage',
    component: templateManage,
    meta: {
      workshopTag: 'groupManage'
    }
  }
]
// '/manages/templatemanage'
// 'Auth_menu_manages_medicalrecord_template'
export const getTemplateManageRoute = function ({
  workshopTag,
  thirdActiveIndex,
  rid
}) {
  /** workshopTag
   * orgSetting机构设置
   * tech医技
   * groupManage集团管理
   * hospitalForDoctor住院医生
   * hospitalForNurse住院护士
   * clinic 门急诊医生工作站
   * **/

  return [
    {
      path: 'templatemanage',
      component: templateManage,
      meta: {
        workshopTag,
        thirdActiveIndex,
        rid
      }
    }
  ]
}
