/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 21:47:32
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-16 20:52:08
 */
import Vue from 'vue'
import { tableColWidth } from '@/util/table-config'
import { TASK_TABLE_TYPE, DOCUMENT_TYPE, THIRD_PARTY, PUSH_STATUS, ORDER_STATUS } from '../../util/const'
import { AUDIT_STATUS, MAIL_FLAG, BACK_STATUS } from '@//warehouse/views/util/constant.js'

const filters = Vue.prototype.$filters
const formateValueToFnt = filters.formateValueToFnt
function showFontValue (row, showKey = 'name') {
  let { examineFlag } = row
  if (examineFlag < 2) {
    if (examineFlag === 0) {
      examineFlag = 1
    } else if (examineFlag === 1) {
      examineFlag = 0
    }
    return idToName(examineFlag, AUDIT_STATUS, showKey)
  }
  return ''
}
const TYPES = [1, 2] // 线上、线下门诊
export default [
  {
    prop: 'orderCode',
    label: '订单号',
    notSelectCheckbox: true,
    width: 180
  },
  {
    prop: 'code',
    label: '任务编号',
    type: 'eventText',
    notSelectCheckbox: true,
    event: 'handlerLookDetail',
    width: 180
  },
  {
    // 1 线上门诊 2 线下门诊 3 住院 4 互联网商场 5 超市收银
    prop: 'type',
    label: '业务类型',
    width: tableColWidth.name5W90,
    notSelectCheckbox: true,
    customCellSpanClassFormatter ({ value }) {
      return idToName(value, TASK_TABLE_TYPE, 'color')
    },
    formatter: ({ value }) => idToName(value, TASK_TABLE_TYPE)
  },
  {
    // 0 发药单据 1 退药单据
    prop: 'orderType',
    label: '单据类型',
    width: tableColWidth.name4W80,
    notSelectCheckbox: true,
    customCellSpanClassFormatter ({ value }) {
      return idToName(value, DOCUMENT_TYPE, 'color')
    },
    formatter: ({ value }) => idToName(value, DOCUMENT_TYPE)
  },
  {
    // 0 否 1 是
    prop: 'thirdParty',
    label: '对接第三方',
    width: tableColWidth.name5W90,
    notSelectCheckbox: true,
    customCellSpanClassFormatter ({ value }) {
      return idToName(value, THIRD_PARTY, 'color')
    },
    formatter: ({ value }) => idToName(value, THIRD_PARTY)
  },
  {
    prop: 'storageRoomName',
    notSelectCheckbox: true,
    label: '库房',
    width: 220
  },
  {
    prop: 'producer',
    label: '第三方供应商',
    notSelectCheckbox: true,
    width: 150
  },
  {
    prop: 'pushStatus',
    label: '推送状态',
    notSelectCheckbox: true,
    width: tableColWidth.name5W90,
    customCellSpanClassFormatter ({ value }) {
      return idToName(value, PUSH_STATUS, 'color')
    },
    formatter: ({ value }) => idToName(value, PUSH_STATUS, 'name', { defaultFnt: PUSH_STATUS[0].name })
  },
  {
    /**
     *  * 订单状态
      1; // 生成发药单状态 待确认
      12; // 带摆药状态
      2; // 待发药状状态 待发药
      3; // 发药完成状态 完成
      4; // 无法到货
      5; // 取消状态 取消
    */
    prop: 'status',
    label: '订单状态',
    width: tableColWidth.name5W90,
    notSelectCheckbox: true,
    customCellSpanClassFormatter ({ value, row }) {
      return formatValueToStatus(value, row, 'color')
    },
    formatter: ({ value, row }) => {
      return formatValueToStatus(value, row)
    }
  },
  {
    prop: 'businessTime',
    label: '业务日期',
    width: tableColWidth.dateW105,
    notSelectCheckbox: true,
    formatter: ({ value }) => filters.formatDateByExp(value, 'YYYY-MM-DD')
  },
  {}
]

/**
 * filter.js id 转换 name名称
 * formateValueToFnt
 * @param {*} id
 * @param {*} list
 * @param {*} showKey
 * @returns
 */
const idToName = function idToName (id, list, showKey, obj) {
  return formateValueToFnt(id, { list, showKey, ...obj })
}

const formatValueToStatus = function (value, row, color) {
  const { examineFlag, status, type, delivery, mailFlag, orderType } = row
  // 退药 任务（不开启审核功能 和 审核通过 examineFlag === 2）此时， 直接走退药订单状态
  // 2020-11-06（1115版本发药改版， 统一了所有发药任务字段）
  if (orderType === 1 && examineFlag === 2) {
    return idToName(status, BACK_STATUS, status === 20 ? 'subName' : color)
  }
  // 驳回入库，后端会把examineFlag重置回1，状态更新为21
  if (examineFlag === 1 && status === 21) {
    if (color) return 'cRed'
    return '拒收'
  }
  // 非审核通过，并且状态为取消，直接展示取消, 只有线上、线下门诊才有审核（todo 线上门诊有一种情况无审核） | 退药单 并且examineFlag = 1 驳回
  if (examineFlag !== undefined && examineFlag < 2 && ((status !== 5 && TYPES.includes(type)) || (orderType === 1 && examineFlag === 1))) {
    return showFontValue(row, color)
  }
  // 邮寄任务 展示邮寄状态
  if (delivery === 1 && status < 5) {
    return idToName(mailFlag, MAIL_FLAG, color)
  }
  return idToName(value, ORDER_STATUS, color)
}
