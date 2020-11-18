// 患者列表表格配置
import {
  showIcon
} from '@/warehouse/views/util/html'
import {
  PLACEHOLDER_ICON,
  tableDefaultCellValue
} from '@/warehouse/views/util/constant'
export default [
  {
    prop: 'customColumn',
    slotName: 'customColumn',
    label: '',
    width: 55,
    render (h, ctx, row, index) {
      return showIcon(h, row, PLACEHOLDER_ICON.slice(0, -2))
    }
  },
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
  },
  {
    prop: 'doctorName',
    label: '医生',
  },
]
