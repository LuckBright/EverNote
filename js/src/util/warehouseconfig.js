export * from './materilconfig'
export * from '@/warehouse/util/reg'
export * from '@/warehouse/util/wh.common'

export const subType = {
  '34': 'ZYKL',
  '33': 'ZYYP',
  '31': 'XY',
  '32': 'ZCY',
  '21': 'YYHC',
  '11': 'BGHC',
  '41': 'YLSB',
  '43': 'YLQX',
  '44': 'BGYP',
  '42': 'BGSB'
}

// 发药公共头部=》库房工作台
export const PATIENT_HEAD = 'THC_PATIENT_HEAD_009'

export const DRUGTYPE = '296'

export const MATERIALTYPE = '294'

export const EQUIPMENTTYPE = '298'

export const LOOKCODE = 999

// 血液classifyId
export const BLOOD_CLASSIFYID = 'c9a969e9-1962-4bfd-a9aa-093f1c6fd362'

// 中药饮片
export const TRADITIONAL_CHINESE_MEDICINE = '303'

// 中药颗粒
export const CHINESE_PATENT_MEDICINE = '304'

// 中药类型
export const CHINESE_MEDICINE_TYPE = [TRADITIONAL_CHINESE_MEDICINE, CHINESE_PATENT_MEDICINE]
// 西药
export const WEST_MEDICINE_TYPE = ['301', '302']
// 医疗耗材
export const CONSUMABLES_MEDICAL_TYPE = '300'
// 办公耗材
export const CONSUMABLES_OFFICE_TYPE = '299'
// 耗材
export const CONSUMABLES_TYPE = [CONSUMABLES_OFFICE_TYPE, CONSUMABLES_MEDICAL_TYPE, '10008']
// 根据拼音码查询  code
export const PINYIN_CODE = 'SXX18102600001zEL/g'

export const REQUISITION_STATUS = [
  { id: 1, name: '新建' },
  { id: 2, name: '提交' },
  { id: 3, name: '审批' },
  { id: 4, name: '处理中' },
  { id: 5, name: '采购中' },
  { id: 6, name: '处理完成' },
  { id: 7, name: '通知领用' },
  { id: 8, name: '确认领用' }
]

export const ITEM_STATUS = [
  { id: 1, name: '新建' },
  { id: 2, name: '提交' },
  { id: 3, name: '审批' },
  { id: 4, name: '采购' },
  { id: 5, name: '采购中' },
  { id: 6, name: '已处理' },
  { id: 7, name: '通知领药' },
  { id: 8, name: '确认收货' }
]
export const REQUISITION_ITEM_STATUS = [
  { id: 1, name: '新建' },
  { id: 2, name: '审批中' },
  { id: 3, name: '已审批' },
  { id: 4, name: '采购处理中' },
  { id: 5, name: '调拨处理中' },
  { id: 6, name: '已完成' }
]

export const REQUISITION_ITEM_STATUSED = [
  { id: 1, name: '新建' },
  { id: 2, name: '已提交' },
  { id: 3, name: '已审批' },
  { id: 4, name: '采购中' },
  { id: 5, name: '调拨中' },
  { id: 6, name: '已完成' }
]
// 库房类型
export const STORAGE_ROOM_TYPE = [
  { id: '1001', name: '普通库房' },
  { id: '1002', name: '血库' }
]
//  物资类型
export const drugOrMaterialType = [
  { id: '296', name: '药品' },
  { id: '294', name: '耗材' },
  // { id: '298', name: '设备' }
]

export const BUYTYPE = [
  { id: 1, name: '新建' },
  { id: 2, name: '提交' },
  { id: 3, name: '采购' },
  { id: 4, name: '取消' },
  { id: 5, name: '验收' },
  { id: 6, name: '完成' }
]

export const CHECK_STATUS = [
  { id: 1, name: '新建' },
  { id: 2, name: '完成' }
]
// 部门库房信息--场景
export const SCENE = [
  { id: 1, name: '门诊' },
  { id: 2, name: '急诊' },
  { id: 3, name: '住院' }
]

