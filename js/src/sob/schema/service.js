// import validator from '../../util/validator'
// 诊疗项目
export const HEALSCHEMA = [
  {
    name: 'serviceClassification1',
    type: 'cascader',
    label: '物资分类',
    options: []
  },
  {
    name: 'finType',
    type: 'systype',
    code: 'THC_RCM_FIN_TYPE',
    useValue: true,
    label: '业务分类'
  },
  {
    name: 'name',
    type: 'text',
    label: '医嘱项目名称',
    min: 1,
    max: 40
  },
  {
    name: 'displayName',
    type: 'text',
    label: '显示名称',
    min: 1,
    max: 40
  },
  {
    name: 'pinyinCode',
    type: 'text',
    label: '检索码',
    min: 1,
    max: 40
  },
  {
    name: 'enName',
    type: 'text',
    label: '英文名称',
    min: 1,
    max: 40
  },
  {
    name: 'byname',
    type: 'text',
    label: '通用名',
    min: 1,
    max: 40
  },
  {
    name: 'bynamePinyinCode',
    type: 'text',
    label: '通用名拼音码',
    min: 1,
    max: 40
  },
  {
    name: 'code',
    type: 'text',
    label: '医嘱项目编号',
    max: 40
  },
  {
    name: 'unit',
    type: 'select',
    label: '销售单位',
    options: []
  },
  {
    name: 'isValid',
    type: 'systype',
    code: 'THC_SOB_AVAILABLE_STATE',
    useValue: true,
    label: '状态'
  },
  {
    name: 'isAdvice',
    type: 'checkbox',
    label: '医嘱项',
    options: [
      {id: 1}
    ]
  },
  {
    name: 'description',
    label: '备注',
    span: 24,
    type: 'textarea',
    max: 400
  }
]
// 药品项目
export const DRUGSCHEMA = [
  {
    name: 'name',
    type: 'text',
    label: '医嘱项目名称',
    min: 1,
    max: 40
  },
  {
    name: 'enName',
    type: 'text',
    label: '英文名称',
    min: 1,
    max: 40
  },
  {
    name: 'displayName',
    type: 'text',
    label: '显示名称',
    min: 1,
    max: 40
  },
  {
    name: 'code',
    type: 'text',
    label: '医嘱项目编号',
    max: 40
  },
  {
    name: 'localMaterialId',
    type: 'number',
    label: '本地ID',
    disabled: true
  },
  {
    name: 'pinyinCode',
    type: 'text',
    label: '拼音码',
    min: 1,
    max: 40
  },
  {
    name: 'serviceClassification1',
    type: 'cascader',
    label: '医嘱类型',
    options: [],
    disabled: true
  },
  {
    name: 'serviceType',
    type: 'systype',
    code: 'THC_SOB_SERVICE_TYPE',
    useValue: true,
    label: '医嘱项目类型'
  },
  {
    name: 'finType',
    type: 'systype',
    code: 'THC_RCM_FIN_TYPE',
    useValue: true,
    label: '业务分类'
  },
  {
    name: 'unit',
    type: 'select',
    label: '单位',
    options: []
  },
  {
    name: 'price',
    type: 'number',
    append: '元',
    label: '价格',
    min: 1,
    max: 11
  },
  {
    name: 'isValid',
    type: 'systype',
    code: 'THC_SOB_AVAILABLE_STATE',
    useValue: true,
    label: '状态'
  },
  {
    name: 'description',
    label: '备注',
    span: 24,
    type: 'textarea'
  }
]

export const DRUGSCHEMAREMOTE = [
  {
    name: 'name',
    type: 'systype',
    code: 'THC_WH_OBJECT_TYPE',
    placeholder: '请输入需要查询的药品名称或者编码',
    span: 24,
    label: '导入药品'
  }
]

export const MATERIALSCHEMAREMOTE = [
  {
    name: 'name',
    type: 'systype',
    code: 'THC_WH_OBJECT_TYPE',
    placeholder: '请输入需要查询的耗材名称或者编码',
    span: 24,
    label: '导入耗材'
  }
]

// RULES
export const RULES = {
  name: [
    { required: true, message: '必填项', trigger: 'change,blur' },
    { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
  ],
  unit: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  serviceType: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  displayName: [
    { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请填写价格', trigger: 'blur', type: 'number' },
    { message: '长度在 1 到 11 个字符', trigger: 'blur', type: 'number' }
  ],
  finType: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  serviceClassification1: [
    { required: true, message: '必填项', trigger: 'change', type: 'array' }
  ]
}
