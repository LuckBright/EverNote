/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-02-05 22:15:18
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-02-28 17:33:20
 */

// 订单列表 表格列配置

import UseSvg from '@/warehouse/views/drug/component/use.svg.vue'

/**
 * include: 该字段需要的页面标识 (没有该字段代表所有页面都需要)
 * enclude:
*/

export default [
  {
    prop: 'customColumn',
    slotName: 'customColumn',
    label: '标识',
    include: ['lack'],
    enclude: '',
    width: 45,
    render (h, ctx, row, index) {
      // stockoutFlag: 缺货标识（23 缺货）
      return h(UseSvg, {
        props: { // 缺货标记为23 并且 icon === 'shortage'
          href: row.stockoutFlag === 23 ? 'icon-que2' : ''
        }
      })
    }
  },
  {
    prop: 'productName',
    label: '商品名称',
  },
  {
    prop: 'materialName',
    label: '物资名称',
  },
  {
    prop: 'spec',
    label: '规格',
    width: 120
  },
  {
    prop: 'num',
    label: '数量',
    width: 80
  },
]