export const VALIDOFTEN = [
  { value: 1, label: '1年' },
  { value: 2, label: '2年' },
  { value: 3, label: '3年' },
  { value: 4, label: '4年' },
  { value: 5, label: '5年' }
]
//   盘点单状态
export const STOCKSTATUS = [
  { id: 3, name: '盘点中' },
  { id: 4, name: '待确认' },
  { id: 5, name: '已完成' },
  { id: 6, name: '取消' }
]
//   盘点单盘点结果
export const STOCKRESULT = [
  { id: 1, name: '盘盈' },
  { id: 2, name: '盘亏' },
  { id: 3, name: '相等' }
]

export const STOCK_EQUIPMENT_STATUS = [
  { value: 0, name: '在库' },
  { value: 1, name: '发放' },
  { value: 2, name: '发放' }
]

export const STARTTIME = [
  { id: 1, name: '今天' },
  { id: 3, name: '3天内' },
  { id: 7, name: '7天内' },
  { id: -7, name: '超过7天' }
]
export const TIMEINTERVAL = [
  { id: 3, name: '3个月内过期' },
  { id: 6, name: '6个月内过期' },
  { id: 12, name: '一年内过期' }
]

/**
 * 中药类别
 */
export const HERBALTYPE = [
  { id: '1', name: '中药饮片' },
  { id: '2', name: '中药颗粒' }
]
// 物资管理 所有单据状态
export const FULL_STATE = {
  // 采购申请单状态
  procurement: {
    '812': '暂存',
    '813': '申请待确认',
    '814': '驳回',
    '815': '审核通过',
    '816': '取消',
    '821': '待审核'
  },
  summaryStatus: [
    { id: 0, name: '未汇总' },
    { id: 1, name: '汇总中' },
    { id: 2, name: '已汇总' }
  ],
  // 采购单状态
  purchase: [
    { id: 1, name: '暂存' },
    { id: 2, name: '待审核' },
    { id: 3, name: '驳回' },
    { id: 4, name: '完成' },
    { id: 5, name: '取消' },
    { id: 6, name: '待入库' },
    { id: 7, name: '入库完成' }
  ],
  // 入库单状态
  instock: [
    { id: 9, name: '暂存' },
    { id: 10, name: '待入库' },
    { id: 11, name: '入库完成' },
    { id: 12, name: '取消' },
    { id: 13, name: '驳回' },
    { id: 100, name: '待审核' }
  ],
  // 出库单状态
  outstock: [
    { id: 20, name: '待出库' },
    { id: 21, name: '出库完成' },
    { id: 22, name: '取消' },
    { id: 23, name: '缺货' },
    { id: 24, name: '驳回' },
    { id: 200, name: '待审核' }
  ],
  // 验收单状态
  acceptance: [
    { id: 31, name: '草稿' },
    { id: 32, name: '待审核' },
    { id: 33, name: '驳回' },
    { id: 34, name: '完成' },
    { id: 35, name: '取消' }
  ],
  // 申领单状态
  apply: [
    { id: 41, name: '暂存' },
    { id: 42, name: '待出库' },
    { id: 43, name: '待入库' },
    { id: 44, name: '申领完成' },
    { id: 45, name: '取消' },
    { id: 46, name: '退返待入库' },
    { id: 47, name: '取消（退返待入库）' },
    { id: 48, name: '缺货' }
  ],
  // 领用单状态
  use: [
    { id: 51, name: '暂存' },
    { id: 52, name: '待出库' },
    { id: 53, name: '缺货' },
    { id: 54, name: '领用完成' },
    { id: 55, name: '取消' }
  ],
  // 退库状态
  stockback: [
    { id: 61, name: '暂存' },
    { id: 62, name: '待出库' },
    { id: 63, name: '驳回' },
    { id: 64, name: '退库完成' },
    { id: 65, name: '取消' },
    { id: 66, name: '取消（退返待入库）' },
    { id: 67, name: '退返待入库' },
    { id: 68, name: '待入库' },
  ],
  // 退返供应商状态
  return: [
    { id: 71, name: '暂存' },
    { id: 72, name: '待出库' },
    { id: 74, name: '采购退货完成' },
    { id: 75, name: '取消' }
  ],
  // 销毁报废状态
  destroyReason: [
    { id: 101, name: '暂存' },
    { id: 102, name: '待出库' },
    { id: 103, name: '驳回' },
    { id: 104, name: '销毁报废完成' },
    { id: 105, name: '取消' },
    { id: 106, name: '待出库' },
    { id: 107, name: '完成出库' }
  ],
  // 调拨单状态
  allocation: [
    { id: 108, name: '暂存' },
    { id: 109, name: '待出库' },
    { id: 110, name: '待入库' },
    { id: 111, name: '调拨完成' },
    { id: 112, name: '取消' },
    { id: 113, name: '退返待入库' },
    { id: 114, name: '取消（退返待入库）' }
  ]
}
// 物资管理 出入库类型
export const FULL_IN_OUT_TYPE = {
  // 入库类型
  intype: [
    { id: '5', name: '验收入库' },
    { id: '6', name: '退货入库' },
    { id: '7', name: '盘盈入库' },
    { id: '8', name: '调拨入库' },
    { id: '9', name: '其他入库' },
    { id: '10', name: '采购入库' },
    { id: '11', name: '申领入库' },
    { id: '12', name: '退库入库' },
    { id: '17', name: '捐赠入库' },
    { id: '19', name: '商城入库' },
    { id: '21', name: '退药入库' },
    { id: '23', name: '拆零入库' },
    { id: '26', name: '血液入库' },
    { id: '28', name: '线下门诊退药' },
    { id: '36', name: '线上门诊退药' },
    { id: '35', name: '门诊库房退药' },
    { id: '29', name: '住院退药' },
    { id: '32', name: '调拨入库' },
    { id: '33', name: '调拨退返入库' },
    { id: '34', name: '超市收银退货' },
    { id: '40', name: '申领退返入库' },
    { id: '41', name: '退库退返入库' }
  ],
  // 出库类型
  outtype: [
    { id: '1', name: '调拨出库' },
    { id: '2', name: '领用出库' },
    { id: '3', name: '盘亏出库' },
    { id: '4', name: '其他出库' },
    { id: '13', name: '申领出库' },
    { id: '14', name: '退库出库' },
    { id: '15', name: '采购退货' },
    { id: '16', name: '处方出库' },
    { id: '18', name: '互联网商城发货' },
    { id: '19', name: '超市收银发货' },
    { id: '20', name: '销毁出库' },
    { id: '22', name: '拆零出库' },
    { id: '24', name: '住院发药' },
    { id: '25', name: '线下门诊发药' },
    { id: '26', name: '线上门诊发药' },
    { id: '27', name: '血液出库' },
    { id: '31', name: '调拨出库' }
  ]
}
// 退库  退返 销毁报废  ---- 出库类型
export const SPECIAL_STORAGE_ROOM_TYPE = ['3', '14', '15', '20']

