/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-10-31 11:18:33
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-05-25 10:57:53
 */
/**
 * 常量定义
 */
// 补打属性定义
export const IS_REPRINT = 'isReprint'
export const now = Date.now()
export const oneDay = 24 * 60 * 60 * 1000

// el-aside width
export const ASIDE_WIDTH = [350, 500]

// 中药类型 + 协定方
export const CHINESE_MEDICINE_TYPE = ['303', '304', '3002']

// 任务列表筛选条件规则
export const SCREEN_TASK_CONDITIONS = [
  // { name: '显示缺货', field: 'containShort' },
  // { name: '显示异常', field: 'containException' },
  // { name: '显示已取消', field: 'containCancelled' }, // 2019-12-27 @李建辉@安百强@王强 去除门诊发药中已取消数据
  { name: '显示其他药房', field: 'containOtherStorageroom' },
]
// 发货方式
export const SEND_MODE = [
  { id: 0, name: '自取' },
  { id: 1, name: '邮寄' },
  // { id: 2, name: '自备' }, // todo: 830版本没有自备
]
export const HOSPITAL_SEND_MODE = [  // 住院标题
  { id: 3, name: '摆药' },
  { id: 4, name: '发药' },
  // 退药标题
  { id: 8, name: '审核' },
  { id: 9, name: '入库' }
]
// 审核标记
export const AUDIT_STATUS = [
  { id: 1, name: '待审核' },
  { id: 0, name: '驳回', color: 'red' },
  { id: 2, name: '审核通过', color: 'cGreen' }
]
// 退药审核标记
export const BACK_AUDIT_STATUS = [
  { id: 0, name: '待审核' },
  { id: 1, name: '驳回', color: 'red' },
  { id: 2, name: '审核通过', color: 'cGreen' }
]
// 打印标记
export const IS_PRINT = [
  { id: 0, name: '否' },
  { id: 1, name: '是' },
]
// 超时标识
export const IS_INVALID = [
  { id: 0, name: '否' },
  { id: 1, name: '非当日' },
  { id: 2, name: '超时' },
]
// 邮寄标识
export const MAIL_FLAG = [
  { id: 0, name: '待邮寄' },
  { id: 1, name: '已邮寄', color: 'cGreen' }
]
// 异常标记
export const IDENTIFICATION = [
  { id: 0, name: '正常' },
  { id: 1, name: '异常' }
]
// 缺货标记
export const SHORTAGE = [
  { id: 0, name: '正常' },
  { id: 23, name: '缺货' }
]
// 发药单状态
export const DISPENSE_STATUS = [
  { id: 1, name: '待确认' },
  { id: 2, name: '待出库' },
  { id: 3, name: '已完成', color: 'cGreen' },
  { id: 4, name: '无法到货', color: 'cOrg' },
  { id: 5, name: '处方取消', color: 'red' },
  { id: 6, name: '超时取消', color: 'red' }
]
// 表格列无数据时展示内容
export const tableDefaultCellValue = '-'
// 物资状态或标识图标
export const ICONS = {
  identification: 'icon-yi',
  shortage: 'icon-que2',
  taskType: {
    299: 'icon-haocai',
    300: 'icon-haocai',
    10008: 'icon-shangpin1',
    301: 'icon-yaopin1',
    302: 'icon-yaopin1',
    303: 'icon-zhongyaopeisong',
    3002: 'icon-zhongyaopeisong',
    304: 'icon-zhongyaopeisong'
  },
  posted: 'icon-kuaidi2'
}
// 占位标识图标字段
export const PLACEHOLDER_ICON = Object.keys(ICONS)

// 发药表格checkbox宽度
export const checkboxWidth = 40

// 退药状态
export const BACK_STATUS = [
  { id: 20, name: '待入库', subName: '待退货' },
  { id: 21, name: '已完成', color: 'cGreen' },
  { id: 22, name: '拒收', color: 'cOrange' },
  { id: 23, name: '取消', color: 'red' },
]

/**
 * 住院枚举值
*/

// 住院单状态
export const HOSPITAL_STATUS = [
  { id: 1, name: '待确认' },
  { id: 12, name: '待摆药' },
  { id: 2, name: '待发药' },
  { id: 3, name: '已完成', color: 'cGreen' },
  { id: 4, name: '无法到货', color: 'cBlue' },
  { id: 5, name: '已取消' }
]
export const HOSPITAL_ICON_FONT = [
  { id: 'status', name: 4, title: '无法到货', iconfont: 'icon-wufadaohuo1' },
  { id: 'shortage', name: 23, title: '缺货', iconfont: 'icon-que2' },
  { id: 'identification', name: 1, title: '异常', iconfont: 'icon-yi1' },
  { id: 'dateType', name: 1, title: '今日发药', iconfont: 'icon-today' },
  { id: 'isPrint', name: [1, 2], title: '已打印', iconfont: 'icon-yin' },
]

