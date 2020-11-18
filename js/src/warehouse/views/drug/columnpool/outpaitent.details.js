/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-11 09:04:32
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-11 09:15:16
 */

import RenderPopover from '@/warehouse/views/drug/component/render.popover.vue'
import Vue from 'vue'
const filters = Vue.options.filters
/**
 * 发药展示详情内容
 * @param {Function} h Vue render
 * @param {Object} row 数据源
*/
export default function (h, row) {
  // createName 订单数据的申请人字段
  let html = ''
  const { createTime, finishTime } = row
  const { orderCode, otherCode, executeProviderName } = row
  html += `开单时间：${filters.formatDateByExp(createTime)}<br/>`
  html += `处方单号：${orderCode || '-'}<br/>`
  html += `业务单号：${otherCode || '-'}<br/>`
  html += `医&nbsp;&nbsp;嘱&nbsp;&nbsp;号：${otherCode || '-'}<br/>`
  // html += `执行单号：${adviceExecuteCode || '-'}<br/>`
  html += `执行科室：${executeProviderName || '-'}<br/>`
  if (finishTime) html += `发药时间：${filters.formatDateByExp(finishTime)}`
  return h(RenderPopover, {
    props: {
      innerHTML: '<a>查看</a>',
      width: 260,
      placement: 'right',
      trigger: 'click',
      content: html
    },
  })
}