// 物资管理 来源单据
export const FULL_ORDER_NAME = {
  // 入库类型
  intype: [
    { id: '5', name: '验收单' },
    { id: '6', name: '退货单' },
    { id: '7', name: '盘盈单' },
    { id: '9', name: '其他订单' },
    { id: '10', name: '采购单' },
    { id: '11', name: '申领单' },
    { id: '12', name: '退库单' },
    { id: '17', name: '捐赠单' },
    { id: '19', name: '商城订单' },
    { id: '21', name: '退药单' },
    { id: '23', name: '拆零单' },
    { id: '28', name: '门诊退药' },
    { id: '29', name: '住院退药' },
    { id: '32', name: '调拨单' },
    { id: '33', name: '调拨单' }
  ],
  // 出库类型
  outtype: [
    { id: '2', name: '领用单' },
    { id: '3', name: '盘亏单' },
    { id: '4', name: '其他订单' },
    { id: '13', name: '申领单' },
    { id: '14', name: '退库单' },
    { id: '15', name: '退返单' },
    { id: '16', name: '处方单' },
    { id: '18', name: '商城订单' },
    { id: '20', name: '销毁单' },
    { id: '22', name: '拆零单' },
    { id: '24', name: '住院发药' },
    { id: '25', name: '门诊发药' },
    { id: '27', name: '血液出库' },
    { id: '31', name: '调拨单' }
  ]
}

export const MATERIALTYPE_TYPE = [
  { id: 296, name: '药品' },
  { id: 294, name: '医疗耗材' },
  { id: 298, name: '设备' },
  { id: 299, name: '办公耗材' }
]

