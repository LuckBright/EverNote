// 预约状态
export const APPOINT_STATUS = {
  '0': { color: 'cBlack', text: '待确认', cardStyle: 'blue' },
  '1': { color: 'cBlack', text: '未到诊', cardStyle: 'green' },
  '2': { color: 'cBlack', text: '已到院', cardStyle: 'deepblue' },
  '3': { color: 'cBlack', text: '已接诊', cardStyle: 'green' },
  '4': { color: 'cBlack', text: '完成诊断', cardStyle: 'green' },
  '8': { color: 'cBlack', text: '已离开', cardStyle: 'green' },
  '9': { color: 'cBlack', text: '已结诊', cardStyle: 'green' },
  '25': { color: 'cBlack', text: '已预检', cardStyle: 'deepblue' },
  '-1': { color: 'cBlack', text: '已取消', cardStyle: 'gray' },
  '-2': { color: 'cRed', text: '已迟到', cardStyle: 'orange' },
  '-3': { color: 'cRed', text: '已爽约', cardStyle: 'red' },
  '-4': { color: 'cBlack', text: '待支付', cardStyle: 'green' },
  '-5': { color: 'cBlack', text: '等待中', cardStyle: 'violet' },
  '-6': { color: 'cRed', text: '超时未支付', cardStyle: 'red' }
}
// 预约挂号页面新颜色定义
export const APPOINT_STATUS_NEW_COLOR = {
  '0': { color: 'cBlack', text: '待确认', cardStyle: 'blue' },
  '1': { color: 'cBlack', text: '未到诊', cardStyle: 'green' },
  '2': { color: 'cBlack', text: '已到院', cardStyle: 'deepblue' },
  '3': { color: 'cBlack', text: '已接诊', cardStyle: 'deepblue' },
  '9': { color: 'cBlack', text: '已结诊', cardStyle: 'deepblue' },
  '25': { color: 'cBlack', text: '已预检', cardStyle: 'deepblue' },
  '-1': { color: 'cBlack', text: '已取消', cardStyle: 'gray' },
  '-2': { color: 'cRed', text: '已迟到', cardStyle: 'orange' },
  '-3': { color: 'cRed', text: '已爽约', cardStyle: 'red' },
  '-4': { color: 'cBlack', text: '待支付', cardStyle: 'green' },
  '-5': { color: 'cBlack', text: '等待中', cardStyle: 'violet' }
}
// 预约状态
export const NUMBER_STATUS = {
  '0': { color: 'cBlack', text: '待确认', cardStyle: 'blue' },
  '1': { color: 'cBlack', text: '已挂号', cardStyle: 'green' },
  '2': { color: 'cBlack', text: '已到院', cardStyle: 'deepblue' },
  '3': { color: 'cBlack', text: '已接诊', cardStyle: 'green' },
  '4': { color: 'cBlack', text: '完成诊断', cardStyle: 'green' },
  '8': { color: 'cBlack', text: '已离开', cardStyle: 'green' },
  '9': { color: 'cBlack', text: '已结诊', cardStyle: 'green' },
  '25': { color: 'cBlack', text: '已预检', cardStyle: 'deepblue' },
  '-1': { color: 'cBlack', text: '已取消', cardStyle: 'gray' },
  '-2': { color: 'cRed', text: '已迟到', cardStyle: 'orange' },
  '-3': { color: 'cRed', text: '已爽约', cardStyle: 'red' },
  '-4': { color: 'cRed', text: '待支付', cardStyle: 'green' },
  '-5': { color: 'cBlack', text: '等待中', cardStyle: 'violet' },
  '-6': { color: 'cBlack', text: '超时未支付', cardStyle: 'red' }
}
// 预约状态
export const APPOINT_STATUS_ARRAY = [
  { id: '0', name: '待确认' },
  // { id: '1', name: '未到诊' },
  { id: '2', name: '已到院' },
  // { id: '3', name: '已接诊' },
  // { id: '4', name: '完成诊断' },
  // { id: '8', name: '已离开' },
  // { id: '9', name: '已结诊' },
  // { id: '25', name: '已预检' },
  { id: '-1', name: '已取消' },
  { id: '-2', name: '已迟到' },
  { id: '-3', name: '已爽约' },
  //{ id: '-4', name: '待支付' },
  //{ id: '-5', name: '等待中' }
]
// 挂号状态
export const NUMBER_STATUS_ARRAY = [
  { id: '0', name: '待确认' },
  { id: '1', name: '已挂号' },
  { id: '2', name: '已到院' },
  { id: '3', name: '已接诊' },
  { id: '4', name: '完成诊断' },
  { id: '8', name: '已离开' },
  { id: '9', name: '已结诊' },
  { id: '-1', name: '已取消' },
  { id: '-2', name: '已迟到' },
  { id: '-3', name: '已爽约' },
  { id: '-4', name: '待支付' },
  { id: '-5', name: '等待中' }
]

