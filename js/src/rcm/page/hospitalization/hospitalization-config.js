// 押金状态
export const depositStatus = {
  1: '未缴押金',
  2: '已缴押金',
  3: '押金警告',
  4: '押金透支'
}
// 控制押金状态的色块
export const className = {
  1: 'originBg',
  2: 'greenBg',
  3: 'originBg',
  4: 'redBg'
}
// 可以交押金的状态
export const chargeStatus = ['3', '4', '5', '6', '7', '12']
// 患者在院状态
export const hosStatus = {
  '0': '已取消',
  '1': '非正式档案',
  '2': '待入院',
  '3': '待入科',
  '4': '已入科',
  '5': '待转科',
  '6': '待出科',
  '7': '已出科',
  '8': '办理出院',
  '9': '出院已结算',
  '12': '退科',
}
// 结算状态
export const settleStatus = [
  { id: '0', name: '新建' },
  { id: '3', name: '已收款' },
  { id: '5', name: '医保出院登记' },
  { id: '6', name: '医保结算' }]

// 结算类型
export const settleType = [
  { id: '1', name: '出院结算' },
  { id: '2', name: '中途结算' }
]
