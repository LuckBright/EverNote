// 机构物资列表展示
import * as enumConfig from '@/util/common'
export const columns = [
  {
    slot: 'materialName',
    label: '物资名称',
    minWidth: 500,
    fixed: true
  },
  {
    prop: 'jix',
    label: '剂型',
    formatter ({ value, row }) {
      return enumConfig.parserComplex({data: row.ext, propertys: enumConfig.DOSAGE}) || '-'
    },
    width: 120,
    fixed: true
  },
  {
    slot: 'spec',
    label: '规格',
    width: 120,
    fixed: true
  },
  {
    prop: 'classifyName',
    label: '物资类型',
    formatter ({ value, row }) {
      return enumConfig.parserJSON({data: row.ext, property: 'classifyObject'}) || '-'
    },
    width: 120
  },
  {
    slot: 'status',
    label: '状态',
    mate: 1,
    width: 80
  },
]