// 预约状态组合
export const APPOINT_STATUS_ARR = [
  {
    name: '已结诊',
    id: 'Finished'
  },
  {
    name: '未结诊',
    id: 'UnFinish'
  },
  {
    name: '全部',
    id: 'All'
  }
]

// 门诊医嘱状态
export const OUTPATIENT_ADVICE_STATUS = {
  // '0': { col: '#1C7BEF', txt: '待提交' },
  // '1': { col: '#1C7BEF', txt: '已提交' },
  // '2': { col: '#EE4433', txt: '已驳回' },
  // '3': { col: '#FF9C00', txt: '未发药' },
  // '4': { col: '#1C7BEF', txt: '待执行' },
  // '5': { col: '#5CBC2C', txt: '已执行' },
  // '6': { col: '#666', txt: '已停止' },
  // '7': { col: '#666', txt: '已撤回' },
  // '10': { col: '#1C7BEF', txt: '执行中' },
  // '11': { col: '#666', txt: '已作废' },
  // '12': { col: '#FF9C00', txt: '待停止' },
  // '20': { col: '#5CBC2C', txt: '已打印' },
  // '30': { col: '#5CBC2C', txt: '执行中' },    // lis 检验 已采集 状态 显示为执行中
  // '40': { col: '#5CBC2C', txt: '执行中' },    // lis 检验 已签收 状态 显示为执行中
  // '50': { col: '#1C7BEF', txt: '执行中' },    // lis 检验 检验中 状态 显示为执行中
  // '60': { col: '#5CBC2C', txt: '报告已出' },  // lis pacs 状态
  // '70': { col: '#EE4433', txt: '发药异常' },
  // '100': { col: '#1C7BEF', txt: '开立' },
  // '110': { col: '#5CBC2C', txt: '执行中' },    // pacs 检查的 登记 状态，显示为 执行中
  // '120': { col: '#1C7BEF', txt: '执行中' },    // pacs 检查的 检查完成 状态，显示为 执行中
  // '130': { col: '#1C7BEF', txt: '执行中' },    // pacs 检查的 初步报告 状态，显示为 执行中
  // '140': { col: '#5CBC2C', txt: '审核完成' },
  // '150': { col: '#5CBC2C', txt: '退药中' },
  // '160': { col: '#5CBC2C', txt: '已退药' },
  // '170': { col: '#5CBC2C', txt: '部分退药中' },
  // '180': { col: '#5CBC2C', txt: '退药驳回' },
  // '190': { col: '#5CBC2C', txt: '已发药' },
  // '200': { col: '#5CBC2C', txt: '部分已退药' },
  // '210': { col: '#5CBC2C', txt: '已取消' }
  '0': { col: '#1C7BEF', txt: '开立' },
  '1': { col: '#1C7BEF', txt: '已提交' },
  '2': { col: '#EE4433', txt: ' 处方驳回' },
  '3': { col: '#FF9C00', txt: '未出库' },
  '4': { col: '#1C7BEF', txt: '待执行' },
  '5': { col: '#5CBC2C', txt: '已完成' },
  '6': { col: '#666', txt: '已停止' },
  '7': { col: '#666', txt: '已撤回' },
  '8': { col: '#1C7BEF', txt: '有报告' },
  '9': { col: '#1C7BEF', txt: '报告未出' },
  '10': { col: '#1C7BEF', txt: '执行中' },
  '11': { col: '#666', txt: '已作废' },
  '12': { col: '#FF9C00', txt: '待停止' },
  // '20': { col: '#5CBC2C', txt: '已打印' },
  '30': { col: '#5CBC2C', txt: '执行中' },    // lis 检验 已采集 状态 显示为执行中
  '35': { col: '#5CBC2C', txt: '执行中' },    // lis 检验 已配送 状态 显示为执行中
  '40': { col: '#5CBC2C', txt: '执行中' },    // lis 检验 已打印 状态 显示为执行中
  '45': { col: '#5CBC2C', txt: '执行中' },    // lis 检验 已签收 状态 显示为执行中
  '50': { col: '#1C7BEF', txt: '执行中' },    // lis 检验 检验中（上机） 状态 显示为执行中
  '60': { col: '#5CBC2C', txt: '报告已出' },  // lis pacs 状态，发布报告
  '70': { col: '#EE4433', txt: '出库异常' },
  '100': { col: '#1C7BEF', txt: '预约' },
  '110': { col: '#5CBC2C', txt: '执行中' },    // pacs 检查的 登记 状态，显示为 执行中
  '120': { col: '#1C7BEF', txt: '执行中' },    // pacs 检查的 检查完成 状态，显示为 执行中
  '130': { col: '#1C7BEF', txt: '执行中' },    // pacs 检查的 初步报告 状态，显示为 执行中
  '140': { col: '#5CBC2C', txt: '审核报告' },
  '150': { col: '#5CBC2C', txt: '退库中' },
  '160': { col: '#5CBC2C', txt: '已退库' },
  '170': { col: '#5CBC2C', txt: '部分退库中' },
  '180': { col: '#5CBC2C', txt: '退库驳回' },
  '190': { col: '#5CBC2C', txt: '已出库' },
  '200': { col: '#5CBC2C', txt: '部分已退库' },
  '210': { col: '#5CBC2C', txt: '已取消' },
  '500': { col: '#5CBC2C', txt: '超时撤回' }
}

