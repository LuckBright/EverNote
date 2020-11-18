/*
 * @Author: by zhangsheng@everjiankang.com.cn
 * @Date: 2020-03-05 17:11:20
 * @LastEditTime: 2020-11-07 11:32:48
 * @LastEditors: by zhangsheng@everjiankang.com.cn
 */
/*
  退药左侧列表 需要展示的字段
  28    门诊
  29    住院
*/
import { tableDefaultCellValue } from '@/warehouse/views/util/constant'
import Vue from 'vue'
const filters = Vue.prototype.$filters
export default {
  1: [
    {
      prop: 'patientName',
      label: '姓名',
      slotName: 'patientName',
      render (h, ctx, row, index) {
        return h('div', [
          row.patientName || tableDefaultCellValue,
          !!row.mqMsg && h('span', {
            class: {
              red: true, f12: true, ml5: true, f_bold: true
            }
          }, 'new')
        ])
      }
    },
    {
      prop: 'providerName',
      label: '科室',
    }, {
      prop: 'doctorName',
      label: '医生',
    },
  ],
  3: [
    {
      prop: 'patientName',
      label: '姓名',
      slotName: 'patientName',
      render (h, ctx, row, index) {
        return h('div', [
          row.patientName || tableDefaultCellValue,
          !!row.mqMsg && h('span', {
            class: {
              red: true, f12: true, ml5: true, f_bold: true
            }
          }, 'new')
        ])
      },
      width: 120
    },
    {
      prop: 'sex',
      label: '性别',
      formatter: ({ value }) => filters.formatSex(value, tableDefaultCellValue),
      width: 40
    },
    {
      prop: 'age',
      label: '年龄',
      width: 90
    },
    {
      prop: 'bedNum',
      label: '床号',
      width: 120
    },
    {
      prop: 'providerName',
      label: '科室',
    },
  ]
}
