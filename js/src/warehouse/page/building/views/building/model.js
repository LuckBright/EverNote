import { regs } from '@/manages/page/organization/utils/model'

export const buildingColumns = [
  {
    prop: 'buildingCode',
    label: '建筑编号',
  },
  {
    prop: 'buildingName',
    label: '建筑名称',
  },
  {
    prop: 'upperFloorNumber',
    label: '地面层数',
  },
  {
    prop: 'bottomFloorNumber',
    label: '地下层数',
  },
  {
    prop: 'usableArea',
    label: '使用面积（平方米）',
  },
  {
    prop: 'completionDate',
    label: '建成日期',
  },
  {
    prop: 'op',
    label: '操作',
    type: 'btns',
    btns: [
      'edit',
      // 'del',
    ]
  }
]
export const buildingSchema = [
  {
    name: 'buildingCode',
    label: '建筑编号',
    props: {
      disabled: false,
    },
    span: 12,
  },
  {
    name: 'buildingName',
    label: '建筑名称',
    span: 12,
  },
  {
    name: 'upperFloorNumber',
    label: '地上层数',
    span: 12,
  },
  {
    name: 'bottomFloorNumber',
    label: '地下层数',
    span: 12,
  },
  {
    name: 'usableArea',
    label: '使用面积',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'completionDateProp',
    label: '建成日期',
    comp: 'date-picker',
    props: {
      showformat: 'yyyy-MM-dd',
      placeholder: '_年_月_日',
    },
    span: 12,
  },
  {
    name: 'photo',
    label: '图片',
    comp: 'custom',
    span: 12,
  },
]
export const buildingRules = {
  buildingCode: [{required: true, message: '必填项', trigger: 'change'}],
  buildingName: [{required: true, message: '必填项', trigger: 'change'}],
  upperFloorNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
  bottomFloorNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
  usableArea: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
  // orderNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
}

