import { regs } from '@/manages/page/organization/utils/model'

export const diagnosisAreaColumns = [
  {
    prop: 'diagnosisAreaCode',
    label: '诊区编号',
  },
  {
    prop: 'diagnosisAreaName',
    label: '诊区名称',
  },
  {
    prop: 'orderNumber',
    label: '排序号',
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
export const diagnosisAreaSchema = [
  {
    name: 'diagnosisAreaCode',
    label: '诊区编号',
    span: 12,
  },
  {
    name: 'diagnosisAreaName',
    label: '诊区名称',
    span: 12,
  },
  {
    name: 'orderNumber',
    label: '排序号',
    span: 12,
  },
  {
    name: 'tsDiagnosisAreaRoomDTOList',
    label: '关联房间',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'tsDiagnosisAreaOrgSubjectDTOList',
    label: '关联科室',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'tsDiagnosisAreaBedDTONameList',
    label: '关联床位',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'tsDiagnosisAreaSeatDTONameList',
    label: '关联座位',
    comp: 'custom',
    span: 24,
  },
]
export const diagnosisAreaRules = {
  diagnosisAreaCode: [{required: true, message: '必填项', trigger: 'change'}],
  diagnosisAreaName: [{required: true, message: '必填项', trigger: 'change'}],
  orderNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
}

