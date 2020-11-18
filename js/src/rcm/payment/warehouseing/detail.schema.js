/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:37:03
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-10 18:20:38
 * 收付款详情页面  表单展示配置对象
 */
import {
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
import { PAY_STATUS, RECEIVABLE_STATUS } from './schema'
import Vue from 'vue'
const filters = Vue.options.filters

const Schema = [
  {
    name: 'paymentNo',
    label: '付款单号',
    comp: 'readonlyitem',
    span: 6,
    use: 'entry'
  },
  {
    name: 'paymentNo',
    label: '收款状态',
    comp: 'readonlyitem',
    span: 6,
    use: 'back'
  },
  {
    name: 'inCode',
    label: '入库单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outCode',
    label: '退库单号',
    comp: 'readonlyitem',
    span: 6,
    use: 'back'
  },
  {
    name: 'billAmount',
    label: '应付金额',
    comp: 'readonlyitem',
    span: 6,
    props: {
      filter: 'formatToFinacial'
    },
    use: 'entry'
  },
  {
    name: 'billAmount',
    label: '应收金额',
    comp: 'readonlyitem',
    span: 6,
    props: {
      filter: 'formatToFinacial'
    },
    use: 'back'
  },
  {
    name: 'paidAmount',
    label: '已付金额',
    comp: 'readonlyitem',
    span: 6,
    props: {
      filter: 'formatToFinacial'
    },
    use: 'entry'
  },
  {
    name: 'paidAmount',
    label: '已收金额',
    comp: 'readonlyitem',
    props: {
      filter: 'formatToFinacial'
    },
    span: 6,
    use: 'back'
  },
  {
    name: 'supplerName',
    label: '供应商',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'payStatus',
    label: '付款状态',
    comp: 'readonlyitem',
    span: 6,
    props: {
      formatter (value) {
        return filters.formateValueToFnt(value, { list: PAY_STATUS, defaultFnt: tableDefaultCellValue })
      },
    },
    use: 'entry'
  },
  {
    name: 'payStatus',
    label: '收款状态',
    comp: 'readonlyitem',
    props: {
      formatter: function (value) {
        return filters.formateValueToFnt(value, { list: RECEIVABLE_STATUS, defaultFnt: tableDefaultCellValue })
      }
    },
    span: 6,
    use: 'back'
  },
]

export default Schema