export const COMP_SETTINGS = [
  { id: 10001, name: '单行文本', comp: 'sys-text', props: { type: 'text' } },
  { id: 10002, name: '多行文本', comp: 'sys-text', props: { type: 'textarea' } },
  { id: 10003, name: '单选', comp: 'sys-select', props: { type: 'radio' } },
  { id: 10004, name: '多选', comp: 'sys-select', props: { type: 'checkbox' } },
  { id: 10005, name: '单行数字文本', comp: 'ever-price' },
  { id: 10006, name: '固定指向组件', comp: 'sys-remote-select', props: { type: 'number' } },
  { id: 10007, name: '固定组件', comp: 'sys-remote-select' },
  { id: 10008, name: '下拉选择', comp: 'sys-select' },
  { id: 10009, name: '数字(有操作按钮)', comp: 'sys-text', props: { value: 1, type: 'number', controls: true, controlsPosition: 'right' } },
  // { id: 10010, name: '数字(无操作按钮)', comp: 'el-input-number', props: {value: 0, step: 1, controls: false} },
  { id: 10010, name: '数字(无操作按钮)', comp: 'sys-text', props: { type: 'number' } },
  { id: 10011, name: '小数数字文本', comp: 'sys-number', props: { type: 'number' } },
  { id: 60001, name: '值集', comp: 'sys-type', props: { cache: true, filterable: true } },
  { id: 60002, name: '时间选择', comp: 'date-picker', props: { type: 'datetime' } },
  { id: 60003, name: '远程接口请求下拉', comp: 'sys-select' },
  { id: 60004, name: '复选框（单个）', comp: 'sys-select', props: { type: 'singleCheckbox', labelNumber: true } },
  { id: 60005, name: '值集级联', comp: 'sys-type-cascader', props: { cache: true, filterable: true, changeSelect: true } },
  { id: 60006, name: 'phr申请单', comp: 'phrform-apply' },
  { id: 0, name: '自定义', comp: 'custom' }
]

// 物资三级分类
export const CLASSIFY_CLASS = [
  { id: 1001, name: '一级分类' },
  { id: 1002, name: '二级分类' },
  { id: 1003, name: '三级分类' }
]
// 屬性項分类 (SPU、SKU)
export const PROPERTY_TYPE_FOR_TEMPLET = [
  { id: 1211, name: 'SPU' },
  { id: 1212, name: 'SKU' }
]

// 屬性項是否必要 (必要项、非必要项)
export const PROPERTY_TYPE_FOR_TEMPLET_CERTAINLY = [
  { id: 1311, name: '必要项' },
  { id: 1312, name: '非必要项' }
]
// 屬性項是否必要 (必要项、非必要项)
export const PROPERTY_TYPE_FOR_TEMPLET_STATUS = [
  { id: 1411, name: '启用' },
  { id: 1412, name: '禁用' }
]

// 属性项或者属性值删除或者新增(物资管理-查看模版更新)
export const PROPERTY_COMPARE = [
  { id: 1611, name: '新增' },
  { id: 1612, name: '删除' }
]

// 历史记录
export const MODIFY_RECORD_NODE = [
  { id: 1111, name: '新增', class: 'warning' },
  { id: 1112, name: '删除', class: 'danger' },
  { id: 1113, name: '编辑', class: 'primary' },
  { id: 1114, name: '关联模版', class: 'primary' },
  { id: 1115, name: '启用', class: 'primary' },
  { id: 1116, name: '禁用', class: 'danger' }
]

// 模版类型
export const STENCIL_TYPE = [
  { id: 101, name: '物资' },
  { id: 102, name: '部门', routePath: 'department', attributeName: 'departmentProperties', attributeValue: 'departmentPropertyValues', localProperties: 'departmentObject', relationProperties: 'localDepartmentRelations', localRelationProperties: 'localDepartmentObject' },
  { id: 103, name: '人员', routePath: 'personnel', attributeName: 'staffRecordProperties', attributeValue: 'staffRecordPropertyValues', localProperties: 'staffRecordObject', relationProperties: 'staffRecordRelations' },
  { id: 104, name: '机构', routePath: 'mechanism', attributeName: 'clinicProperties', attributeValue: 'clinicPropertyValues' },
  { id: 106, name: '科室', routePath: 'sentence', attributeName: 'sectionRecordProperties', attributeValue: 'sectionRecordPropertyValues', localProperties: 'sectionRecordObject', relationProperties: 'localSectionRelations', localRelationProperties: 'localSectionObject' },
  { id: 108, name: '建筑', routePath: 'building', attributeName: 'buildingRecordProperties', attributeValue: 'buildingRecordPropertyValues', localProperties: 'buildingRecordObject' },
  { id: 110, name: '房间', routePath: 'room', attributeName: 'roomRecordProperties', attributeValue: 'roomRecordPropertyValues', localProperties: 'roomRecordObject', relationProperties: 'roomRecordRelations' },
  { id: 113, name: '床位', routePath: 'bed', attributeName: 'hospitalBedProperties', attributeValue: 'hospitalBedPropertyValues', localProperties: 'hospitalBedObject', relationProperties: 'hospitalBedRelationList' },
  { id: 114, name: '病区', routePath: 'area', attributeName: 'spaceRecordProperties', attributeValue: 'spaceRecordPropertyValues', localProperties: 'spaceRecordObject', relationProperties: 'spaceRecordRelations' },
  { id: 115, name: '活动' },
  { id: 116, name: '病例模版' },
  { id: 117, name: '医嘱项' },
  { id: 118, name: '组套' },
  { id: 119, name: '套餐' },
  { id: 120, name: '身份卡' },
  { id: 121, name: '短信' },
  { id: 122, name: '物资价格' },
]

