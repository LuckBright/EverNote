import { GENERATE_UUID as U } from '@/bi/util/reportsetuuid'

export const tableData = [
  {
    id: U(),
    param: 'value/v-model',
    description: '绑定值',
    type: 'Array, String, Object, Number',
    required: true,
    default: '',
  },
  {
    id: U(),
    param: 'props',
    description: 'el-select或者el-cascader或者el-tree的属性，当现有的属性不够用时，才在此属性中添加',
    type: 'object',
    required: false,
  },
  {
    id: U(),
    param: 'isOrg',
    description: '控制查询条件，为true表示查询条件为登录人当前选择的登录机构，为false表示查询条件为当前登录人所属的集团',
    type: 'Boolean',
    required: false,
    default: 'true',
  },
  {
    id: U(),
    param: 'type',
    description: 'cascader select tree 其中cascader 是默认值',
    type: 'String',
    required: false,
    default: 'cascader',
  },
  {
    id: U(),
    param: 'multiple',
    description: '是否多选',
    type: 'Boolean',
    required: false,
    default: 'false',
  },
  {
    id: U(),
    param: 'params',
    description: '附加查询参数',
    type: 'Object',
    required: false,
    default: '{}',
  },
  {
    id: U(),
    param: 'cascaderProps',
    description: '级联属性',
    type: 'Object',
    required: false,
    default: '{checkStrictly: true,}',
  },
  {
    id: U(),
    param: 'fields',
    description: '下拉内容一行数据中的带有的key',
    type: 'Array, String',
    required: false,
    default: '[ \'id\',\'code\',\'name\',]',
  },
  {
    id: U(),
    param: 'disabled',
    description: '是否禁用',
    type: 'Boolean',
    required: false,
    default: 'false',
  },
  {
    id: U(),
    param: 'placeholder',
    description: '提示文案',
    type: 'String',
    required: false,
    default: '',
  },
]
export const paramsData = [
  {
    id: U(),
    param: 'everQueryType',
    description: '控制查询时调用哪个接口，可选值为 isOut/isLogin/空；为isOut时，表示查询外部接口（getOrgListByCondition），且会将当前登录人的id作为' +
      '查询条件staffIdList的值进行查询，若params中还配置了staffIdList查询条件，则会将当前登录人的条件覆盖；' +
      '为isLogin时，表示查询当前登录人有权限登录的机构，查询接口为loadByStaffId；',
    type: 'string',
    default: '',
  },
  {
    id: U(),
    param: 'status',
    description: '可选值Y/N，默认为Y',
    type: 'string',
    default: 'Y',
  },
]
