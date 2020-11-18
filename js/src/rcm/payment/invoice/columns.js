/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:54:38
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-10 10:12:13
 * 发票表格列配置
 */
import Vue from 'vue'
const filters = Vue.options.filters
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'

const INVOICE_COLUMNS = [
  {
    prop: 'invoiceNo',
    label: '发票号码',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'invoiceAmount',
    label: '发票金额',
    defaultCellValue: tableDefaultCellValue,
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    align: 'right',
  },
  {
    prop: 'supplerName',
    label: '供应商',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'paymentNo',
    label: '付款单号',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'billAmount',
    label: '付款单金额',
    defaultCellValue: tableDefaultCellValue,
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    align: 'right',
  },
  {
    prop: 'code',
    label: '入库单号',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'proNo',
    label: '序号',
    defaultCellValue: tableDefaultCellValue,
  },
  {
    prop: 'createDate',
    label: '上传时间',
    defaultCellValue: tableDefaultCellValue
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    width: 100,
    label: '操作',
    slot: 'operation',
    // btns: [
    //   {
    //     type: 'text',
    //     prop: 'toSee',
    //     label: '查看',
    //   }
    // ]
  }
]

export default INVOICE_COLUMNS
