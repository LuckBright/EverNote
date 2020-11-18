import api from '../store/druglevelapi'
// 化学药品和治疗用生物制品
export const CHEMICAL = [
  // {
  //   name: 'classification',
  //   label: '药品分类',
  //   comp: 'custom',
  //   span: 24,
  //   props: {
  //     disabled: true
  //   }
  // },
  {
    name: 'drugId',
    comp: 'ever-remote-method',
    props: {
      api: api
    },
    label: '通用名称'
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'engName',
    label: '英文名称'
  },
  {
    name: 'letterPy',
    label: '汉语拼音',
    props: {
      disabled: true
    }
  },
  {
    name: 'instructionLevel',
    label: '药品说明书类别',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_INSTRUCTIONS_CATEGORY'
    }
  },
  {
    name: 'manufacturer',
    label: '生产厂商',
    comp: 'custom'
  },
  {
    name: 'code',
    label: '药品编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    label: '条码编号'
  },
  {
    name: 'specialClassify',
    label: '特殊药品分类',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'dosageForm',
    label: '剂型',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'unit',
    label: '剂量单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'content',
    label: '剂量',
    props: {
      type: 'number'
    }
  },
  {
    name: 'packageInfo',
    label: '说明书规格'
  },
  {
    name: 'packing',
    label: '包装单位',
    comp: 'custom',
    span: 24
  },
  {
    name: 'useWay',
    label: '给药途径',
    comp: 'ever-select',
    props: {
      options: [],
      multiple: true,
      filterable: true
    }
  },
  {
    name: 'frequency',
    label: '默认频次',
    comp: 'sys-type',
    props: {
      code: 'CV06.00.228'
    }
  },
  {
    name: 'amount',
    label: '默认用量',
    props: {
      type: 'number',
      placeholder: '请输入默认用量'
    }
  },
  {
    name: 'spec',
    label: '规格',
    props: {
      disabled: true
    }
  },
  {
    name: 'element',
    label: '成份'
  },
  {
    name: 'shape',
    label: '性状'
  },
  {
    name: 'function',
    label: '适应症',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'dosage',
    label: '用法用量',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'badReaction',
    label: '不良反应',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'taboo',
    label: '禁忌',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'attention',
    label: '注意事项',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'lactateDosage',
    label: '孕妇及哺乳期妇女用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'childrenDosage',
    label: '儿童用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'agedDosage',
    label: '老年用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'mutex',
    label: '药物相互作用',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'overdose',
    label: '药物过量',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'clinicalTrials',
    label: '临床试验',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'toxicology',
    label: '药理毒理',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'pharmacokinetics',
    label: '药代动力学',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'store',
    label: '贮藏'
  },
  {
    name: 'execStandard',
    label: '执行标准'
  }
]
// 放射性药品
export const RADIOACTIVITY = [
  // {
  //   name: 'classification',
  //   label: '药品分类',
  //   comp: 'custom',
  //   span: 24
  // },
  {
    name: 'drugId',
    comp: 'ever-remote-method',
    props: {
      api: api
    },
    label: '通用名称'
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'engName',
    label: '英文名称'
  },
  {
    name: 'letterPy',
    label: '汉语拼音',
    props: {
      disabled: true
    }
  },
  {
    name: 'instructionLevel',
    label: '药品说明书类别',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_INSTRUCTIONS_CATEGORY'
    }
  },
  {
    name: 'manufacturer',
    label: '生产厂商',
    comp: 'custom'
  },
  {
    name: 'halfLife',
    label: '放射性核素半衰期'
  },
  {
    name: 'intensity',
    label: '放射性活度核标示时间'
  },
  {
    name: 'absorbed',
    label: '内辐射吸收剂量'
  },
  {
    name: 'code',
    label: '药品编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    label: '条码编号'
  },
  {
    name: 'specialClassify',
    label: '特殊药品分类',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'dosageForm',
    label: '剂型',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'unit',
    label: '剂量单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'content',
    label: '剂量',
    props: {
      type: 'number'
    }
  },
  {
    name: 'packageInfo',
    label: '说明书规格'
  },
  {
    name: 'packing',
    label: '包装单位',
    comp: 'custom',
    span: 24
  },
  {
    name: 'useWay',
    label: '给药途径',
    comp: 'ever-select',
    props: {
      options: [],
      multiple: true,
      filterable: true
    }
  },
  {
    name: 'frequency',
    label: '默认频次',
    comp: 'sys-type',
    props: {
      code: 'CV06.00.228'
    }
  },
  {
    name: 'amount',
    label: '默认用量',
    props: {
      type: 'number',
      placeholder: '请输入默认用量'
    }
  },
  {
    name: 'spec',
    label: '规格',
    props: {
      disabled: true
    }
  },
  {
    name: 'element',
    label: '成份'
  },
  {
    name: 'shape',
    label: '性状'
  },
  {
    name: 'function',
    label: '适应症',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'dosage',
    label: '用法用量',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'badReaction',
    label: '不良反应',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'taboo',
    label: '禁忌',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'attention',
    label: '注意事项',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'lactateDosage',
    label: '孕妇及哺乳期妇女用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'childrenDosage',
    label: '儿童用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'clinicalTrials',
    label: '临床试验',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'toxicology',
    label: '药理毒理',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'pharmacokinetics',
    label: '药代动力学',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'store',
    label: '贮藏'
  },
  {
    name: 'execStandard',
    label: '执行标准'
  }
]
// 免疫产品
export const IMMUNE = [
  // {
  //   name: 'classification',
  //   label: '药品分类',
  //   comp: 'custom',
  //   span: 24
  // },
  {
    name: 'drugId',
    comp: 'ever-remote-method',
    props: {
      api: api
    },
    label: '通用名称'
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'engName',
    label: '英文名称'
  },
  {
    name: 'letterPy',
    label: '汉语拼音',
    props: {
      disabled: true
    }
  },
  {
    name: 'instructionLevel',
    label: '药品说明书类别',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_INSTRUCTIONS_CATEGORY'
    }
  },
  {
    name: 'manufacturer',
    label: '生产厂商',
    comp: 'custom'
  },
  {
    name: 'inoculations',
    label: '接种对象',
    comp: 'sys-type',
    props: {
      code: 'THC_SOB_SERVICE_TYPE'
    }
  },
  {
    name: 'code',
    label: '药品编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    label: '条码编号'
  },
  {
    name: 'specialClassify',
    label: '特殊药品分类',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'dosageForm',
    label: '剂型',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'unit',
    label: '剂量单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'content',
    label: '剂量',
    props: {
      type: 'number'
    }
  },
  {
    name: 'packageInfo',
    label: '说明书规格'
  },
  {
    name: 'packing',
    label: '包装单位',
    comp: 'custom',
    span: 24
  },
  {
    name: 'useWay',
    label: '给药途径',
    comp: 'ever-select',
    props: {
      options: [],
      multiple: true,
      filterable: true
    }
  },
  {
    name: 'frequency',
    label: '默认频次',
    comp: 'sys-type',
    props: {
      code: 'CV06.00.228'
    }
  },
  {
    name: 'amount',
    label: '默认用量',
    props: {
      type: 'number',
      placeholder: '请输入默认用量'
    }
  },
  {
    name: 'spec',
    label: '规格',
    props: {
      disabled: true
    }
  },
  {
    name: 'element',
    label: '成份'
  },
  {
    name: 'shape',
    label: '性状'
  },
  {
    name: 'function',
    label: '作用与用途',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'dosage',
    label: '免疫程序和剂量',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'badReaction',
    label: '不良反应',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'taboo',
    label: '禁忌',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'attention',
    label: '注意事项',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'store',
    label: '贮藏'
  },
  {
    name: 'execStandard',
    label: '执行标准'
  }
]
// 中药颗粒
export const GRAIN = [
  {
    name: 'drugId',
    comp: 'ever-remote-method',
    props: {
      api: api
    },
    label: '药材名称'
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'letterPy',
    label: '汉语拼音',
    props: {
      disabled: true
    }
  },
  {
    name: 'code',
    label: '药品编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    label: '条码编号'
  },
  {
    name: 'specialClassify',
    label: '特殊药品分类',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'manufacturer',
    label: '生产厂商',
    comp: 'custom'
  },
  {
    name: 'drugRatio',
    label: '药效比'
  },
  {
    name: 'packing',
    label: '包装单位',
    comp: 'custom',
    span: 24
  },
  {
    name: 'spec',
    label: '规格',
    props: {
      disabled: true
    }
  },
  {
    name: 'source',
    label: '来源',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'shape',
    label: '性状',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'make',
    label: '炮制',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'taste',
    label: '性味与归经',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'function',
    label: '功能与主治',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'dosage',
    label: '用法用量',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'attention',
    label: '注意事项',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'store',
    label: '贮藏',
    span: 24,
    props: {
      type: 'textarea'
    }
  }
]
// 中药饮片
export const PIECES = [
  {
    name: 'drugId',
    comp: 'ever-remote-method',
    props: {
      api: api
    },
    label: '药材名称'
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'letterPy',
    label: '汉语拼音',
    props: {
      disabled: true
    }
  },
  {
    name: 'code',
    label: '药品编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    label: '条码编号'
  },
  {
    name: 'specialClassify',
    label: '特殊药品分类',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'manufacturer',
    label: '生产厂商',
    comp: 'custom'
  },
  {
    name: 'spec',
    label: '规格',
    props: {
      disabled: true
    }
  },
  {
    name: 'packing',
    label: '包装单位',
    comp: 'custom',
    span: 24
  },
  {
    name: 'source',
    label: '来源',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'shape',
    label: '性状',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'make',
    label: '炮制',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'taste',
    label: '性味与归经',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'function',
    label: '功能与主治',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'dosage',
    label: '用法用量',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'attention',
    label: '注意事项',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'store',
    label: '贮藏',
    span: 24,
    props: {
      type: 'textarea'
    }
  }
]
// 中成药
export const MEDICINE = [
  // {
  //   name: 'classification',
  //   label: '药品分类',
  //   comp: 'custom',
  //   span: 24
  // },
  {
    name: 'drugId',
    comp: 'ever-remote-method',
    props: {
      api: api
    },
    label: '通用名称'
  },
  {
    name: 'name',
    label: '商品名称'
  },
  {
    name: 'letterPy',
    label: '汉语拼音',
    props: {
      disabled: true
    }
  },
  {
    name: 'code',
    label: '药品编码',
    props: {
      disabled: true
    }
  },
  {
    name: 'barCode',
    label: '条码编号'
  },
  {
    name: 'instructionLevel',
    label: '药品说明书类别',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_INSTRUCTIONS_CATEGORY'
    }
  },
  {
    name: 'manufacturer',
    label: '生产厂商',
    comp: 'custom'
  },
  {
    name: 'specialClassify',
    label: '特殊药品分类',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DRUG_CONTRAL'
    }
  },
  {
    name: 'ratifyCode',
    label: '批准文号'
  },
  {
    name: 'dosageForm',
    label: '剂型',
    comp: 'ever-select',
    props: {
      options: [],
      filterable: true
    }
  },
  {
    name: 'unit',
    label: '剂量单位',
    comp: 'sys-type',
    props: {
      code: 'THC_WH_DOSE_UNIT'
    }
  },
  {
    name: 'content',
    label: '剂量',
    props: {
      type: 'number'
    }
  },
  {
    name: 'packageInfo',
    label: '说明书规格'
  },
  {
    name: 'packing',
    label: '包装单位',
    comp: 'custom',
    span: 24
  },
  {
    name: 'useWay',
    label: '给药途径',
    comp: 'ever-select',
    props: {
      options: [],
      multiple: true,
      filterable: true
    }
  },
  {
    name: 'frequency',
    label: '默认频次',
    comp: 'sys-type',
    props: {
      code: 'CV06.00.228'
    }
  },
  {
    name: 'amount',
    label: '默认用量',
    props: {
      type: 'number',
      placeholder: '请输入默认用量'
    }
  },
  {
    name: 'spec',
    label: '规格',
    props: {
      disabled: true
    }
  },
  {
    name: 'element',
    label: '成份'
  },
  {
    name: 'shape',
    label: '性状'
  },
  {
    name: 'function',
    label: '适应症',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'dosage',
    label: '用法用量',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'badReaction',
    label: '不良反应',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'taboo',
    label: '禁忌',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'attention',
    label: '注意事项',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'lactateDosage',
    label: '孕妇及哺乳期妇女用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'childrenDosage',
    label: '儿童用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'agedDosage',
    label: '老年用药',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'mutex',
    label: '药物相互作用',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'overdose',
    label: '药物过量',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'clinicalTrials',
    label: '临床试验',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'toxicology',
    label: '药理毒理',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'pharmacokinetics',
    label: '药代动力学',
    type: 'textarea',
    span: 24,
    props: {
      type: 'textarea'
    }
  },
  {
    name: 'store',
    label: '贮藏'
  },
  {
    name: 'execStandard',
    label: '执行标准'
  }
]
// rules
export const RULES = {
  drugId: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  ratifyCode: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  dosageForm: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  unit: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  function: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  dosage: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  badReaction: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  specialClassify: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  frequency: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  // amount: [
  //   { required: true, message: '必填项', trigger: 'blur' }
  // ],
  // instructionLevel: [
  //   { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  // ],
  content: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ]
}
export const RULESGRAIN = {
  drugId: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  name: [
    { required: true, message: '必填项', trigger: 'blur' }
  ],
  produceCompanyId: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  drugRatio: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ],
  specialClassify: [
    { required: true, message: '必填项', trigger: 'blur', type: 'number' }
  ]
}
