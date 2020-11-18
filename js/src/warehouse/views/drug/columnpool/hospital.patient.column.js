// 患者列表表格配置
import { tableColWidth } from '@/util/table-config'
import { showIconFontHospital } from '@/warehouse/views/util/html'
import { tableDefaultCellValue, EMPLOY_NOT } from '@/warehouse/views/util/constant'
import sysValue from '@/components/sysvalue'
import Vue from 'vue'
const filters = Vue.prototype.$filters
export default [
  {
    prop: 'customColumn',
    slotName: 'customColumn',
    label: '',
    width: 85,
    notSelectCheckbox: true, // notSelectCheckbox: true 表格中点击该列时不会勾选到该行
    render (h, ctx, row, index) {
      // const { pageType, implementTime } = row
      // if (pageType === 4) {
      //   return h('div', filters.formatDateByExp(implementTime, 'YYYY-MM-DD'))
      // }
      return showIconFontHospital(h, row, ['isPrint'], true)
    }
  },
  {
    prop: 'implementTime',
    slotName: 'implementTime',
    label: '执行时间',
    notSelectCheckbox: true,
    render (h, ctx, row) {
      const { implementTime, termType } = row
      return h('div', [
        termType === 0 ? '临时医嘱' : filters.formatDateByExp(implementTime, 'YYYY-MM-DD HH:mm'),
        !!row.mqMsg && h('span', {
          class: {
            red: true, f12: true, ml5: true, f_bold: true
          }
        }, 'new')
      ])
    },
    width: 155
  },
  {
    prop: 'channel',
    label: '给药途径',
    mark: [1, 2, 3, 4, 5],
    notSelectCheckbox: true,
    slotName: 'channel',
    render (h, ctx, row, index) {
      const { employ, dropSpeed } = row
      return employ || dropSpeed ? h('div', [
        employ === '-1' && employ && h('div', EMPLOY_NOT[0].name),
        employ !== '-1' && employ && h(sysValue, {
          props: {
            addOptions: EMPLOY_NOT,
            code: employ,
            type: 'CV06.00.102'
          },
        }),
        dropSpeed && h('div', [dropSpeed && h(sysValue, { // 滴速
          props: {
            code: dropSpeed,
            type: 'THC_CPOE_DropRate'
          },
        })])
      ]) : h('span', tableDefaultCellValue)
    }
  },
  {
    prop: 'bedNum',
    notSelectCheckbox: true,
    label: '床号',
    width: tableColWidth.name3W65
  },
  {
    prop: 'patientName',
    notSelectCheckbox: true,
    label: '姓名',
    slotName: 'patientName',
    render (h, ctx, row, index) {
      return h('div', [
        row.patientName || tableDefaultCellValue
      ])
    },
    width: tableColWidth.name4W80
  },
  {
    prop: 'patientObject',
    notSelectCheckbox: true,
    label: '性别',
    formatter: ({ value }) => filters.formatSex(value && value.sex, tableDefaultCellValue),
    width: 40
  },
  {
    prop: 'patientObject',
    notSelectCheckbox: true,
    label: '年龄',
    formatter: ({ value }) => {
      return value && value.age || tableDefaultCellValue
    },
    width: 90
  },
]
