/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-07 15:27:38
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-07 15:29:33
 */

//  超市收银订单 表格列配置
// import {
//   tableDefaultCellValue
// } from '@/warehouse/views/util/constant'

/**
 * include: 该字段需要的页面标识 (没有该字段代表所有页面都需要)
*/

export default [
  {
    prop: 'sourceCode',
    label: '订单编号',
    include: ['record'],
    // slotName: 'code',
    // render (h, ctx, row, index) {
    //   return h('div', [
    //     row.patientName || tableDefaultCellValue,
    //     !!row.mqMsg && h('span', {
    //       class: {
    //         red: true, f12: true, ml5: true, f_bold: true
    //       }
    //     }, 'new')
    //   ])
    // }
  },
  {
    prop: 'code',
    label: '退货单号',
    include: ['lack'],
    // slotName: 'code',
    // render (h, ctx, row, index) {
    //   return h('div', [
    //     row.patientName || tableDefaultCellValue,
    //     !!row.mqMsg && h('span', {
    //       class: {
    //         red: true, f12: true, ml5: true, f_bold: true
    //       }
    //     }, 'new')
    //   ])
    // }
  },
  {
    prop: 'patientName',
    label: '姓名',
  },
  {
    prop: 'createTime',
    include: ['record'],
    label: '下单时间',
  },
  {
    prop: 'createTime',
    include: ['lack'],
    label: '退货时间',
  },
]
