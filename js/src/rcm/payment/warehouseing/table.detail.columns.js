/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:32:51
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-11 15:54:13
 * 入库付款 和 退库收款 “详情页面” 表格配置项
 */
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import { INVOICE_STATUS } from './schema'
import Vue from 'vue'
const filters = Vue.options.filters

// 付款记录
export const PAYMENT_TABLE_COLUMNS = [
  {
    prop: 'flowNo',
    label: '付款流水号',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
    use: 'entry' // 用于区分是入库付款（entry）表格列还是退库收款（back）表格列
  },
  {
    prop: 'flowNo',
    label: '收款流水号',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
    use: 'back' // 用于区分是入库付款（entry）表格列还是退库收款（back）表格列
  },
  {
    prop: 'paymentAmount',
    label: '付款金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    use: 'entry'
  },
  {
    prop: 'paymentAmount',
    label: '收款金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    use: 'back'
  },
  {
    prop: 'payMethod',
    label: '支付方式',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
  },
  {
    prop: 'remarks',
    label: '备注',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
  },
  {
    prop: 'updateTime',
    label: '付款时间',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
    use: 'entry'
  },
  {
    prop: 'updateTime',
    label: '收款时间',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
    use: 'back'
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    type: 'btns',
    width: 100,
    label: '操作',
    align: 'center',
    btns: [
      {
        prop: 'toVoid',
        label: '作废',
        type: 'text'
      },
    ]
  }
]
//  发票信息
export const INVOICE_COLUMNS = [
  {
    prop: 'invoiceAmount',
    label: '发票金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'invoiceNo',
    label: '发票号码',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
  },
  {
    prop: 'invoiceStatus',
    label: '发票状态',
    customCellSpanClassFormatter ({ row }) {
      return row.invoiceStatus === 0 ? 'cRed' : ''
    },
    formatter ({ value }) {
      return filters.formateValueToFnt(value, { list: INVOICE_STATUS, defaultFnt: tableDefaultCellValue, showKey: (value === 0 || value === '0' ? 'subName' : 'name') })
    },
    align: 'center',
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    width: 300,
    slot: 'operation',
    label: '操作',
    align: 'center'
  }
]
// 物资明细
export const MATERIAL_COLUMNS = [
  {
    prop: 'materialName',
    label: '物资名称',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'spec',
    label: '规格',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
  },
  {
    prop: 'freightCode',
    label: '货位号',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
  },
  {
    prop: 'batchName',
    label: '生产批次',
    defaultCellValue: tableDefaultCellValue,
    align: 'center',
  },
  {
    prop: 'paroduceDate',
    label: '生产日期',
    defaultCellValue: tableDefaultCellValue,
    formatter: ({ value }) => {
      return filters.formatDateByExp(value, 'YYYY-MM-DD')
    },
    align: 'center',
  },
  {
    prop: 'validityDate',
    label: '有效期',
    defaultCellValue: tableDefaultCellValue,
    formatter: ({ value }) => {
      return filters.formatDateByExp(value, 'YYYY-MM-DD')
    },
    align: 'center',
  },
  {
    prop: 'num',
    label: '入库数量',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
  },
  {
    prop: 'price',
    label: '采购单价',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'totalPrice',
    label: '入库金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
]