// 住院医嘱状态
export const ADVICE_STATUS = {
  // '0': { col: '#1C7BEF', txt: '待提交' },
  // '1': { col: '#1C7BEF', txt: '待审核' },
  // '2': { col: '#EE4433', txt: '已驳回' },
  // '3': { col: '#FF9C00', txt: '待发药' },
  // '4': { col: '#1C7BEF', txt: '待执行' },
  // '5': { col: '#5CBC2C', txt: '已执行' },
  // '6': { col: '#666', txt: '已停止' },
  // '7': { col: '#666', txt: '已撤回' },
  // '10': { col: '#1C7BEF', txt: '执行中' },
  // '11': { col: '#666', txt: '已作废' },
  // '12': { col: '#FF9C00', txt: '待停止' },
  // '20': { col: '#5CBC2C', txt: '已打印' },
  // '30': { col: '#5CBC2C', txt: '已采集' },
  // '40': { col: '#5CBC2C', txt: '已签收' },
  // '50': { col: '#1C7BEF', txt: '检验中' },
  // '60': { col: '#5CBC2C', txt: '已执行' },
  // '70': { col: '#EE4433', txt: '发药异常' },
  // '100': { col: '#1C7BEF', txt: '开立' },
  // '110': { col: '#5CBC2C', txt: '登记' },
  // '120': { col: '#1C7BEF', txt: '检查完成' },
  // '130': { col: '#1C7BEF', txt: '初步报告' },
  // '140': { col: '#5CBC2C', txt: '审核完成' },
  // '150': { col: '#5CBC2C', txt: '退药申请中' },
  // '160': { col: '#5CBC2C', txt: '已退药' },
  // '170': { col: '#5CBC2C', txt: '部分退药中' },
  // '180': { col: '#5CBC2C', txt: '退药驳回' },
  // '190': { col: '#5CBC2C', txt: '已发药' },
  // '200': { col: '#5CBC2C', txt: '部分已退药' },
  // '210': { col: '#5CBC2C', txt: '已取消' }
  '0': { col: '#1C7BEF', txt: '开立' },
  '1': { col: '#1C7BEF', txt: '待审核' },
  '2': { col: '#EE4433', txt: '驳回' },
  '3': { col: '#FF9C00', txt: '待发药' },
  '4': { col: '#1C7BEF', txt: '待执行' },
  '5': { col: '#5CBC2C', txt: '已完成' },
  '6': { col: '#666', txt: '已完成' },
  '7': { col: '#666', txt: '已撤回' },
  '8': { col: '#1C7BEF', txt: '有报告' },
  '9': { col: '#1C7BEF', txt: '报告未出' },
  '10': { col: '#1C7BEF', txt: '执行中' },
  '11': { col: '#666', txt: '已作废' },
  '12': { col: '#FF9C00', txt: '待停止' },
  '20': { col: '#5CBC2C', txt: '已打印' },
  '30': { col: '#5CBC2C', txt: '已采集' },
  '35': { col: '#5CBC2C', txt: '已配送' },
  '40': { col: '#5CBC2C', txt: '已打印' },
  '45': { col: '#5CBC2C', txt: '已签收' },
  '50': { col: '#1C7BEF', txt: '检验中' },
  '60': { col: '#5CBC2C', txt: '已完成' },   // 检查检验  报告已出，12.3，奇峰需求
  '70': { col: '#EE4433', txt: '发药异常' },
  '100': { col: '#1C7BEF', txt: '预约' },
  '110': { col: '#5CBC2C', txt: '登记' },
  '120': { col: '#1C7BEF', txt: '检查完成' },
  '130': { col: '#1C7BEF', txt: '初步报告' },
  '140': { col: '#5CBC2C', txt: '审核报告' },
  '150': { col: '#5CBC2C', txt: '退药申请中' },
  '160': { col: '#5CBC2C', txt: '已退药' },
  '170': { col: '#5CBC2C', txt: '部分退药中' },
  '180': { col: '#5CBC2C', txt: '退药驳回' },
  '190': { col: '#5CBC2C', txt: '已发药' },
  '200': { col: '#5CBC2C', txt: '部分已退药' },
  '210': { col: '#5CBC2C', txt: '已取消' }
}

