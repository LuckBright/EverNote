/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-20 18:54:30
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-07 15:25:02
 */

const AUTH = 'not-auth-code'

// 100005 门诊统一发药流程 100006 住院统一发药流程 100007 门诊统一发药自动出库流程
// 多库房统一发药 (门诊)路由配置表 (multilibrary 文件夹)
const outpaitentSetting = [
  {
    path: 'audit',
    component: resolve => {
      require(['@/warehouse/views/drug/multilibrary/audit/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_audit',
    full: true,
    mark: ['100005', '100007'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'task',
    component: resolve => {
      require(['@/warehouse/views/drug/multilibrary/task/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_task',
    full: true,
    mark: ['100005', '100007'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'lack',
    component: resolve => {
      require(['@/warehouse/views/drug/multilibrary/lack/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_lack',
    full: true,
    mark: ['100005', '100007'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'back',
    component: resolve => {
      require(['@/warehouse/views/drug/multilibrary/back/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_back',
    full: true,
    mark: ['100005', '100007'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'record',
    component: resolve => {
      require(['@/warehouse/views/drug/multilibrary/record/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_record',
    full: true,
    mark: ['100005', '100007'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'settings',
    component: resolve => {
      require(['@/warehouse/views/drug/multilibrary/settings/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_settings',
    full: true,
    mark: ['100005', '100007'],
  },
]
// 多库房统一发药 (住院)路由配置表 (multilibrary 文件夹)
const hospitalSetting = [
  {
    path: 'focustask',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/task/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddprint',
    full: true,
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'setrule',
    full: true,
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/setrule/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddsetrule',
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'focussend',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/send/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddtask',
    full: true,
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'focuslack',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/lack/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddlack',
    full: true,
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'focusback',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/back/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddback',
    full: true,
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'focusrecord',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/record/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddrecord',
    full: true,
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'recorddetail',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/record/detail.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_recorddetail',
    full: true,
    mark: ['100006'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'focussettings',
    component: resolve => {
      require(['@/warehouse/views/drug/dispensing/settings/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_settings',
    full: true,
    mark: ['100006'],
  },
]

// 互联网医院流程 路由配置表 (internetmail 文件夹)
const internetMallSetting = [
  {
    path: 'internettask',
    component: resolve => {
      require(['@/warehouse/views/drug/internetmall/task/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_internetmall_internettask',
    full: true,
    mark: ['100008'],
  },
  {
    path: 'internetrecord',
    component: resolve => {
      require(['@/warehouse/views/drug/internetmall/record/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_internetmall_internetrecord',
    full: true,
    mark: ['100008'],
  },
  {
    path: 'internetlack',
    component: resolve => {
      require(['@/warehouse/views/drug/internetmall/lack/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_internetmall_internetlack',
    full: true,
    mark: ['100008'],
  },
]

// 超市收银订单流程 路由配置表 (cashier 文件夹)
const cashierSetting = [
  {
    path: 'cashierrecord',
    component: resolve => {
      require(['@/warehouse/views/drug/cashier/record/index.vue'], resolve)
    },
    full: true,
    mark: ['100009'],
  },
  {
    path: 'cashierback',
    component: resolve => {
      require(['@/warehouse/views/drug/cashier/back/index.vue'], resolve)
    },
    full: true,
    mark: ['100009'],
  },
]

// 动态路由配置表
export const routeSetting = [
  /*
   ********************* 【 住院分库房路由 】  ************************
   */
  {
    path: 'uddprint',
    component: resolve => {
      require(['@/warehouse/views/drug/hospital/taskprint/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddprint',
    full: true,
    mark: ['100004'], // 发药流程： 100004 => UDD药包生成流程
  },
  {
    path: 'uddtask',
    component: resolve => {
      require(['@/warehouse/views/drug/hospital/task/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddtask',
    full: true,
    mark: ['100004'], // 发药流程： 100004 => UDD药包生成流程
  },
  {
    path: 'uddlack',
    component: resolve => {
      require(['@/warehouse/views/drug/hospital/lack/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddlack',
    full: true,
    mark: ['100004'], // 发药流程： 100004 => UDD药包生成流程
  },
  {
    path: 'uddrecord',
    component: resolve => {
      require(['@/warehouse/views/drug/hospital/record/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddrecord',
    full: true,
    mark: ['100004'], // 发药流程： 100004 => UDD药包生成流程
  },
  {
    path: 'uddback',
    component: resolve => {
      require(['@/warehouse/views/drug/hospital/back/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_hospital_uddback',
    full: true,
    mark: ['100004'], // 发药流程： 100004 => UDD药包生成流程
  },
  /*
    ********************* 【 门诊分库房路由 】  ************************
  */
  {
    path: 'audit',
    component: resolve => {
      require(['@/warehouse/views/drug/outpaitent/audit/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_audit',
    full: true,
    mark: ['100001', '100002', '100003'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'receive',
    pathExpression: '/:patientId?', // 路由表达式
    component: resolve => {
      require(['@/warehouse/views/drug/outpaitent/receive/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_receive',
    full: true,
    mark: ['100001', '100002', '100003'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'record',
    component: resolve => {
      require(['@/warehouse/views/drug/outpaitent/record/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_record',
    full: true,
    mark: ['100001', '100002', '100003'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'lack',
    component: resolve => {
      require(['@/warehouse/views/drug/outpaitent/lack/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_lack',
    full: true,
    mark: ['100001', '100002', '100003'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'back',
    component: resolve => {
      require(['@/warehouse/views/drug/outpaitent/back/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_back',
    full: true,
    mark: ['100001', '100002', '100003'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  {
    path: 'task',
    component: resolve => {
      require(['@/warehouse/views/drug/outpaitent/task/index.vue'], resolve)
    },
    rid: 'Auth_menu_treasury_outpaitent_task',
    full: true,
    mark: ['100001', '100002', '100003'], // 发药流程所属标记（例如：属于流程一、流程二、流程三）
  },
  ...outpaitentSetting,
  ...hospitalSetting,
  ...internetMallSetting,
  ...cashierSetting,
]

// 多库房统一发药 (门诊)路由导航信息配置表
const outpaitentSettingNavChild = [
  { name: '任务审核', mark: ['100005', '100007'], path: 'audit', isControl: 1 },
  { name: '任务列表', mark: ['100005', '100007'], path: 'task' },
  { name: '缺货任务', mark: ['100005', '100007'], path: 'lack' },
  { name: '退药任务', mark: ['100005', '100007'], path: 'back' },
  { name: '发药记录', mark: ['100005', '100007'], path: 'record' },
  { name: '个性设置', mark: ['100005', '100007'], path: 'settings' },
]
// 多库房统一发药 (住院)路由导航信息配置表
const hospitalSettingNavChild = [
  { name: '设置规则', mark: ['100006'], path: 'setrule', auth: AUTH },
  { name: '任务列表', mark: ['100006'], path: 'focustask' },
  { name: '发药任务', mark: ['100006'], path: 'focussend' },
  { name: '缺货任务', mark: ['100006'], path: 'focuslack' },
  { name: '退药任务', mark: ['100006'], path: 'focusback' },
  { name: '发药记录', mark: ['100006'], path: 'focusrecord' },
  { name: '记录详情', mark: ['100006'], path: 'recorddetail', auth: AUTH },
  { name: '个性设置', mark: ['100006'], path: 'focussettings' },

  // { name: '个性设置', mark: ['100006'], path: 'focussettings' },
]

// 互联网商城 路由导航信息配置表
const internetMallSettingNavChild = [
  { name: '任务列表', mark: ['100008'], path: 'internettask' },
  { name: '缺货任务', mark: ['100008'], path: 'internetlack' },
  { name: '发货记录', mark: ['100008'], path: 'internetrecord' },
]

// 超市收银订单 路由导航信息配置表
const cashierSettingNavChild = [
  { name: '发货记录', mark: ['100009'], path: 'cashierrecord' },
  { name: '退货任务', mark: ['100009'], path: 'cashierback' },
]

// 路由导航信息配置表
export const routeSettingNavChild = [
  ...outpaitentSettingNavChild,
  ...hospitalSettingNavChild,
  ...internetMallSettingNavChild,
  ...cashierSettingNavChild,
  {
    name: '任务打印',
    isControl: 2, // 是否要打印
    mark: ['100004'],
    path: 'uddprint'
  },
  {
    name: '任务列表',
    mark: ['100004'],
    path: 'uddtask'
  },
  {
    name: '缺货任务',
    mark: ['100004'],
    path: 'uddlack'
  },
  {
    name: '发药记录',
    mark: ['100004'],
    path: 'uddrecord'
  },
  {
    name: '退药任务',
    mark: ['100004'],
    path: 'uddback'
  },
  {
    name: '任务审核',
    isControl: 1, // 是否要审核
    mark: ['100001', '100002', '100003'],
    path: 'audit'
  },
  {
    name: '收方发药',
    mark: ['100001', '100002', '100003'],
    path: 'receive'
  },
  {
    name: '任务列表',
    mark: ['100001', '100002', '100003'],
    path: 'task'
  },
  {
    name: '缺货任务',
    mark: ['100001', '100002', '100003'],
    path: 'lack'
  },
  {
    name: '退药任务',
    mark: ['100001', '100002', '100003'],
    path: 'back'
  },
  {
    name: '发药记录',
    mark: ['100001', '100002', '100003'],
    path: 'record'
  }
]