// 终端类型
export const TERMINAL_TYPE = [
  { id: 101, name: '自助机' },
  { id: 102, name: '大屏' }
]

// 机构类型
export const ORGANIZATION_TYPE = [
  { id: '2601da0b-2c79-4d9a-8d80-9c2790d9af75', name: '医疗机构' },
  { id: '', name: '供应商' }
]

// 床位关联关系
export const BED_CLASSIFYID = [
  { id: '76d48068-8aa8-4f2f-a750-66ffb526aaf4', type: 200, name: '房间' },
  { id: 'c6739a81-2e95-4ba2-ba9f-eeb57751ab30', type: 201, name: '病区' }
]
// 部门关联关系
export const DEPARTMENT_RELATION_TYPE = [
  { id: 520, name: '上级部门', relation: 'formDepartmentId' },
  { id: 521, name: '部门负责人', relation: 'formStaffId' }
]
// 房间关联关系
export const ROOM_RELATION_TYPE = [
  { id: 500, name: '所属建筑', relation: 'formBuildingId' },
  { id: 501, name: '科室查询', relation: 'formSentenceId' }
]
// 科室关联关系
export const SENTENCE_RELATION_TYPE = [
  { id: 510, name: '上级科室', relation: 'formSentenceId' },
  { id: 511, name: '科室负责人', relation: 'formStaffId' }
]
// 病区关联关系
export const SPACE_RELATION_TYPE = [
  { id: 300, name: '关联科室', relation: 'formSentenceId' },
  { id: 301, name: '关联房间', relation: 'formRoomId' }
]
// 人员关联关系 (排序是根据页面字段排序，不可打乱)
export const STAFF_RELATION_TYPE = [
  { id: 400, name: '所属部门', relation: 'formDepartmentId' },
  // { id: 401, name: '执业科室', relation: 'formSentenceId' },
  { id: 403, name: '所属科室', relation: 'formSentenceId' },
  { id: 402, name: '所属病区', relation: 'formSpaceId' },
  { id: 401, name: '学科科室', relation: 'formSpaceId' },
]

// 床位状态
export const BED_STATUS = [
  { id: 1, name: '有效' },
  { id: 2, name: '无效' },
  { id: 3, name: '维护中' }
]

export const SOB_SERVICE_TYPE = [
  { id: 2466, name: '床位' },
  { id: 867, name: '其他' }
]

// 发药 - 状态
export const DISPENSING_STATUS = [
  // { id: 1, name: '待确认' },
  { id: 2, name: '待打印' },
  { id: 3, name: '缺货', iconName: 'iconquehuo' },
  { id: 4, name: '待备药', iconName: 'icondaibei' },
  { id: 5, name: '待发药', iconName: 'icondaifa' },
  { id: 6, name: '发药完成', iconName: 'iconyiwan' },
  { id: 7, name: '已取消', iconName: 'iconyiqu' },
  { id: 9, name: '待退药', iconName: 'iconzhuangtai-daituiyao' },
  { id: 10, name: '退药完成', iconName: 'iconyitui' }
]

// 操作类型
export const CONTROL_TYPE = {
  '1': '创建',
  '2': '打印',
  '3': '备药完成',
  '4': '发药完成',
  '5': '取消发药',
  '6': '标记异常',
  '7': '异常取消',
  '8': '超时异常',
  '9': '失效',
  '10': '完成交接',
  '11': '发起退药',
  '12': '退药完成',
  '13': '审核通过',
  '14': '医生确认',
  '15': '补货完成',
  '16': '填写发件信息',
  '17': '编辑发件信息'
}