// 库房打印配置options
export const UDD_OPTIONS = [ // udd药包 code_zh:中药打印code
  { id: 1, name: '70mm*55mm', code: 'ZY_WESTERN_MEDICINE_PACKAGE_LABEL', url: require('@/assets/img/printstyle/ipd70_55.png') }
]
export const DRUG_OPTIONS = [ // 药签
  { id: 1, name: '50mm*30mm', code: 'ZY_YAO_QIAN', url: require('@/assets/img/printstyle/opd50_30.png') }
]
export const CHINESE_DRUG_OPTIONS = [ // 住院中药处方笺
  { id: 1, name: '50mm*30mm', code: 'ZY_ZHONG_YAO_CHU_FANG_DAN', url: require('@/assets/img/printstyle/opd50_30.png') }
]
export const FATHER_SON_OPTIONS = [ // 父子医嘱
  { id: 1, name: '70mm*55mm', code: 'ZY_WESTERN_MEDICINE_PACKAGE_LABEL', url: require('@/assets/img/printstyle/opd70_55.png') }
]
export const PLACE_OPTIONS = [ // 摆药单
  { id: 1, name: 'A4纸', code: 'ZY_BAI_YAO_DAN', url: require('@/assets/img/printstyle/byd.jpg') }
]
export const FHD_OPTIONS = [ // 摆药单
  { id: '1', name: 'A5纸张', code: 'ZY_BAI_YAO_DAN', url: require('@/assets/img/printstyle/fhd_a4.png') },
  { id: '2', name: 'A4纸张', code: 'ZY_BAI_YAO_DAN', url: require('@/assets/img/printstyle/fhd_a4.png') }
]
export const BATCH_STYLE_OPTIONS = [ // 出入库打印样式
  { id: 1, name: '普通样式 A5：148*210' },
  { id: 2, name: '带批次信息样式 A4：297*210' },
]
export const BATCH_FHD_PRINT_OPTIONS = [ // 发货单
  { id: 1, name: '普通样式 A5：148*210' },
  { id: 2, name: '带批次信息样式 A4：297*210' },
]
// 用于打印数据key值（打印code 分组，区分父子医嘱）
export const WEST_MEDICINE_TYPE = ['3010', '3020'] // 自定义西药父子医嘱药品类型 0非父子医嘱（3010） 1父子医嘱 (3011)
export const FATHER_MEDICINE_TYPE = ['3011', '3021'] // 西药父子医嘱类型
export const ZH_MEDICINE_TYPE = ['3030', '3040'] // 自定义中药医嘱药品类型 (中药不存在父子医嘱概念)

// 机构库房系统配置
// 发药设置总开关
export const DISPENSE_SETTING_OPTIONS = [
  { id: '1', name: '多库房统一摆药' },
  { id: '2', name: '分库房发药' },
]

// 发药设置值-适应场景
export const DISPENSE_SETTING_VALUE_OPTIONS = [
  { id: '1', name: '仅门诊' },
  { id: '2', name: '仅住院' },
  { id: '3', name: '门诊和住院' },
]
// 100005 门诊统一发药流程
export const OUTPAITENT_PROCESS_OPTIONS = [
  { id: '100005', name: '门诊统一摆药流程' },
  { id: '100007', name: '门诊自动出库流程' }
]
// 100006 住院统一发药流程
export const HOSPITAL_PROCESS_OPTIONS = [
  { id: '100006', name: '住院集中摆药流程' }
]

// while 最大次数
export const MAX_COUNT = 100

// 门诊打印默认配置参数
export const OUTPAITENT_PRINT_CONFIG = {
  focusHandle: 1,
  spanOrg: 1,
  isPrint: 1,
  listMode: 1,
  showSelf: 0,
  dispensePaste: 1,
  dispensePatient: 1,
  dispensePreparePrint: 1,
  processItemPasteObject: {
    value: '1',
    processItemPasteObject: {
      value: '1'
    }
  },
  processItemPatientObject: {
    value: '1',
    processItemPatientObject: {
      value: '1'
    }
  },
  processItemPreparePrintObject: {
    value: '1'
  }
}
// 住院打印默认配置参数
export const HOSPITAL_PRINT_CONFIG = {
  listMode: 1,
  printConfig: '',
  dispensePrepare: 0,
  itemSwitch: 1,
  dispensePaste: 1,
  processItemPasteObject: {
    value: 1,
    processItemPasteObject: {
      value: '1'
    }
  },
  processItemChinDispensePrintObject: {
    value: 1
  },
  processItemDispenseDetailObject: {
    value: 1
  },
  processItemPatientObject: {
    value: 1
  },
  processItemPreparePrintObject: {
    value: 1
  },
  focusHandle: 1,
  spanOrg: 0,
  isPrint: 1,
  showSelf: 0,
  dispensePatient: 1,
  dispensePreparePrint: 1,
  chinDispensePrint: 0,
  dispenseDetail: 0
}

export const EMPLOY_NOT = [{ code: '-1', id: '-1', name: '无给药途径' }]

export const REMOTE_METHODS_PLACEHOLDER = '请输入通用名/商品名/首字母缩写/条形码/物资编码'

