export const serviceSchema = [
  {
    name: 'serviceClassificationList',
    type: 'cascader',
    label: '系统分类',
    options: this.typeOptions,
    clearable: true,
    filterable: true,
    style: {width: '160px'}
  },
  {
    name: 'finType',
    type: 'systype',
    code: 'THC_RCM_FIN_TYPE',
    useValue: true,
    label: '业务分类',
    clearable: true,
    style: {width: '120px'}
  },
  {
    name: 'serviceIsValid',
    type: 'systype',
    code: 'THC_SOB_AVAILABLE_STATE',
    useValue: true,
    label: '状态',
    clearable: true,
    style: {width: '80px'}
  },
  {
    name: 'name',
    type: 'text',
    label: '项目名称',
    clearable: true,
    style: {width: '120px'}
  },
  {
    name: 'isAdvice',
    type: 'checkbox',
    label: '',
    style: {
      marginTop: '7px'
    },
    options: [
      { id: 10, name: '医嘱项' },
      { id: 11, name: '收费项' }
    ]
  },
  {
    name: 'outwardDeliveryFlag',
    type: 'checkbox_single',
    truelabel: 1,
    falselabel: '',
    optionname: '外送'
  },
]
export const serviceSetSchema = [
  {
    name: 'serviceClassificationList',
    type: 'cascader',
    label: '系统分类',
    options: this.typeOptions,
    clearable: true,
    filterable: true,
    style: {width: '160px'}
  },
  {
    name: 'serviceIsValid',
    type: 'systype',
    code: 'THC_SOB_AVAILABLE_STATE',
    useValue: true,
    label: '状态',
    clearable: true,
    style: {width: '80px'}
  },
  {
    name: 'name',
    type: 'text',
    label: '项目名称',
    clearable: true,
    style: {width: '120px'}
  },
  {
    name: 'outwardDeliveryFlag',
    type: 'checkbox_single',
    truelabel: 1,
    falselabel: '',
    optionname: '外送'
  },
]
