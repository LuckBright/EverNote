/**
 * @Description: 存放所有表格配置对应的id的文件
 * @author fuyongbo@everjiankang.com
 * @date 2019-04-12
*/
/* 在表格列数较多的情况下 表格列的宽度 */
export const tableColWidth = {
  name2W54: 54, // 名称 以及 内容最大不超过2个字的列 如性别
  name3W65: 65, // 名称 以及 内容最大不超过3个字的列
  name4W80: 80, // 名称 以及 内容最大不超过4个字的列
  name5W90: 90, // 名称 以及 内容最大不超过5个字的列
  name6W105: 105, // 名称 以及 内容最大不超过6个字的列
  name7W120: 120, // 内容不超过7个字的列
  name8W180: 180,
  w150: 150,
  w170: 170,
  w200: 200,
  w220: 220,
  w300: 300,
  w400: 400,
  dateW105: 105, // yyyy-MM-dd
  phoneW115: 115, // 手机号
  datetimeW150: 150, // yyyy-MM-dd HH:mm
  datetimeAllW160: 165, // yyyy-MM-dd HH:mm:ss
  idCardW175: 175, // 身份证
  btn1W60: 60, // 按钮列 1个按钮
  btn2W110: 110, // 按钮列 2个按钮
  btn3W170: 170, // 按钮列 3个按钮
}
/* demo中config table 的id */
export const DEMO_EVERTABLE_CONFIG = 'demo.evertable.config'
export const DEMO_EVERTABLE_REMOTE = 'demo.evertable.remote'
export const DEMO_EVERTABLE_REMOTE1 = 'demo.evertable.remote1'
export const DEMO_EVERTABLE_REMOTE2 = 'demo.evertable.remote2'
export const CRM_PACKAGESALELIST = 'crm.packagesalelist'
export const CRM_SERVICE_PANEL_LIST = 'crm.service.panel.list2'
export const FOLLOW_TEMPLATE = 'follow.template'
export const FOLLOW_TASK = 'follow.task'
export const STORAGE_MEDICINE_CONFIG = 'storage.medicine.config1' // 库房发药处方
export const STORAGE_MEDICINE_AUDIT_CONFIG = 'storage.medicine.audit.config' // 库房发药处方审核
export const QUEUE_MANAGEMENT = 'queue.management'
export const OUTPATIENT_SENDADVICE = 'outpatient.sendadvice'  // 门诊医嘱显示table
export const OUTPATIENT_FEEADVICE = 'outpatient.feeadvices'   // 门诊补费table
export const HOSPITAL_SENDADVICE = 'hospital.sendadvice'    // 住院医嘱显示table
export const HOSPITAL_REVIEW = 'hospital.review/'      // 住院医嘱审核table
export const HOSPITAL_EXECUTE = 'hospital.execute'     // 住院医嘱执行table
export const HOSPITAL_RESOLVE_MEDICINE = 'hospital.resolve.medicine'     // 住院医嘱分解药品分解table
export const HOSPITAL_RESOLVE_NOMEDICINE = 'hospital.resolve.nomedicine/'     // 住院医嘱分解非药品分解table
export const HOSPITAL_RESOLVE_MEDICINE_SEARCH = 'hospital.resolve.medicine.search'     // 住院医嘱分解药品分解查询table
export const HOSPITAL_RESOLVE_NOMEDICINE_SEARCH = 'hospital.resolve.nomedicine.search'     // 住院医嘱分解非药品分解查询table
export const HOSPITAL_EXECUTE_ORDER = 'hospital.execute.order'    // 住院执行打印执行单table
export const HOSPITAL_INFUSION_CARD = 'hospital.infusion.card'    // 住院执行打印输液卡table
export const HOSPITAL_SAMPLE = 'hospital.sample'    // 住院标本管理table
export const HOSPITAL_MGT_SENDADVICE = 'hospital.mgt.sample'    // 住院护士医嘱显示table
export const HOSPITAL_RESOLVE_HISTORY = 'hospital.resolve.history'    // 住院护士医嘱分解记录table
export const EOP_COMPLATE = 'eop.complated'    // 手麻工作台已完成table
export const EOP_UNDONE = 'eop.undone'    // 手麻工作台未完成table
export const EOP_CANCLE = 'eop.cancle'    // 手麻工作台已取消table
export const EOP_CHECK_LIST = 'eop.check.list'    // 医技工作台首页队列列表
export const EOP_PATIENT_LIST = 'eop.patient.list'    // 医技工作台护士医生队列列表
export const CSA_PLAN_LIST = 'csa.plan.list'    // 手麻待安排列表
export const CSA_SHOW_LIST = 'csa.show.list'    // 手麻患者列表
export const CSA_EXECUTE_LIST = 'csa.execute.list' // 手麻执行登记列表
export const CSA_SENDADVICE = 'csa.sendadvice.list' // 手麻医嘱列表
export const HOSPITAL_RESIDENT_FULL = 'hospital.resident.full' // 住院医生全屏展示患者列表
export const IHSYSTEM_SENDADVICE = 'ihsystem.sendadvice'  // 门诊医嘱显示table
export const RCM_SETTLEMENTS = 'rcm.settlements1' // 门诊收费查询统计结算单查询
export const OUTPATIENT_INCOME_FORM = 'outpatient.income.form1' // 门诊收费查询统计收费明细查询
export const HOSPITAL_SETTLE = 'hospital.settle' // 住院收费 结算单查询
export const HOSPITAL_EXPENSE_DETAILS = 'hospital.expense.details' // 住院收费 结算单查询
export const SYSTEMSET_TECHTHIRDCONFIG = 'systemset.techthirdconfig' // 系统配置 第三方对接配置
