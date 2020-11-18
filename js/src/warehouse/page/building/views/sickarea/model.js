export const sickAreaColumns = [
  {
    prop: 'sickAreaCode',
    label: '病区编号',
  },
  {
    prop: 'sickAreaName',
    label: '病区名称',
  },
  {
    prop: 'specialFlagName',
    label: '特殊病区',
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
      'edit', {
        prop: 'addStaff',
        label: '关联人员',
      },
      // 'del',
    ]
  }
]
export const sickAreaSchema = [
  {
    name: 'sickAreaCode',
    label: '病区编号',
    span: 12,
  },
  {
    name: 'sickAreaName',
    label: '病区名称',
    span: 12,
  },
  {
    name: 'specialFlag',
    label: '特殊病区标识',
    span: 12,
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'THC_WH_TSBQBS',
      useObject: true,
      objSimple: true,
      clearable: true,
    }
  },
  {
    name: 'orderNumber',
    label: '排序号',
    span: 12,
  },
  {
    name: 'tsSickAreaBedDTONameList',
    label: '关联床位',
    comp: 'custom',
    span: 24,
  },
  {
    name: 'tsSickAreaOrgSubjectDTOList',
    label: '关联科室',
    comp: 'custom',
    span: 24,
  },
]
export const sickAreaRules = {
  sickAreaCode: [{required: true, message: '必填项', trigger: 'change'}],
  sickAreaName: [{required: true, message: '必填项', trigger: 'change'}],
}