// 支付状态
export const PAY_STATUS = {
  '0': '未支付',
  '1': '已支付',
  '-1': '已退费',
  '-2': '退费中',
  '-3': '部分已退费',
  '-4': '部分退费中',
  '-5': '待退费'
}

// 检验报告状态
// by lvjiangtao@everjiankang.com
export const REPORT_STATUS = [
  {id: '0', name: '待提交'},
  {id: '1', name: '待审核'},
  {id: '2', name: '已驳回'},
  {id: '3', name: '待发药'},
  {id: '4', name: '待执行'},
  {id: '5', name: '已执行'},
  {id: '6', name: '已停止'},
  {id: '7', name: '已撤回'},
  {id: '10', name: '执行中'},
  {id: '11', name: '已作废'},
  {id: '12', name: '待停止'},
  {id: '20', name: '已打印'},
  {id: '30', name: '已采集'},
  {id: '35', name: '已配送'},
  {id: '40', name: '已签收'},
  {id: '50', name: '检验中'},
  {id: '60', name: '已完成'},
  {id: '70', name: '发药异常'},
  {id: '100', name: '开立'},
  {id: '110', name: '登记'},
  {id: '120', name: '检查完成'},
  {id: '130', name: '初步报告'},
  {id: '140', name: '审核完成'},
  {id: '150', name: '退药申请中'},
  {id: '160', name: '已退药'},
  {id: '170', name: '部分退药中'},
  {id: '180', name: '退药驳回'},
  {id: '190', name: '已发药'},
  {id: '200', name: '部分已退药'},
  {id: '999', name: '已解读'}
]

// 住院患者状态 根据不同的选项，组成不同的数据结构 提交给后端
export const INPATIENT_STATUS = [
  {
    label: '在院患者',
    value: [11, 12, 13, 14]// patientStatus
  },
  {
    label: '待转科患者',
    value: 1 // hosStatusFlag
  },
  {
    label: '待转入患者',
    value: 11// hosStatusFlag
  },
  {
    label: '待转出患者',
    value: 13// hosStatusFlag
  },
  {
    label: '待出科患者',
    value: [13] // patientStatus
  }
]

export const MEDICAL_EXAMINATION = {
  1: '阴',
  2: '阳',
  3: '不详',
  4: '未查'
}

export const DIAGNOSTIC_ACCURACY = {
  1: '未做',
  2: '符合',
  3: '不符合',
  4: '不肯定'
}

export const BLOOD_TYPE = {
  1: 'A型',
  2: 'B型',
  3: 'O型',
  4: 'AB型',
  5: '其他',
  6: '未查'
}

export const STATUS_1 = {
  0: '无',
  1: '有'
}

export const OUT_HOSPITAL_METHODS = {
  1: '医嘱离院',
  2: '医嘱转院',
  3: '医嘱转社区卫生服务机构/乡镇卫生院',
  4: '非医嘱离院',
  5: '死亡',
  6: '其他'
}

export const OPERATION_SYMBOLS = [
  { id: 'less', value: '<' },
  { id: 'equal', value: '=' },
  { id: 'more', value: '>' },
  { id: 'less or equal', value: '≤' },
  { id: 'more or equal', value: '≥' },
  { id: 'not equal', value: '≠' },
  { id: 'like', value: 'like' }
]

