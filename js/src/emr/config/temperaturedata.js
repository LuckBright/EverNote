// 血压变量
// systolicPressure----收缩压
// diastolicPressure----舒张压
const blood1 = 'systolicPressure'
const blood2 = 'diastolicPressure'
// 拒测外出需要清空的数据
const emptyTemp = {
  'TZ_TI_WEN': null,
  'DA_BIAN_CI_SHU': null,
  'JIANG_WEN_℃': null,
  'SHENG_WEN_℃': null,
  'TENG_TONG_PING_FEN_010': null,
  'ZHEN_TONG_HOU_PING_FEN_010': null,
  'XUAN_ZE_SHI_JIAN': null,
  'TZ_MAI_BO': null,
  'TZ_XIN_LU': null,
  'TZ_HU_XI': null,
  'DL_XUE_YA': null,
  'TZ_TI_ZHONG': null,
  'TZ_SHEN_GAO': null,
  'YE_TI_RU_LIANG_ml': null,
  'NIAO_LIANG_ml': null,
  'PI_SHI_JIE_GUO': null,
  'TZ_XUE_TANG': null,
  'TE_SHU_ZHI_LIAO': null
}
// 体温测量方式，体温，疼痛变化需要监听
const watchTmpData = {
  tmpType: 'TI_WEN_CE_LIANG_FANG_SHI',
  tmpNum: 'TZ_TI_WEN',
  pain: 'TENG_TONG_PING_FEN_010'
}
// 降温和升温
const tmpData = ['JIANG_WEN_℃', 'SHENG_WEN_℃']
// 镇痛
const ztData = ['ZHEN_TONG_HOU_PING_FEN_010']
// 可编辑的类型
const editableType = ['腋温', '口温', '肛温']
// 只读类型
const readonlyType = ['拒测', '外出']
// 腋温，口温，肛温可编辑元素
const editableObj = [
  'TZ_TI_WEN',
  'DA_BIAN_CI_SHU',
  'XUAN_ZE_SHI_JIAN',
  'TZ_MAI_BO',
  'TZ_XIN_LU',
  'TZ_HU_XI',
  'DL_XUE_YA',
  'TZ_TI_ZHONG',
  'TZ_SHEN_GAO',
  'YE_TI_RU_LIANG_ml',
  'NIAO_LIANG_ml',
  'PI_SHI_JIE_GUO',
  'TZ_XUE_TANG',
  'TE_SHU_ZHI_LIAO',
  'TENG_TONG_PING_FEN_010'
]
// 腋温，口温，肛温不可编辑元素
const editableObj2 = [
  'ZHEN_TONG_HOU_PING_FEN_010',
  'JIANG_WEN_℃',
  'SHENG_WEN_℃'
]
// 拒测和外出时，只读
const readonlyObj = [
  'TZ_TI_WEN',
  'DA_BIAN_CI_SHU',
  'XUAN_ZE_SHI_JIAN',
  'TZ_MAI_BO',
  'TZ_XIN_LU',
  'TZ_HU_XI',
  'DL_XUE_YA',
  'TZ_TI_ZHONG',
  'TZ_SHEN_GAO',
  'YE_TI_RU_LIANG_ml',
  'NIAO_LIANG_ml',
  'PI_SHI_JIE_GUO',
  'TZ_XUE_TANG',
  'TE_SHU_ZHI_LIAO',
  'JIANG_WEN_℃',
  'SHENG_WEN_℃',
  'ZHEN_TONG_HOU_PING_FEN_010',
  'TENG_TONG_PING_FEN_010',
  'ZONG_CHU_LIANG_ml',
  'ZONG_RU_LIANG_ml'
]
// 全部只读
const readOnlyAll = [
  'TI_WEN_CE_LIANG_FANG_SHI',
  'TZ_TI_WEN',
  'DA_BIAN_CI_SHU',
  'XUAN_ZE_SHI_JIAN',
  'TZ_MAI_BO',
  'TZ_XIN_LU',
  'TZ_HU_XI',
  'DL_XUE_YA',
  'TZ_TI_ZHONG',
  'TZ_SHEN_GAO',
  'YE_TI_RU_LIANG_ml',
  'NIAO_LIANG_ml',
  'PI_SHI_JIE_GUO',
  'TZ_XUE_TANG',
  'TE_SHU_ZHI_LIAO',
  'JIANG_WEN_℃',
  'SHENG_WEN_℃',
  'ZHEN_TONG_HOU_PING_FEN_010',
  'TENG_TONG_PING_FEN_010',
  'ZONG_CHU_LIANG_ml',
  'ZONG_RU_LIANG_ml'
]
const timeRangeStart2 = {
  0: '00:00:00 - 03:59:59',
  1: '04:00:00 - 07:59:59',
  2: '08:00:00 - 11:59:59',
  3: '12:00:00 - 15:59:59',
  4: '16:00:00 - 19:59:59',
  5: '20:00:00 - 23:59:59'
}
const timeRangeStart3 = {
  0: '01:00:00 - 04:59:59',
  1: '05:00:00 - 08:59:59',
  2: '09:00:00 - 12:59:59',
  3: '13:00:00 - 16:59:59',
  4: '17:00:00 - 20:59:59',
  5: ['21:00:00 - 23:59:59', '00:00:00 - 00:59:59']
}
const timeRangeStart4 = {
  0: '02:00:00 - 05:59:59',
  1: '06:00:00 - 09:59:59',
  2: '10:00:00 - 13:59:59',
  3: '14:00:00 - 17:59:59',
  4: '18:00:00 - 21:59:59',
  5: ['00:00:00 - 01:59:59', '22:00:00 - 23:59:59']
}
const timeRange = {
  2: timeRangeStart2,
  3: timeRangeStart3,
  4: timeRangeStart4
}
const timeSystem = [
  {
    value: 24,
    label: '24小时制'
  },
  {
    value: 12,
    label: '12小时制'
  }
]
const optionsof24 = [
  {
    label: ['02:00', '06:00', '10:00', '14:00', '18:00', '22:00'],
    value: [2, 6, 10, 14, 18, 22]
  },
  {
    label: ['03:00', '07:00', '11:00', '15:00', '19:00', '23:00'],
    value: [3, 7, 11, 15, 19, 23]
  },
  {
    label: ['04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    value: [4, 8, 12, 16, 20, 24]
  }
]
const optionsof12 = [
  {
    label: ['02:00', '06:00', '10:00', '02:00', '06:00', '10:00'],
    value: [2, 6, 10, 2, 6, 10]
  },
  {
    label: ['03:00', '07:00', '11:00', '03:00', '07:00', '11:00'],
    value: [3, 7, 11, 3, 7, 11]
  },
  {
    label: ['04:00', '08:00', '12:00', '04:00', '08:00', '12:00'],
    value: [4, 8, 12, 4, 8, 12]
  }
]
const selectTimeRange = {
  12: optionsof12,
  24: optionsof24
}
// 脉搏和体温的显示范围
const axisYRange = [
  {
    label: [33.6, 42, 12, 180],
    value: [33.6, 42, 12, 180]
  },
  {
    label: [34, 42.4, 20, 188],
    value: [34, 42.4, 20, 188]
  },
  {
    label: [33.6, 42.6, 12, 192],
    value: [33.6, 42.6, 12, 192]
  },
  {
    label: [33, 42, 0, 180],
    value: [33, 42, 0, 180]
  },
  {
    label: [34, 42.6, 20, 192],
    value: [34, 42.6, 20, 192]
  },
  {
    label: [33, 42.6, 0, 192],
    value: [33, 42.6, 0, 192]
  },
  {
    label: [33.8, 42, 16, 180],
    value: [33.8, 42, 16, 180]
  },
  {
    label: [34, 42, 20, 180],
    value: [34, 42, 20, 180]
  },
  {
    label: [34, 43, 20, 200],
    value: [34, 43, 20, 200]
  },
  {
    label: [34, 42.6, 20, 200],
    value: [34, 42.6, 20, 200]
  },
]

const patientInfo = [
  {
    name: '姓名',
    checked: false,
    key: 'name'
  },
  {
    name: '性别',
    checked: false,
    key: 'sex'
  },
  {
    name: '年龄',
    checked: false,
    key: 'age'
  },
  {
    name: '出生日期',
    checked: false,
    key: 'birthday'
  },
  {
    name: '科别',
    checked: false,
    key: 'dptName'
  },
  {
    name: '床号',
    checked: false,
    key: 'bed'
  },
  {
    name: '住院号',
    checked: false,
    key: 'hospitalNum'
  },
  {
    name: '入院日期',
    checked: false,
    key: 'enterDate'
  }
]
const TYPE = 'TYPE'
const BASE_INFO = 'BASE_INFO'
const IN_HOSPITAL_TXT = 'IN_HOSPITAL_TXT'
const OPERATION_TXT = 'OPERATION_TXT'
const TIME_MODE = 'TIME_MODE'
const TIME_PERIOD_CONFIG = 'TIME_PERIOD_CONFIG'
const TEMP_PULSE_SECTION = 'TEMP_PULSE_SECTION'
export {
  TYPE,
  BASE_INFO,
  IN_HOSPITAL_TXT,
  OPERATION_TXT,
  TIME_MODE,
  TIME_PERIOD_CONFIG,
  TEMP_PULSE_SECTION,
  blood1,
  blood2,
  emptyTemp,
  watchTmpData,
  tmpData,
  ztData,
  editableType,
  readonlyType,
  editableObj,
  editableObj2,
  readonlyObj,
  readOnlyAll,
  timeRange,
  timeSystem,
  selectTimeRange,
  optionsof24,
  patientInfo,
  axisYRange
}
