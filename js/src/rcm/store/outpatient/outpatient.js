/*
 * @Author: renpengfei
 * @Date: 2018-08-13 18:51:18
 * @Last Modified by: renpengfei
 * @Last Modified time: 2020-09-19 15:56:41
 */
import fetch from '../api'
import { diction } from '@/store/common'
const url = diction.api
const outpatientUrl = '/rcm/ar/accountbill/'
const paramUrl = '/rcm/common/param/'
const settlementUrl = '/rcm/ar/settlement/'
const refundUrl = '/rcm/ar/refund/'
const benfitUrl = '/rcm/cashier/benefit/'
const discountUrl = '/rcm/cashier/discountStaff/'
const cashierUrl = '/rcm/cashier/'
const discountremarkUrl = '/rcm/discountRemarks/'
const sobUrl = '/sob/service/'
// 大客户报销方案
const reimburseProgramme = '/rcm/er/reimburseProgramme/'
export const getstatus = (activestatus) => {
  const actions = new Map([
    [0, ['开立']
    ],
    [1, ['已提交']
    ], // 其他地方叫待审核，门诊叫已提交
    [2, ['驳回']
    ],
    [3, ['未发药']
    ], // 其他地方叫待发药，门诊叫未发药
    [4, ['待执行']
    ],
    [5, ['已执行']
    ],
    [6, ['停止']
    ],
    [7, ['撤回']
    ],
    [8, ['有报告']
    ],
    [9, ['报告未出']
    ],
    [10, ['执行中']
    ],
    [11, ['已作废']
    ],
    [12, ['预停状态']
    ],
    [20, ['已打印']
    ],
    [30, ['已采集']
    ],
    [40, ['已签收']
    ],
    [50, ['检验中']
    ],
    [60, ['已完成']
    ],
    [70, ['发药异常']
    ],
    [100, ['预约']
    ],
    [110, ['登记']
    ],
    [120, ['检查完成']
    ],
    [130, ['初步报告']
    ],
    [140, ['审核报告']
    ],
    [150, ['退药申请中']
    ],
    [160, ['已退药']
    ],
    [170, ['部分退药中']
    ],
    [180, ['退药驳回']
    ],
    [190, ['已发药']
    ],
    [200, ['部分退药']
    ],
    [210, ['已取消']
    ],
    ['default', ['无']
    ]
  ])
  let action = (actions.get(activestatus) && actions.get(activestatus)[0]) || actions.get('default')[0]
  return action
}

