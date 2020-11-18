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
  const { createTime, operationName, createName } = row
  const { termType, implementTime, orderCode, otherCode } = row.taskObject || row
  let html = `申请时间：${filters.formatDateByExp(createTime)}<br/>申&nbsp;&nbsp;请&nbsp;&nbsp;人：${operationName || createName || ''}<br/>`
  row.scene === 3 ? html = html + `执行时间：${termType === 0 ? '立即执行' : filters.formatDateByExp(implementTime)}` : html = html + `${orderCode ? '处方单号' : '业务单号'}：${orderCode || otherCode || ''}`
  return h(RenderPopover, {
    props: {
      innerHTML: '<i class="iconfont icon-tuike cGreen"></i>',
      width: 260,
      placement: 'right',
      trigger: 'click',
      content: html
    },
  })
}
