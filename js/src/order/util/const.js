/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-06 15:52:56
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-21 10:05:49
 */

/**
 * 业务类型 -- 订单任务数据
*/
export const TASK_TYPE = [
  { id: 5, name: '线上门诊' }, // 又名：互联网医院
  { id: 1, name: '线下门诊' },
  { id: 3, name: '住院' },
  { id: 4, name: '互联网商城' },
  { id: 9, name: '超市收银' },
]
/**
 * 表格列 => 业务类型
 */
export const TASK_TABLE_TYPE = [
  { id: 1, name: '线上门诊' }, // 又名：互联网医院
  { id: 2, name: '线下门诊' },
  { id: 3, name: '住院' },
  { id: 4, name: '互联网商城' },
  { id: 5, name: '超市收银' },
]

/**
 * 单据类型 -- 订单任务数据
*/
export const DOCUMENT_TYPE = [
  { id: '0', name: '发货单' },
  { id: '1', name: '退货单' },
]

/**
 * 对接第三方 -- 订单任务数据
*/
export const THIRD_PARTY = [
  { id: '0', name: '否' },
  { id: '1', name: '是' }
]

/**
 * 推送状态 -- 订单任务数据
*/
export const PUSH_STATUS = [
  { id: '0', name: '未推送' },
  { id: '1', name: '已推送', alias: '推送成功' },
  { id: '2', name: '推送失败', color: 'cRed' }
]

/**
 * 订单状态 -- 订单任务数据
*/
export const ORDER_STATUS = [
  { id: 1, name: '待确认' },
  { id: 12, name: '待摆药' },
  { id: 2, name: '待发药' },
  { id: 3, name: '已完成', color: 'cGreen' },
  { id: 4, name: '无法到货', color: 'cBlue' },
  { id: 5, name: '已取消', color: 'cRed' },
  { id: 7, name: '驳回入库', color: 'cRed' },
  { id: 9, name: '待退货' },
  { id: 10, name: '退货完成', color: 'cGreen' },
]

/**
 * 流程状态集合 - 操作节点
*/
export const OPERATION_NODE = [
  { id: 1, name: '任务生成', },
  { id: 2, name: '任务审核', color: 'cGreen', subName: '通过' }, // 通过
  { id: 3, name: '摆药', },
  { id: 4, name: '对接', },
  { id: 5, name: '对接(再次推送)', },
  { id: 6, name: '发货完成', },
  { id: 7, name: '任务取消', },
  { id: 8, name: '无法到货', },
  { id: 9, name: '退货完成', },
  { id: 10, name: '任务审核', color: 'cRed', subName: '驳回' }, // 驳回
  { id: 11, name: '发药机对接(首次)' }, // 失败
  { id: 12, name: '发药机对接(再次推送)' },
]