export const getPatients = (data) => {
  return fetch({
    url: url + outpatientUrl + 'getPatients',
    method: 'post',
    data: data
  })
}
// 获取
export const getPatientList = (data) => {
  return fetch({
    url: url + outpatientUrl + 'getListByPatient',
    method: 'post',
    data: data,
    isfilter: true
  })
}
// 生成结算单
export const settleCreate = (data) => {
  return fetch({
    url: url + settlementUrl + 'settleCreate',
    method: 'post',
    data: data
  })
}
// 上一步
export const previousSettle = (data) => {
  return fetch({
    url: url + settlementUrl + 'previousSettle',
    method: 'post',
    data: data
  })
}
// 查询当前退款单状态
export const getRefundStatus = (data) => {
  return fetch({
    url: url + settlementUrl + 'getRefundStatus',
    method: 'post',
    data: data
  })
}
// 商业保险信息
export const getInsuranceByPatient = (data) => {
  return fetch({
    url: url + outpatientUrl + 'getInsuranceByPatient',
    method: 'post',
    data: data,
    isfilter: true
  })
}
// 商保取价
export const getPrice = (data) => {
  return fetch({
    url: url + '/pricemanage/pricing/query/sale',
    method: 'post',
    data: data
  })
}
// 结算成功掉
export const settle = (data) => {
  return fetch({
    url: url + settlementUrl + 'settle',
    method: 'post',
    data: data
  })
}
// 结算成功掉
export const getPrint = (data) => {
  return fetch({
    url: url + settlementUrl + 'getPrint',
    method: 'post',
    data: data
  })
}
// 结算删除
export const cancelReceivables = (data) => {
  return fetch({
    url: url + settlementUrl + 'cancelReceivables',
    method: 'post',
    data: data
  })
}
// 结算删除
export const getSettlementsByVisitNumber = (data) => {
  return fetch({
    url: url + settlementUrl + 'getSettlementsByVisitNumber',
    method: 'post',
    data: data
  })
}
// 试算上一步
export const cancelPersonalSettle = (data) => {
  return fetch({
    url: url + settlementUrl + 'cancelPersonalSettle',
    method: 'post',
    data: data
  })
}
// 下一步改状态
export const createReceivables = (data) => {
  return fetch({
    url: url + settlementUrl + 'createReceivables',
    method: 'post',
    data: data
  })
}
// 下一步改状态
export const refundSettle = (data) => {
  return fetch({
    url: url + refundUrl + 'refundSettle',
    method: 'post',
    data: data
  })
}
// 提交审批
export const updateSepcialRefundFlag = (data) => {
  return fetch({
    url: url + settlementUrl + 'updateSepcialRefundFlag',
    method: 'post',
    data: data
  })
}
// 开始审批
export const startProcess = (data) => {
  return fetch({
    url: url + refundUrl + 'startProcess',
    method: 'post',
    data: data
  })
}
// 开始审批
export const getReceiptFlows = (data) => {
  return fetch({
    url: url + refundUrl + 'getReceiptFlows',
    method: 'post',
    data: data
  })
}
// 开始审批
export const postGetPrint = (data) => {
  return fetch({
    url: url + settlementUrl + 'postGetPrint',
    method: 'post',
    data: data
  })
}
// 开始审批
export const confirmRefund = (data) => {
  return fetch({
    url: url + refundUrl + 'confirmRefundNew',
    method: 'post',
    data: data
  })
}
// 医保
export const getMedDetails = (data) => {
  return fetch({
    url: url + settlementUrl + 'getMedDetails',
    method: 'post',
    data: data
  })
}
// 医保创建退费
export const createMedicalRefund = (data) => {
  return fetch({
    url: url + refundUrl + 'createMedicalRefund',
    method: 'post',
    data: data
  })
}
// 医保创建退费
export const getMedicalRefund = (data) => {
  return fetch({
    url: url + refundUrl + 'getMedicalRefund',
    method: 'post',
    data: data
  })
}
// 旧的最优优惠组合
export const getBestBenfit = (data) => {
  return fetch({
    url: url + benfitUrl + 'getBestBenfit',
    method: 'post',
    data: data
  })
}
// 新的最优优惠组合20190613
export const getBestBenefit = (data) => {
  return fetch({
    url: url + benfitUrl + 'recommandBenefit',
    method: 'post',
    data: data
  })
}
// 计算优惠金额
export const computeBenefit = (data) => {
  return fetch({
    url: url + benfitUrl + 'computeBenefit',
    method: 'post',
    data: data,
    isfilter: true
  })
}
// 一站式退费
export const oneStopRefundReg = (data) => {
  return fetch({
    url: url + refundUrl + 'oneStopRefundReg',
    method: 'post',
    data: data
  })
}
// 退费金额计算
export const getRefundFee = (data) => {
  return fetch({
    url: url + refundUrl + 'getRefundFee',
    method: 'post',
    data: data,
    isfilter: true
  })
}
// 打折人员列表
export const byClinicId = (data) => {
  return fetch({
    url: url + discountUrl + 'getByClinicId',
    method: 'post',
    data: data
  })
}
// 查询打折备注
export const findByDiscountStaff = (data) => {
  return fetch({
    url: url + discountremarkUrl + 'findByDiscountStaff',
    method: 'post',
    data: data
  })
}
// 一站式退费（支持部分退）
export const refundDetail = (data) => {
  return fetch({
    url: url + refundUrl + 'refund',
    method: 'post',
    data: data
  })
}
// 项目退费中的挂号退费，要直接支付的
export const registerItemRefund = (data) => {
  return fetch({
    url: url + refundUrl + 'refundRegister',
    method: 'post',
    data: data
  })
}

// 纠纷退费
export const disputeRefund = (data) => {
  return fetch({
    url: 'disputeRefund/create',
    method: 'post',
    data: data
  })
}