export const REMOTE_METHODS_WIDTH = 'width: 350px'
// 所有业务单据类型汇总
export const BUSINESS_TYPE_COLLECT = [
  { id: '7', name: '盘盈入库单' },
  { id: '10', name: '采购入库单', examine: '100001' },
  { id: '11', name: '申领入库单', examine: '100002' },
  { id: '40', name: '申领退返入库单', examine: '100006' },
  { id: '41', name: '退库退返入库单', examine: '100007' },
  { id: '32', name: '调拨入库单', examine: '100003' },
  { id: '12', name: '退库入库单', examine: '100004' },
  { id: '33', name: '调拨退返入库单', examine: '100005' },
  { id: '3', name: '盘亏出库单' },
  { id: '22', name: '拆零出库单' },
  { id: '23', name: '拆零入库单' },
  { id: '25', name: '线下门诊发药单', inventory: true, task: true },
  { id: '28', name: '线下门诊退药单', back: true },
  { id: '24', name: '住院发药单', task: true },
  { id: '29', name: '住院退药单', back: true },
  { id: '26', name: '线上门诊发药单', inventory: true, task: true },
  { id: '36', name: '线上门诊退药单', back: true },
  { id: '18', name: '互联网商城发货单', inventory: true, task: true },
  { id: '19', name: '超市收银发货单', task: true },
  { id: '34', name: '超市收银退货单', back: true },
  { id: '15', name: '采购退货单', examine: '110001' },
  { id: '13', name: '申领出库单', examine: '110002' },
  { id: '31', name: '调拨出库单', examine: '110003' },
  { id: '14', name: '退库出库单', examine: '110004' },
  { id: '2', name: '领用出库单', examine: '110005' },
  { id: '20', name: '销毁报废单', examine: '110006' },
]

// 发货单打印CODE
// 2 批次样式 1 普通样式
export const PRINT_TEMPLATE = {
  'drug': { '2': 'BATCH_OUTPATIET_INVOICE_XY_A4', '1': 'OUTPATIET_INVOICE_XY_A5' },
  'chinese': { '2': 'BATCH_OUTPATIET_INVOICE_ZY_A4', '1': 'OUTPATIET_INVOICE_ZY_A5' }
}

// 门诊药贴打印CODE
export const PRINT_PLASTER_TYPE = {
  1: 'WH_DRUG_50_40',
  2: 'WH_DRUG_100_40',
  3: 'WH_DRUG_50_30',
  4: 'WH_DRUG_70_60' // 父子医嘱
}

// MaterialClassify 物资分类 Storage Key
export const MaterialClassify = 'MaterialClassify'

// 导出统一使用 downloadFile
export const DOWNLOAD_FILE = '/global-api/global-platform/phoneMapping/downloadFile?fileId='

// 商品流向查询入库单 type
export const INSTOCK_TYPE = ['17', '19', '21', '23', '28', '29', '32', '33', '36', '34', '40', '41', '35']

// 打印单出库 CODD
export const COOD_TYPE_OUT = {
  // 普通样式
  1: {
    '2': 'WARHOUSE_ACQUISITION_DEPOSIT', // 领用出库
    '13': 'APPLY_RELEASE', // 申领出库
    '14': 'RETURN_LEAVE_WAREHOUSE', // 退库出库
    '15': 'PURCHASE_RETURN',  // 采购退库
    '31': 'TRANSFER_OUT_WAREHOUSE', // 调拨出库
    '20': 'DESTROY_SCRAP' // 销毁报废
  },
  // 带批次样式
  2: {
    '2': 'BATCH_WARHOUSE_ACQUISITION_DEPOSIT', // 领用出库
    '13': 'BATCH_APPLY_RELEASE', // 申领出库
    '14': 'BATCH_RETURN_LEAVE_WAREHOUSE', // 退库出库
    '15': 'PURCHASE_RETURN',  // 采购退库
    '31': 'BATCH_TRANSFER_OUT_WAREHOUSE', // 调拨出库
    '20': 'BATCH_DESTROY_SCRAP' // 销毁报废
  }
}

// 打印单入库 CODD
export const COOD_TYPE_INT = {
  // 普通样式
  1: {
    '10': 'WARHOUSE_PURCHASING', // 采购入库
    '11': 'WARHOUSE_APPLY', // 申领入库
    '12': 'WARHOUSE_RETREAT_STORAGE', // 退库入库
    '32': 'WARHOUSE_ALLOCATION', // 调拨入库
    '33': 'WARHOUSE_ALLOCATION_RETREATING' // 调拨退返入库
  },
  // 带批次样式
  2: {
    '10': 'BATCH_WARHOUSE_PURCHASING', // 采购入库
    '11': 'BATCH_WARHOUSE_APPLY', // 申领入库
    '12': 'BATCH_WARHOUSE_RETREAT_STORAGE', // 退库入库
    '32': 'BATCH_WARHOUSE_ALLOCATION', // 调拨入库
    '33': 'BATCH_WARHOUSE_ALLOCATION_RETREATING' // 调拨退返入库
  }
}
