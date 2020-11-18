/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:54:58
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-12 18:18:05
 * 发票查询表单配置
 */
import supplierLocalApi from '@/warehouse/store/supplierlocalapi'

const SCHEMA = [
  {
    name: 'invoiceNo',
    label: '发票号码',
  },
  {
    name: 'inCode',
    label: '入库单号',
  },
  {
    name: 'paymentNo',
    label: '付款单号',
  },
  {
    name: 'proNo',
    style: {
      width: '95px'
    },
    label: '序号',
  },
  {
    name: 'supplierId',
    label: '供应商',
    comp: 'ever-remoteMethod',
    props: {
      api: supplierLocalApi,
      showName: 'supplierObject',
      initoptions: [],
      disabled: false,
      isSilentQuery: false
    },
  },
]

export default SCHEMA
