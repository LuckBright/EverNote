import axios from '@/insurance/store/api'
const url = '/rcm/common/param/'
let codes = {
  sm: [
    { id: '1', name: '挂号和收费分开结算' },
    { id: '2', name: '挂号和收费合并结算' }
  ], // 挂号单和收费单是否可以生成在一张结算单上
  cooperative: [
    { id: '1', name: '单位1' },
    { id: '2', name: '单位2' }
  ], // 合作单位
  jurisdiction: [
    { id: '1', name: '可修改' },
    { id: '2', name: '只读' }
  ], // 优惠比例
  cardpay: [
    { id: '1', name: '手工调整' },
    { id: '2', name: '系统自动计算' }
  ], // 储值卡余额使用策略
  mixpay: [
    { id: '1', name: '1.权益不参与计算' },
    { id: '2', name: '2.权益参与计算+直接使用余额' },
    { id: '3', name: '3.权益参与计算+直接回溯余额' }
  ], // 混付策略
  yn: [
    { id: '1', name: '是' },
    { id: '2', name: '否' }
  ],
  srgz: [
    { id: '0', name: '不取整' },
    { id: '1', name: '直接抹零到角' },
    // { id: '2', name: '直接进位到五角' },
    { id: '3', name: '向下精确到元' },
    { id: '4', name: '进位到角' },
    { id: '5', name: '四舍五入' },
  ], // 舍入规则
  zfms: [
    { id: '1', name: '第一种支付方法' },
    { id: '2', name: '第二种支付方法' }
  ], // 支付的模式
  hbcl: [
    { id: '1', name: '无条件-完全分开' },
    { id: '2', name: '原单参与保险或营销工具结算-完全分开' },
    { id: '3', name: '原单没有参与保险或营销工具结算-合并处理' }
  ], // 门诊正负账单合并处理策略
  sxrq: [
    { id: '1', name: '原单日期' },
    { id: '2', name: '重收单日期' }
  ], // 退费重收单生效日期
  gz: [
    { id: '1', name: '整单互斥' },
    { id: '2', name: '部分互斥' },
    { id: '3', name: '不互斥' }
  ],
  jsms: [
    { id: '1', name: '挂号和收费分开结算' },
    { id: '2', name: '挂号和收费合并结算' }
  ], // 结算模式
  mldw: [
    { id: '1', name: '角' },
    { id: '2', name: '分' }
  ], // 抹零单位
  qy: [
    { id: '1', name: '不启用' },
    { id: '2', name: '启用' }
  ],
  yx: [
    { id: '1', name: '不允许' },
    { id: '2', name: '允许' }
  ],
  fj: [
    { id: '1', name: '包含分解信息' },
    { id: '2', name: '不包含分解信息' }
  ],
  // 发票审批
  fpsp: [
    { id: '0', name: '不需要审批' },
    { id: '1', name: '需要审批' }
  ],
  // 是否选中处方
  recipe_check_type: [
    { id: '0', name: '不选中' },
    { id: '1', name: '选中可修改' },
    { id: '2', name: '选中且不可修改' }
  ],
  // 营销是否审批、是否直接支付
  ck: [
    { id: '0', name: '否' },
    { id: '1', name: '是' }
  ],
  // 是否选中处方
  bl: [
    { id: '0', name: '保留' },
    { id: '1', name: '不保留' }
  ],
  // 药品退费限制
  dlmit: [
    { id: '0', name: '已发药不能退' },
    { id: '1', name: '不限制' }
  ],
  // 非药品退费限制
  ndlmit: [
    { id: '0', name: '已执行不能退' },
    { id: '1', name: '不限制' }
  ],
  iscard: [
    { id: '0', name: '否' },
    { id: '1', name: '是' }
  ],
  refundway: [
    { id: '0', name: '原路退款' },
    { id: '1', name: '现金退款' }
  ],
  isdetail: [
    { id: '0', name: '不允许' },
    { id: '1', name: '允许' }
  ],
  mealSet: [
    { id: '1', name: '否' },
    { id: '2', name: '是' }
  ],
  couponApportion: [
    { id: '0', name: '优先扣减折扣大的' },
    { id: '1', name: '按项目金额比例分摊' }
  ],
  jt: [
    { id: '1', name: '集团' },
    { id: '2', name: '机构' }
  ],
  tcje: [
    { id: '0', name: '是' },
    { id: '1', name: '否' }
  ]
}
function search (params) {
  return axios.post(url + 'searchParam/', params).then(result => {
    return result
  })
}
function update (params) {
  return axios.post(url + 'updateParam/', params).then(result => {
    return result
  })
}
function select (params) {
  return axios.post(url + 'selectSpecialByParamId', params).then(result => {
    return result
  })
}
function updateParam (params) {
  return axios.post(url + 'updateParamSpecial', params).then(result => {
    return result
  })
}
function getlist (params) { // 获取保险列表
  return axios.post('/insurance/insuranceOrg/getList1/', params).then(result => {
    return result
  })
}
function getListByOrgId (params) { // 获取保险对应的保险产品
  return axios.post('/insurance/insurProduct/getListByOrgId', params).then(result => {
    return result
  })
}
function selectSpecialByParamId (params) { // 获取弹窗列表
  return axios.post(url + 'selectSpecialByParamId', params).then(result => {
    return result
  })
}
function updateParamSpecial (params) {
  return axios.post(url + 'updateParamSpecial', params).then(result => {
    return result
  })
}
function del (params) {
  return axios.post(url + 'deleteParamSpecial', params).then(result => {
    return result
  })
}
function getSysTypeInfoList (params) {
  return axios.post('/warehouse/sysTypeInfo/getSysTypeInfoList/', params).then(result => {
    return result.data.resultList
  })
}

function getInfoList (params) {
  return axios.post('/thc-platform-core/valueSet/getValueListBySetCode/', params).then(result => {
    return result.data.resultList
  })
}
export default {
  search,
  update,
  select,
  updateParam,
  getlist,
  getListByOrgId,
  selectSpecialByParamId,
  updateParamSpecial,
  del,
  getSysTypeInfoList,
  codes,
  getInfoList
}
