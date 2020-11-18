import manufacturerApi from '@/warehouse/store/manufacturerapi'
import { HERBALTYPE } from '@/util/common'
export const DRUG_SCHEMA = [
  {
    name: 'typeName',
    label: '类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'code',
    label: '编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'byname',
    label: '通用名:',
    comp: 'readonlyitem'
  },
  {
    name: 'initialGeneric',
    label: '通用名拼音码:',
    comp: 'readonlyitem'
  },
  {
    name: 'name',
    label: '商品名:',
    comp: 'readonlyitem'
  },
  {
    name: 'letterPy',
    label: '商品名拼音码:',
    comp: 'readonlyitem'
  },
  {
    name: 'barCode',
    label: '条码:',
    comp: 'readonlyitem'
  },
  {
    name: 'engName',
    label: '英文名:',
    comp: 'readonlyitem'
  },
  {
    name: 'internalName',
    label: '药品名内部备注:',
    comp: 'readonlyitem'
  },
  {
    name: 'materialCode',
    label: '物料编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'manufacturerObject.name',
    label: '生产厂商:',
    comp: 'readonlyitem'
  },
  {
    name: 'ratifyCode',
    label: '批准文号:',
    comp: 'readonlyitem'
  },
  {
    name: 'dosageForm',
    label: '剂型:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WH_DRUG_FORM'
    }
  },
  {
    name: 'packageInfo',
    label: '说明书规格:',
    comp: 'readonlyitem'
  },
  {
    name: 'content',
    label: '剂量:',
    comp: 'readonlyitem'
  },
  {
    name: 'unit',
    label: '剂量单位:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'amount',
    label: '默认用量:',
    comp: 'readonlyitem'
  },
  {
    name: 'frequency',
    label: '用药频次:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'CV06.00.228'
    }
  },
  {
    name: 'useWay',
    label: '给药途径:',
    comp: 'sys-value',
    props: {
      multiple: true,
      disabled: true,
      type: 'CV06.00.102'
    }
  },
  {
    name: 'specialClassify',
    label: '毒麻精放药品:',
    comp: 'sys-value',
    props: {
      disabled: true,
      multiple: true,
      type: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'preparationUnit',
    label: '制剂单位:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'packageUnit',
    label: '包装单位:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'convertRatio',
    label: '包装转换比:',
    comp: 'readonlyitem'
  },
  {
    name: 'attention',
    label: '用药注意事项:',
    comp: 'readonlyitem'
  }
]
export const DRUG_SCHEMA_EDIT = [
  {
    name: 'typeName',
    label: '类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'code',
    label: '编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'byname',
    label: '通用名'
  },
  {
    name: 'initialGeneric',
    label: '通用名拼音码'
  },
  {
    name: 'name',
    label: '商品名'
  },
  {
    name: 'letterPy',
    label: '商品名拼音码'
  },
  {
    name: 'barCode',
    label: '条码:'
  },
  {
    name: 'engName',
    label: '英文名'
  },
  {
    name: 'internalName',
    label: '药品名内部备注'
  },
  {
    name: 'materialCode',
    label: '物料编码'
  },
  {
    name: 'produceCompanyId',
    label: '生产厂商',
    comp: 'ever-remoteMethod',
    props: {
      api: manufacturerApi,
      isSilentQuery: true
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'dosageForm',
    label: '剂型',
    comp: 'sysSingleMulti',
    span: 24,
    props: {
      filterable: true,
      code: 'THC_WH_DRUG_FORM'
    }
  },
  {
    name: 'packageInfo',
    label: '说明书规格:'
  },
  {
    name: 'content',
    label: '剂量'
  },
  {
    name: 'unit',
    label: '剂量单位',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      filterable: true,
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'amount',
    label: '默认用量',
    comp: 'ever-price'
  },
  {
    name: 'frequency',
    label: '用药频次',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      filterable: true,
      code: 'CV06.00.228'
    }
  },
  {
    name: 'useWay',
    label: '给药途径',
    span: 24,
    comp: 'sys-single-multi',
    props: {
      multiple: true,
      filterable: true,
      code: 'CV06.00.102'
    }
  },
  {
    name: 'specialClassify',
    label: '毒麻精放药品',
    span: 24,
    comp: 'sys-single-multi',
    props: {
      multiple: true,
      filterable: true,
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'preparationUnit',
    label: '制剂单位',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      filterable: true,
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'packageUnit',
    label: '包装单位',
    span: 24,
    comp: 'sys-single-multi',
    props: {
      filterable: true,
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'convertRatio',
    label: '包装转换比',
    comp: 'ever-price'
  },
  {
    name: 'attention',
    label: '用药注意事项'
  }
]
export const CHINESE_DRUG_SCHEMA = [
  {
    name: 'typeName',
    label: '类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'code',
    label: '编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'byname',
    label: '通用名:',
    comp: 'readonlyitem'
  },
  {
    name: 'initialGeneric',
    label: '通用名拼音码:',
    comp: 'readonlyitem'
  },
  {
    name: 'name',
    label: '商品名:',
    comp: 'readonlyitem'
  },
  {
    name: 'letterPy',
    label: '商品名拼音码:',
    comp: 'readonlyitem'
  },
  {
    name: 'engName',
    label: '英文名:',
    comp: 'readonlyitem'
  },
  {
    name: 'herbalType',
    label: '分类:',
    comp: 'sys-value',
    props: {
      disabled: true,
      initoptions: HERBALTYPE
    }
  },
  {
    name: 'drugRatio',
    label: '药效比:',
    comp: 'readonlyitem'
  },
  {
    name: 'specialClassify',
    label: '毒麻精放药品:',
    comp: 'sys-value',
    props: {
      disabled: true,
      multiple: true,
      type: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'unit',
    label: '单位:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WH_ZYCDW'
    }
  },
  {
    name: 'dosageunit',
    label: '规格单位:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WH_ZYCDW'
    }
  },
  {
    name: 'specratio',
    label: '规格转换比:',
    comp: 'readonlyitem'
  },
  {
    name: 'manufacturerObject.name',
    label: '生产厂商:',
    comp: 'readonlyitem'
  },
  {
    name: 'ratifyCode',
    label: '批准文号:',
    comp: 'readonlyitem'
  },
  {
    name: 'barCode',
    label: '条码:',
    comp: 'readonlyitem'
  },
  {
    name: 'internalName',
    label: '药品名内部备注:',
    comp: 'readonlyitem'
  },
  {
    name: 'attention',
    label: '用药注意事项:',
    comp: 'readonlyitem'
  },
  {
    name: 'materialCode',
    label: '物料编码:',
    comp: 'readonlyitem'
  }
]
export const CHINESE_DRUG_SCHEMA_EDIT = [
  {
    name: 'typeName',
    label: '类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'code',
    label: '编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'byname',
    label: '通用名'
  },
  {
    name: 'initialGeneric',
    label: '通用名拼音码'
  },
  {
    name: 'name',
    label: '商品名'
  },
  {
    name: 'letterPy',
    label: '商品名拼音码'
  },
  {
    name: 'engName',
    label: '英文名'
  },
  {
    name: 'herbalType',
    label: '分类',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      filterable: true,
      initOptions: HERBALTYPE
    }
  },
  {
    name: 'drugRatio',
    label: '药效比',
    comp: 'ever-price',
    props: {
      disabled: true
    }
  },
  {
    name: 'specialClassify',
    label: '毒麻精放药品',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      multiple: true,
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'unit',
    label: '单位',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      code: 'THC_WH_ZYCDW'
    }
  },
  {
    name: 'dosageunit',
    label: '规格单位',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      code: 'THC_WH_ZYCDW'
    }
  },
  {
    name: 'specratio',
    label: '规格转换比',
    props: {
      type: 'number'
    }
  },
  {
    name: 'produceCompanyId',
    label: '生产厂商',
    comp: 'ever-remoteMethod',
    props: {
      api: manufacturerApi,
      isSilentQuery: true
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'barCode',
    label: '条码'
  },
  {
    name: 'internalName',
    label: '药品名内部备注'
  },
  {
    name: 'attention',
    label: '用药注意事项'
  },
  {
    name: 'materialCode',
    label: '物料编码'
  }
]
export const MEDICAL_CONSUMABLES = [
  {
    name: 'typeName',
    label: '类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'code',
    label: '编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'name',
    label: '商品名:',
    comp: 'readonlyitem'
  },
  {
    name: 'namePy',
    label: '商品名拼音码',
    comp: 'readonlyitem'
  },
  {
    name: 'registerCode',
    label: '注册证号:',
    comp: 'readonlyitem'
  },
  {
    name: 'model',
    label: '型号:',
    comp: 'readonlyitem'
  },
  {
    name: 'manufacturerObject.name',
    label: '生产厂商:',
    span: 24,
    comp: 'readonlyitem'
  },
  {
    name: 'spec',
    label: '规格:',
    comp: 'readonlyitem'
  },
  {
    name: 'packageUnitId',
    label: '单位:',
    comp: 'sys-value',
    props: {
      disabled: true,
      type: 'THC_WAREHOUSE_OTHER_UNIT'
    }
  },
  {
    name: 'barCode',
    label: '条码:',
    comp: 'readonlyitem'
  },
  {
    name: 'materialCode',
    label: '物料编码:',
    comp: 'readonlyitem'
  }
]
export const MEDICAL_CONSUMABLES_EDIT = [
  {
    name: 'typeName',
    label: '类型:',
    comp: 'readonlyitem'
  },
  {
    name: 'code',
    label: '编码:',
    comp: 'readonlyitem'
  },
  {
    name: 'name',
    label: '商品名'
  },
  {
    name: 'namePy',
    label: '商品名拼音码'
  },
  {
    name: 'registerCode',
    label: '注册证号'
  },
  {
    name: 'model',
    label: '型号'
  },
  {
    name: 'produceCompanyId',
    label: '生产厂商',
    comp: 'ever-remoteMethod',
    props: {
      api: manufacturerApi,
      isSilentQuery: true
    }
  },
  {
    name: 'spec',
    label: '规格'
  },
  {
    name: 'packageUnitId',
    label: '单位:',
    comp: 'sys-single-multi',
    span: 24,
    props: {
      code: 'THC_WAREHOUSE_OTHER_UNIT'
    }
  },
  {
    name: 'barCode',
    label: '条码'
  },
  {
    name: 'materialCode',
    label: '物料编码'
  }
]
export const OTHER_RULES = {
  namePy: [
    { required: true, message: '必填项', trigger: 'blur' }
  ]
}
export const DRUG_RULES = {
  name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  byname: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  letterPy: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  initialGeneric: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  packageInfo: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  produceCompanyId: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  dosageForm: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  preparationUnit: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  packageUnit: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  convertRatio: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ]
}
export const OTHER_DRUG_RULES = {
  name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  byname: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  letterPy: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  initialGeneric: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  herbalType: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  unit: [
    { required: true, message: '必填项', trigger: 'change' }
  ],
  drugRatio: [{required: true, message: '必填项', trigger: 'blur', type: 'number'}]
}