// 门诊发药 dataSource
// 目前id为自定义，需后台和sob取后更改
export const OUTPATIENT_DATASOUCE = [
  { id: 1, name: '院内发药' },
  { id: 2, name: '处方发药' }
]
// 发药提醒
export const DISPENSING_REMIND = [
  { id: 1, name: '无法到货' },
  { id: 2, name: '再次提醒' }
]

export const DATA_SOURCE = [
  { id: 1, name: '门诊发药' },
  { id: 2, name: '住院发药' }
]
// 医嘱类型
export const TERM_TYPE = [
  { id: '0', name: '临时医嘱' },
  { id: '1', name: '长期医嘱' }
]
// 在院状态
export const HOSPITALI_TYPE = [
  { id: 12, name: '已入科' },
  { id: 13, name: '待出科' },
  { id: 14, name: '已出院' },
  { id: 2, name: '出院结算' }
]

// 发药配置
export const DISPENSE_SETTING_ISFLAG = [
  { id: 700, name: '是否备药', type: 1 },
  { id: 701, name: '是否打印备药单', type: 1 },
  { id: 702, name: '是否打印备药单（以患者维度）', type: 1 },
  { id: 703, name: '是否打印备药单（以药品维度）', type: 1 },
  { id: 704, name: '是否打印药包标签', type: 1, nameSite: '是否自动打印' },
  { id: 705, name: '是否打印药品标签', type: 1 },
  { id: 706, name: '表单条码展示', type: 2 }
]

export const yesno = [
  { id: 1, name: '否' },
  { id: 2, name: '是' }
]
export const barcode = [
  { id: 3, name: '二维码' },
  { id: 4, name: '条形码' },
  { id: 5, name: '无' }
]

// 非warehouse业务，状态枚举 ========================

// 药品来源
export const DRUG_SOURCE = [
  { id: '1', name: '本院' },
  { id: '2', name: '自备' },
  { id: '3', name: '出院带药' }
]

// 住院状态
export const HOS_STATUS = [
  { id: 0, name: '待入院' },
  { id: 11, name: '待入科' },
  { id: 12, name: '已入院' },
  { id: 13, name: '待出院' },
  { id: 14, name: '已出院未结算' },
  { id: 2, name: '已出院已结算' }
]

// ===============================================

//   盘点范围
export const INVENTORY_RANGE = [
  { id: '1', name: '全库盘点' },
  { id: '2', name: '按物资盘点' }
]

/**
 * 查询接口校重
 * @param code          全局定义属性项code
 * @param name          全局定义属性项名称
 * @param api           需要查询接口
 * @param searchCode    需要传入字段
 * @param parameter     返回参数对应字段
 */
export const CHECK_CODE = [
  { code: 'SXX000050', name: '条码', api: '/warehouse/basesource/getSourceByMaterialBarCodeIsAlone/', searchCode: 'code', parameter: 'flag' }
  // { code: 'SXX000084', name: '手机号', api: '/warehouse/staff/checkPhoneNum/', searchCode: 'ifCheckPhone', parameter: 'ifCheckPhone' }
]
// 自定义属性全局字典
export const CUSTOM_MATERIAL_CODE_DICT = [
  { name: 'categoryMaterialDictRelations', label: '药理分类', comp: 'whCascaderMulti', span: 24 }
]
// 自定义属性本地字典
export const CUSTOM_MATERIAL_CODE = [
  { name: 'categoryMaterialRelations', label: '药理分类', comp: 'whCascaderMulti', span: 24 }
]

/**
 * 普通的字符串转化为数组对象 ---- 通过正则表达式的知识来解析字符串, 主要使用了replace和split.
 * @param stringObj        需转换数据                  required
 * @param isNum            数组内容是否转为数字
 * @return Arrary          一维数组
 */
