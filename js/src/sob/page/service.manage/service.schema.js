// import validator from '../../util/validator'
// 诊疗项目
/**
 * 医嘱项新建编辑字段顺序
 * 系统分类/业务分类/项目名称/英文名称/医嘱项、收费项、外送/项目价格
 * 检索码/原系统编码/项目编码/门诊发票分类/国家编码/病案首页分类/住院发票分类
 * 状态/病案首页分类（中医）/备注
 */
export const HEALSCHEMA = [
  {
    name: 'serviceClassification1',
    type: 'cascader',
    label: '系统分类',
    options: []
  },
  {
    name: 'finType',
    type: 'systype',
    code: 'THC_RCM_FIN_TYPE',
    useValue: true,
    clearable: true,
    label: '业务分类'
  },
  {
    name: 'name',
    type: 'text',
    label: '项目名称',
    clearable: true,
    min: 1,
    max: 40
  },
  {
    name: 'enName',
    type: 'text',
    label: '英文名称',
    min: 1,
    max: 80
  },
  {
    name: 'isAdvices',
    type: 'checkbox',
    label: '',
    options: [
      { id: 0, name: '医嘱项' },
      { id: 1, name: '收费项' },
      { id: 2, name: '外送' }
    ]
  },
  {
    name: 'price',
    useValue: true,
    clearable: true,
    append: '元',
    label: '项目价格',
    // type: 'number'
  },
  {
    name: 'unit',
    type: 'systype',
    label: '销售单位',
    code: 'THC_WH_DOSE_UNIT',
    clearable: true,
    useValue: true
  },
  {
    name: 'code',
    type: 'text',
    label: '项目编码',
    clearable: true,
    max: 40
  },
  {
    name: 'refCode',
    type: 'text',
    label: '原系统编码',
    clearable: true,
    min: 1,
    max: 40
  },
  {
    name: 'nationTypeCode',
    type: 'custom',
    label: '国家编码',
    clearable: true,
    span: 12
  },
  {
    name: 'clinicReceiptType',
    type: 'systype',
    label: '门诊发票分类',
    code: 'THC_CPOE_OutpatientReceipt',
    clearable: true,
    disabled: true,
    span: 12
  },
  {
    name: 'hospitalizedReceiptType',
    type: 'systype',
    label: '住院发票分类',
    code: 'THC_CPOE_InpatientReceipt',
    clearable: true,
    disabled: true,
    span: 12
  },
  {
    name: 'medicalRecordClassify',
    type: 'custom',
    label: '病案首页分类',
    clearable: true,
    span: 12
  },
  {
    name: 'medicalRecordClassifyZy',
    type: 'custom',
    label: '病案首页分类(中医)',
    clearable: true,
    span: 12
  },
  // {
  //   name: 'medicalRecordClassifyZy',
  //   type: 'custom',
  //   label: '病案首页分类(中医)',
  //   clearable: true,
  //   span: 12
  // },
  {
    name: 'pinyinCode',
    type: 'text',
    label: '检索码',
    clearable: true,
    min: 1,
    max: 40
  },
  {
    name: 'isValid',
    type: 'systype',
    code: 'THC_SOB_AVAILABLE_STATE',
    useValue: true,
    label: '启用/停用'
  },
  {
    name: 'description',
    label: '备注',
    span: 24,
    type: 'textarea',
    max: 400
  }
  // {
  //   name: 'unit',
  //   type: 'systype',
  //   label: '销售单位',
  //   code: 'THC_WH_DOSE_UNIT',
  //   clearable: true,
  //   useValue: true
  // },
  // {
  //   name: 'relateOrgList1',
  //   type: 'custom',
  //   label: '关联机构',
  //   span: 12
  // },
  // {
  //   name: 'isAdvices',
  //   type: 'checkbox',
  //   label: '',
  //   options: [
  //     { id: 0, name: '医嘱项' },
  //     { id: 1, name: '收费项' },
  //     { id: 2, name: '外送' }
  //   ]
  // },
  // {
  //   name: 'clinicReceiptType',
  //   type: 'systype',
  //   label: '门诊发票分类',
  //   code: 'THC_CPOE_OutpatientReceipt',
  //   clearable: true,
  //   disabled: true,
  //   span: 12
  // },
  // {
  //   name: 'hospitalizedReceiptType',
  //   type: 'systype',
  //   label: '住院发票分类',
  //   code: 'THC_CPOE_InpatientReceipt',
  //   clearable: true,
  //   disabled: true,
  //   span: 12
  // },
  // {
  //   name: 'clinicAdjustAccountProvider',
  //   type: 'select',
  //   label: '门诊核算科室',
  //   options: [],
  //   span: 12
  // },
  // {
  //   name: 'hospitalizedAdjustAccountProvider',
  //   type: 'select',
  //   label: '住院核算科室',
  //   options: [],
  //   span: 12
  // },
  // {
  //   name: 'medicalRecordClassify',
  //   type: 'custom',
  //   label: '病案首页分类',
  //   clearable: true,
  //   span: 12
  // },
  // {
  //   name: 'medicalRecordClassifyZy',
  //   type: 'custom',
  //   label: '病案首页分类(中医)',
  //   clearable: true,
  //   span: 12
  // },
  // {
  //   name: 'isValid',
  //   type: 'systype',
  //   code: 'THC_SOB_AVAILABLE_STATE',
  //   useValue: true,
  //   label: '启用/停用'
  // },
  // {
  //   name: 'description',
  //   label: '备注',
  //   span: 24,
  //   type: 'textarea',
  //   max: 400
  // }
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
export function getRule () {
  return {
    name: [
      { required: true, message: '必填项', trigger: 'change,blur' },
      { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
    ],
    // pinyinCode: [
    //   { required: true, message: '必填项', trigger: 'change' }
    // ],
    unit: [
      { required: true, message: '必填项', trigger: 'blur' }
    ],
    code: [
      { required: true, message: '必填项', trigger: 'change' }
    ],
    serviceType: [
      { required: true, message: '必填项', trigger: 'change' }
    ],
    displayName: [
      { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
    ],
    price: [
      { required: true, message: '请填写价格', trigger: 'blur', type: 'number' },
      { message: '长度在 1 到 11 个字符', trigger: 'blur', type: 'number' },
      { pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/, message: '请输入整数或小数点后不超过两位的小数' }
    ],
    finType: [
      { required: true, message: '必填项', trigger: 'change' }
    ],
    serviceClassification1: [
      { required: true, message: '必填项', trigger: 'change', type: 'array' }
    ],
    isValid: [
      { required: true, message: '必填项', trigger: 'change' }
    ]
  }
}
