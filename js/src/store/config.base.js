
// 前端工程内用到的配置枚举类，对于一些租户之间，机构之间同的配置在这里列举出来
export const configArr = [
  'printModel',
  'memberModel',
  'isAppointNumber',
  'isHaveService',
  'FILE_SAFE_CHECK',
  'isPrintRefundForm',
  'PRprintConfig',
  'supportLoginTypes',
  'toKanbanAfterLogin',
  'clinicType',
  'mealContainService',
  'showMedicalInsurce',
  'AUTO_SAVE_MEDICAL_RECORD',
  'hnxdPrint',
  'showClinicCardFlag', // 患者搜索组件是否显示就诊卡读卡图标
  'need_contact_minage',
  'MEDITOR_IS_PAGINATE',
  'readICcardUrl',
  'enableYoumengStat', // 是否启用友盟统计
  'MEDITOR_IS_TRACK',
  'MEDICAL_RECORD_IS_LOCK', // 是否启用病历加锁功能 0 不启用 1启用
  'insurance_localhost', // 医保本地服务联调域名
  'showIcCardFlag', // 患者搜索组件是否显示医保卡读卡图标
  'showIdCardFlag', // 患者搜索组件是否显示身份证读卡图标
]

// 配置中心采用键值对的方式，都是字符串类型的，所以这块也采用字符串类型
export const baseConfig = {
  printModel: 2, // 打印模版  1 新和堂  2 光熙康复 3 美尔目
  PRprintConfig: '1',
  isPrintRefundForm: '1',  // 门诊医生，退库弹窗中是否打印退药单，1: 允许打印，0: 不显示打印退药单
  hnxdPrint: true, // 海南现代打印
  showMedicalInsurce: '1', // 是否录入/显示医保卡信息. 1 显示， 0 隐藏,
  memberModel: '1', // 创建客户建档 1：正常， 2： 海南
  mealContainService: '0', // 套餐是否包含医事服务费   1：包含；0：不包含
  toKanbanAfterLogin: '0', // 登录之后是否跳到看板页面
}