export const SERVICE_TYPE = [
  {id: '799', name: '医事服务'},
  {id: '800', name: '检查'},
  {id: '801', name: '检验'},
  {id: '802', name: '治疗'},
  {id: '832', name: '饮食'},
  {id: '867', name: '其他'},
  {id: '2124', name: '嘱托'},
  {id: '2125', name: '手术'},
  {id: '2126', name: '护理'},
  {id: '2466', name: '床位'},
  {id: '2467', name: '会诊'},
  {id: '300', name: '医用耗材'},
  {id: '503', name: '办公设备'},
  {id: '299', name: '办公耗材'},
  {id: '504', name: '医用设备'},
  {id: '341', name: '骨科类'},
  {id: '553', name: '医疗器械'},
  {id: '301', name: '西药'},
  {id: '302', name: '中成药'},
  {id: '303', name: '中药饮片'},
  {id: '304', name: '中药颗粒'},
  {id: '10007', name: '自备药'}
]

// export const SERVICE_TYPE = {
//   '799': '医事服务',
//   '800': '检查',
//   '801': '检验',
//   '802': '治疗',
//   '832': '饮食',
//   '867': '其他',
//   '2124': '嘱托',
//   '2125': '手术',
//   '2126': '护理',
//   '2466': '床位',
//   '2467': '会诊',
//   '300': '医用耗材',
//   '503': '办公设备',
//   '299': '办公耗材',
//   '504': '医用设备',
//   '341': '骨科类',
//   '553': '医疗器械',
//   '301': '西药',
//   '302': '中成药',
//   '303': '中药饮片',
//   '304': '中药颗粒',
//   '10007': '自备药'
// }

// export const SERVICE_FR_PRINT = [
//   {
//     type: ['801'],
//     name: '检验',
//     pcode: 'thc_phr.libraryexamineapplication_20180526',
//     params: 'visit_sn'
//   },
//   {
//     type: ['800'],
//     name: '检查',
//     pcode: 'JIAN_CHA_SHEN_QING_DAN',
//     params: 'visit_sn'
//   },
//   {
//     type: ['2125'],
//     name: '手术',
//     pcode: 'SHOU_SHU_SHEN_QING_DAN',
//     params: 'visit_sn'
//   },
//   {
//     type: ['867'],
//     name: '其他',
//     pcode: 'QI_TA_FEI_YONG',
//     params: 'visit_sn'
//   },
//   {
//     type: ['10008'],
//     name: '商品',
//     pcode: 'thc_phr.processureapplication_20180524.cpt',
//     params: 'visit_sn'
//   },
//   {
//     type: ['802'],
//     name: '治疗',
//     pcode: 'thc_phr.processureapplication_20180524',
//     params: 'visit_sn'
//   },
//   {
//     type: ['301', '302'],
//     name: '西药',
//     pcode: 'thc_phr.nonMJprescription_20180830', // 非麻精类处方笺
//     params: 'visit_sn'
//   },
//   {
//     type: ['301', '302'],
//     name: '西药',
//     pcode: 'thc_phr.nonMJprescription_20180830', // 非麻精类处方笺
//     params: 'visit_sn',
//     filter: {
//       specialClassify: 1
//     }
//   },
//   {
//     type: ['301', '302'],
//     name: '西药',
//     pcode: 'thc_phr.MJprescription_20180830.cpt', // 麻精类处方笺
//     params: 'visit_sn',
//     filter: {
//       specialClassify: 2
//     }
//   },
//   {
//     type: ['300'],
//     name: '耗材',
//     pcode: 'HAO_CAI_DAN',
//     params: 'visit_sn'
//   },
//   {
//     type: ['303', '304'],
//     name: '中药',
//     pcode: 'phr_chinese_medicine_priter',
//     params: 'visit_sn'
//   },
//   {
//     type: ['303', '304'],
//     name: '中药代煎',
//     pcode: 'phr_chinese_medicine_decocting_priter',
//     params: 'visit_sn',
//     filter: {
//       specialClassify: 1,
//       relatePrintCode: 'phr_chinese_medicine_priter'   // 是否关联，几张单子一起打印
//     }
//   }
// ]

export const EXAM_RESULT = {
  '1': '阴性',
  '2': '阳性'
}

export const AUDIT_STATUS = {
  1: '待审核',
  2: '审核通过',
  3: '审核不通过'
}

export const MEDICINE_SOURCE = {
  1: '本院',
  2: '自备'
}

// 检验检查报告解读
export const REPORT_EXAMINE_STATUS = {
  '10': '待执行',
  '20': '执行中',
  '30': '已完成',
  '40': '已取消'
}

export const OTHER_ALLEREGN_ID = '9'
