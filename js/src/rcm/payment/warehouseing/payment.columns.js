/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:34:20
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-14 10:43:40
 * 付款、收款弹框信息 -- 表格配置列
 */
import Vue from 'vue'
const filters = Vue.options.filters

const Schema = [
  {
    prop: 'proNo',
    label: '序号',
    width: '80px'
  },
  {
    prop: 'paymentNo',
    label: '付款单号',
    isEntry: true
  },
  {
    prop: 'paymentNo',
    label: '收款单号',
    isEntry: false
  },
  {
    prop: 'unpaidAmount',
    label: '未收金额',
    align: 'right',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    isEntry: false
  },
  {
    prop: 'unPaidAmount',
    label: '未付金额',
    align: 'right',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    isEntry: true
  },
  {
    prop: 'offSetAmout',
    label: '冲抵金额',
    formatter ({ value }) {
      return filters.formatToFinacial(value)
    },
    align: 'right',
    isEntry: true
  },
  {
    prop: 'payAmount',
    label: '付款金额',
    isEntry: true,
    slot: 'payAmount'

  },
  {
    prop: 'mount',
    label: '收款金额',
    isEntry: false,
    slot: 'mount'
  },
  {
    prop: 'remarks',
    label: '备注',
    slot: 'remarks'
  },
]

export default Schema