// 待退费页签里的原路退费
export function billrefundOrigin (data) {
  return fetch({
    url: `${url}${refundUrl}getBySettlementId`,
    method: 'post',
    data: data
  })
}
// 一站式退费（删除未支付得单子）
export const phyDelete = (data) => {
  return fetch({
    // url: url + settlementUrl + 'phyDelete',
    url: url + refundUrl + 'deleteRefund', // 更换接口
    method: 'post',
    data: data
  })
}
// 根据收费项目id获取收费项目信息
export const getServiceInfo = (data) => {
  return fetch({
    url: url + sobUrl + 'getServiceInfo', // 更换接口
    method: 'post',
    data: data
  })
}
// 创建追加一个账单
export const createAppend = (data) => {
  return fetch({
    url: url + outpatientUrl + 'createAppend', // 更换接口
    method: 'post',
    data: data
  })
}
// 查询可用套餐
export const getUsableMealItemBill = (data) => {
  return fetch({
    url: url + outpatientUrl + 'getUsableMealItemBill', // 更换接口
    method: 'post',
    data: data
  })
}
// 获取所有人列表
export const getStaffList = (data) => {
  return fetch({
    url: url + '/warehouse/staff/getStaffList/',
    method: 'post',
    data: data
  })
}
// 账单状态
export const getPendingChargesAndRefundsByVisitNumber = (data) => {
  return fetch({
    url: url + outpatientUrl + 'getPendingChargesAndRefundsByVisitNumber',
    method: 'post',
    data: data
  })
}
// 删除无处方账单
export const deleteByAccountBillId = (data) => {
  return fetch({
    url: url + outpatientUrl + 'deleteByAccountBillId',
    method: 'post',
    data: data
  })
}
// 按照patientId和所在科室查询出该患者符合条件的所有身份卡，储值卡，优惠卡，活动信息
export const getAllMarketInfoByPatientIdAndDpt = (params) => {
  return fetch({
    url: url + '/market/doctor/market/getAllMarketByPatientIdAndDpt',
    method: 'get',
    params: params
  })
}
// 大客户获取报销方案
export const getProgrammesByPatient = (data) => {
  return fetch({
    url: url + reimburseProgramme + 'getProgrammesByPatient',
    method: 'post',
    data: data,
    isfilter: true
  })
}
// 按金额退费
export const salaryRefund = (data) => {
  return fetch({
    url: url + outpatientUrl + 'createNoOrderSettle',
    method: 'post',
    data: data
  })
}
// 批量获取结算单详情
export const getSettlementsDetails = (data) => {
  return fetch({
    url: url + settlementUrl + 'getSettlementsAndDetailsByVisitNumber',
    method: 'post',
    data: data
  })
}
// 获取退费授权码
export function getRefundAuthorize (code) {
  return fetch({
    url: url + '/rcm/common/param/getValueByCode',
    method: 'post',
    data: { code: code }
  })
}
export const getTodoList = (data) => {
  return fetch({
    url: `${url}${cashierUrl}insuranceOverview/getTodoList`,
    method: 'post',
    data: data
  })
}
export const getPatientInfo = (data) => {
  return fetch({
    url: `${url}${cashierUrl}insuranceOverview/getPatientInfo`,
    method: 'post',
    data: data
  })
}

// 获取pos机退款明细
export function posPreRefund (data) {
  return fetch({
    url: '/rcm/pos/preRefund',
    method: 'post',
    data: data
  })
}
export const getParamsMap = (data) => {
  return fetch({
    url: `${url}${paramUrl}getParamsMap`,
    method: 'post',
    data: data
  })
}

// pos机退款明细是今天的订单
export function posPayRollback (data) {
  return fetch({
    url: 'http://127.0.0.1:2345/serial/payRollback',
    method: 'post',
    data: data
  })
}
export const getPatientIdentity = (data) => {
  return fetch({
    url: `${url}${outpatientUrl}getPatientIdentity`,
    method: 'post',
    data: data
  })
}

// pos机退款明细不是今天的订单
export function posRefund (data) {
  return fetch({
    url: 'http://127.0.0.1:2345/serial/refund',
    method: 'post',
    data: data
  })
}

// 轮询查看pos退款结果接口
export function posGetResult (data) {
  return fetch({
    url: 'http://127.0.0.1:2345/serial/getResult',
    method: 'post',
    data: data
  })
}

// 将pos退款结果告知rcm
export function posPostRefund (data) {
  return fetch({
    url: '/rcm/pos/postRefund',
    method: 'post',
    data: data
  })
}
// 根据结算单id查询医保费用结算详情
export function getMedicalResultBySettlementId (data) {
  return fetch({
    url: '/ar/settlement/getMedicalResultBySettlementId',
    method: 'post',
    data: data
  })
}
// 根据就诊号visitNumber获取医保机构ID
export function getInsuranceIdByVisitNumber (data) {
  return fetch({
    url: 'medical/getInsuranceOrgId',
    method: 'post',
    data: data
  })
}
// 山东乐陵医保用来修改个人账户支付金额的
export function updatePersonAccount (data) {
  return fetch({
    url: 'medical/updatePersonAccount',
    method: 'post',
    data: data
  })
}
export const supermarketRefund = (data) => {
  return fetch({
    url: `${url}/rcm/shop/confirm/refund`,
    method: 'post',
    data: data
  })
}
