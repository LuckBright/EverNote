/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 20:56:48
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-20 17:54:56
 */

// 订单列表 表格列配置
// import {
//   tableDefaultCellValue
// } from '@/warehouse/views/util/constant'

/**
 * include: 该字段需要的页面标识 (没有该字段代表所有页面都需要)
*/

export default [
  {
    prop: 'orderCode',
    label: '订单编号',
    notSelectCheckbox: true,
  },
  {
    prop: 'name',
    label: '姓名',
    notSelectCheckbox: true,
  },
  // {
  //   prop: 'status',
  //   label: '状态',
  //   include: ['record'],
  //   notSelectCheckbox: true,
  // },
  {
    prop: 'orderTime',
    include: ['task', 'lack'],
    label: '下单时间',
    notSelectCheckbox: true,
  },
  {
    prop: 'sendTime',
    include: ['record'],
    label: '发货时间',
    notSelectCheckbox: true,
  },
]
