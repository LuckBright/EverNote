export const medicalType = [
  { id: '11', name: '普通门诊' }, // 对应慢病弹窗中普通疾病
  // { id: '120', name: '门诊中草药' },
  { id: '121', name: '特殊疾病' }, // 对应慢病弹窗中特殊疾病
  // { id: '122', name: '门诊特殊疾病' },
  // { id: '123', name: '门诊透析' },
  // { id: '124', name: '门诊统筹' },
  // { id: '125', name: '门诊放化疗' },
  // { id: '126', name: '门诊器官移植' },
  // { id: '127', name: '一般治疗' },
  // { id: '128', name: '120急救车上' },
  // { id: '129', name: '120急救车下' },
  // { id: '12A', name: '门诊意外伤害' },
  // { id: '181', name: '异地安置门诊' },
  // { id: '182', name: '转诊门诊门诊' },
  // { id: '21', name: '普通住院' },
  // { id: '221', name: '生育正常产' },
  // { id: '222', name: '生育会阴侧切术' },
  // { id: '223', name: '生育剖腹产' },
  // { id: '224', name: '难产' },
  // { id: '251', name: '异地安置住院' },
  // { id: '252', name: '转诊住院住院' }
]

// 预警状态
export const warningStatus = [{
  id: '0',
  name: '未审批'
}, {
  id: '1',
  name: '已审批'
}]
// 预警结算状态
export const settleStatus = [{
  id: '0',
  name: '未结算'
}, {
  id: '1',
  name: '已结算'
}]

// 预警中门诊累计消费门诊类别
export const outType = [
  { id: '0', name: '全部' },
  { id: '1', name: '普通门诊' },
  { id: '2', name: '特殊疾病' },
  { id: '3', name: '特殊治疗' },
  { id: '4', name: '门诊透析' },
  { id: '5', name: '门诊放化疗' },
  { id: '6', name: '门诊器官移植用药' },
]
