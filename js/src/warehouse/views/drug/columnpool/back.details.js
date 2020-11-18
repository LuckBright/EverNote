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
 * 退药展示退药icon内容
 * @param {Function} h Vue render
 * @param {Object} row 数据源
*/
export default function (h, row) {
  // createName 订单数据的申请人字段
  let html = ''
  // 退库状态为 21 退库完成时候 取 finishTime
  const { createTime, inStockTime, executeProviderName, finishTime, status } = row
  const { termType, implementTime, orderCode, otherCode } = row.taskObject || row
  if (row.scene === 3) html += `执行科室：${executeProviderName || '-'}<br/>`
  if (row.scene === 3) html = html + `执行时间：${termType === 0 ? '立即执行' : filters.formatDateByExp(implementTime)}<br/>`
  if (row.scene === 1) {
    html = html + `处方单号：${orderCode || '-'}<br/>`
    html = html + `业务单号：${otherCode || '-'}<br/>`
    html = html + `医&nbsp;&nbsp;嘱&nbsp;&nbsp;号：${otherCode || '-'}<br/>`
  }
  html += `申请退货：${filters.formatDateByExp(createTime)}<br/>`
  html += `入库时间：${filters.formatDateByExp(status === 21 ? finishTime : inStockTime)}<br/>`
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
