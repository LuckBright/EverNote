/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-10-29 11:03:31
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-11 16:37:16
 * 入库付款 和 退库收款 表格配置项
 * use: 'entry' // 用于区分是入库付款（entry）表格列还是退库收款（back）表格列
 */
import Vue from 'vue'
const filters = Vue.options.filters
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import { INVOICE_STATUS, PAY_STATUS, RECEIVABLE_STATUS } from './schema'

const PAYMENT_TABLE_COLUMN = [
  {
    prop: 'proNo',
    defaultCellValue: tableDefaultCellValue,
    width: '100px',
    label: '序号'
  },
  {
    prop: 'paymentNo',
    label: '付款单号',
    width: '200px',
    defaultCellValue: tableDefaultCellValue,
    use: 'entry' // 用于区分是入库付款（entry）表格列还是退库收款（back）表格列
  },
  {
    prop: 'paymentNo',
    label: '收款单号',
    width: '200px',
    defaultCellValue: tableDefaultCellValue,
    use: 'back'
  },
  {
    prop: 'outCode',
    label: '退库单号',
    defaultCellValue: tableDefaultCellValue,
    use: 'back'
  },
  {
    prop: 'inCode',
    label: '入库单号',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'supplerName',
    label: '供应商',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'billAmount',
    label: '付款单金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    use: 'entry',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'billAmount',
    label: '收款单金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    use: 'back',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'paidAmount',
    label: '已付金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    use: 'entry',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'paidAmount',
    label: '已收金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    use: 'back',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'unpaidAmount',
    label: '未付金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    use: 'entry',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'unpaidAmount',
    label: '未收金额',
    defaultCellValue: tableDefaultCellValue,
    align: 'right',
    use: 'back',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
  },
  {
    prop: 'payStatus',
    label: '付款状态',
    formatter ({ value }) {
      return filters.formateValueToFnt(value, { list: PAY_STATUS, defaultFnt: tableDefaultCellValue })
    },
    use: 'entry'
  },
  {
    prop: 'invoiceStatus',
    label: '发票状态',
    formatter ({ value }) {
      return filters.formateValueToFnt(value, { list: INVOICE_STATUS, defaultFnt: tableDefaultCellValue })
    },
    use: 'entry'
  },
  {
    prop: 'payStatus',
    label: '收款状态',
    formatter ({ value }) {
      return filters.formateValueToFnt(value, { list: RECEIVABLE_STATUS, defaultFnt: tableDefaultCellValue })
    },
    use: 'back'
  },
  {
    prop: 'createDate',
    width: 155,
    label: '创建时间',
    // formatter: ({ value }) => {
    //   return filters.formatDateByExp(value, 'YYYY-MM-DD')
    // },
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'payDate',
    label: '付款时间',
    width: 155,
    defaultCellValue: tableDefaultCellValue,
    // formatter: ({ value }) => {
    //   return filters.formatDateByExp(value, 'YYYY-MM-DD')
    // },
    use: 'entry'
  },
  {
    prop: 'payDate',
    label: '收款时间',
    width: 155,
    defaultCellValue: tableDefaultCellValue,
    // formatter: ({ value }) => {
    //   return filters.formatDateByExp(value, 'YYYY-MM-DD')
    // },
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
        prop: 'edit',
        label: '查看',
        type: 'text'
      },
    ]
  }
]
export default PAYMENT_TABLE_COLUMN