export function string2Array (stringObj, isNum) {
  if (typeof stringObj === 'number') {
    return [stringObj]
  } else {
    if (stringObj === '[]' || !stringObj || stringObj.length === 0) return []
    if (Array.isArray(stringObj)) return stringObj
    stringObj = String(stringObj) // 如果是int型，下面replace会报错，这里强转为String
    stringObj = stringObj.replace(/([\w,]∗)/, '$1')
    // if has chinese
    if (stringObj.indexOf('[') === 0) {
      stringObj = stringObj.substring(1, stringObj.length - 1)
    }
    let arr = stringObj.split(',')
    let newArray = []
    for (let i = 0; i < arr.length; i++) {
      let arrOne = arr[i]
      newArray.push(isNum ? arrOne - 0 : arrOne)
    }
    return newArray
  }
}

export function delTips (_this, data, index, callback) {
  _this
    .$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .then(() => {
      callback &&
        callback().then(
          () => {
            _this.$message({
              type: 'success',
              message: '删除成功!'
            })
            data.splice(index, 1)
          },
          () => {
            _this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }
        )
    })
}

// 获取当前路由
export function getFirstRoutePath (routePath, num) {
  let firstRoutePath = routePath.split('/')
  return firstRoutePath[num]
}

// 日期转时间戳
export function date2Timestamp (val) {
  if (val) {
    let date = new Date(val.replace(/-/g, '/'))
    let datetime = date.getTime()
    return datetime
  }
  return ''
}

// 药理分类名称获取递归
export function pharmacologyCategoryRecursion ({ data, recursionName, pharmacologyArr, arrName }) {
  pharmacologyArr.push(data[arrName])
  if (data[recursionName]) pharmacologyCategoryRecursion({ data: data[recursionName], recursionName, pharmacologyArr, arrName })
}
// 门诊打印药贴样式 (每种药打一张)
const OPD_PRINT_STYLE_ONE = [{ id: '1', name: '样式一', spec: '50*40', url: require('@/assets/img/printstyle/opd50_40.png') }, { id: '2', name: '样式二', spec: '100*40', url: require('@/assets/img/printstyle/opd100_40.png') }, { id: '3', name: '样式三', spec: '50*30', url: require('@/assets/img/printstyle/opd50_30.png') }]
// 门诊打印药贴样式 (每盒药打一张) todo 俩一样，后期如有不一致在替换
// const OPD_PRINT_STYLE_TWO = [{ id: '1', name: '样式一', spec: '50*40', url: require('@/assets/img/printstyle/opd50_40.png') }, { id: '2', name: '样式二', spec: '100*40', url: require('@/assets/img/printstyle/opd100_40.png') }, { id: '3', name: '样式三', spec: '50*30', url: require('@/assets/img/printstyle/opd50_40.png') }]
// 门诊打印药贴 一级数据
export const PRINT_SPEC = [{ id: '1', name: '每种药打一张', children: OPD_PRINT_STYLE_ONE }, { id: '2', name: '每盒药打一张', children: OPD_PRINT_STYLE_ONE }]
// 父子医嘱打印数据
export const PRINT_OPTION = [{ id: '1', name: '所有用药打一张', children: OPD_PARENT_PRINT_STYLE }, { id: '2', name: '每次用药打一张', children: OPD_PARENT_PRINT_STYLE }]
//  门诊发药流程
export const OPD_DISPENSING_FLOW_STATUS = [
  {
    id: 1,
    name: '多人协同'
  },
  {
    id: 2,
    name: '一人操作'
  }
]
// 门诊父子医嘱打印样式
export const OPD_PARENT_PRINT_STYLE = [{ id: '1', name: '样式一', spec: '70*60', url: require('@/assets/img/printstyle/opd70_55.png') }]
// 发货单打印样式
export const FHD_PARENT_PRINT_STYLE = [{
  id: '1',
  name: '样式一',
  spec: 'A5: 148*210',
  url: require('@/assets/img/printstyle/opd70_55.png')
}, {
  id: '2',
  name: '样式二',
  spec: 'A4: 210*297',
  url: require('@/assets/img/printstyle/opd70_55.png')
}]
// 住院打印样式
export const IPD_PRINT_STYLE = [{ id: '1', name: '样式一', spec: '70*55', url: require('@/assets/img/printstyle/ipd70_55.png') }]
//  门诊发药流程
export const IPD_DISPENSING_FLOW_STATUS = [
  {
    id: 1,
    name: '多人协同'
  },
  {
    id: 2,
    name: '一人操作'
  }
]
// orderBy 查询类型，1：按创建时间；2：按名称
export const ORDER_TYPE = {
  1: 'orderByCreateTime',
  2: 'orderByName'
}
