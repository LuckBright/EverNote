/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:33:45
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-11 21:28:58
 * 入库付款 和 退库收款 表单查询项 配置对象
 */

import supplierLocalApi from '@/warehouse/store/supplierlocalapi'
// 发票状态
export const INVOICE_STATUS = [
  { id: '0', name: '未上传', subName: '作废' }, // 在入库付款详情中， 状态为 0 展示作废状态
  { id: '1', name: '已上传' }
]
// 付款单状态
export const PAY_STATUS = [
  { id: '0', name: '未付款' },
  { id: '1', name: '已付款' },
  { id: '2', name: '部分付款' },
]
// 收款单状态
export const RECEIVABLE_STATUS = [
  { id: '0', name: '未收款' },
  { id: '1', name: '已收款' },
  { id: '2', name: '部分收款' },
]

const style = {
  width: '95px'
}

const SCHEMA = [
  {
    name: 'paymentNo',
    label: '付款单号',
    use: 'entry'
  },
  {
    name: 'paymentNo',
    label: '收款单号',
    use: 'back'
  },
  {
    name: 'proNo',
    label: '序号',
    style
  },
  {
    name: 'inCode',
    label: '入库单号',
  },
  {
    name: 'outCode',
    label: '退库单号',
    use: 'back'
  },
  {
    name: 'supplierId',
    label: '供应商',
    comp: 'ever-remoteMethod',
    labelWidth: '52px',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
      disabled: false,
      isSilentQuery: false
    },
  },
  {
    name: 'payStatus',
    label: '付款状态',
    comp: 'select',
    style,
    props: {
      options: PAY_STATUS
    },
    use: 'entry'
  },
  {
    name: 'payStatus',
    label: '收款状态',
    comp: 'select',
    style,
    props: {
      options: RECEIVABLE_STATUS
    },
    use: 'back'
  },
  {
    name: 'invoiceStatus', // 0 未上传 1已上传
    label: '发票状态',
    comp: 'select',
    props: {
      options: INVOICE_STATUS
    },
    style,
    use: 'entry'
  },
  {
    name: 'createDate',
    label: '创建时间',
    comp: 'everRangePicker',
    props: {
      dateType: 'datetimerange',
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    }
  },
  {
    name: 'payDate',
    label: '付款时间',
    comp: 'everRangePicker',
    props: {
      dateType: 'datetimerange',
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    },
    use: 'entry'
  },
  {
    name: 'payDate',
    label: '收款时间',
    comp: 'everRangePicker',
    props: {
      dateType: 'datetimerange',
      defaultTime: [],
      outformat: 'YYYY-MM-DD HH:mm:ss',
      autoWidth: true
    },
    use: 'back'
  },
]

export default SCHEMA
