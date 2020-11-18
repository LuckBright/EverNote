export const attributeData = [
  {
    id: 1,
    param: 'value',
    description: '双向绑定的值',
    type: 'string/number/object/array',
  },
  {
    id: 2,
    param: 'multiple',
    description: '是否为多选',
    type: 'boolean',
  },
  {
    id: 3,
    param: 'disabled',
    description: '是否禁用',
    type: 'boolean',
  },
  {
    id: 4,
    param: 'useCache',
    description: '是否使用缓存策略',
    type: 'boolean',
    default: 'true',
  },
  {
    id: 5,
    param: 'params',
    description: '查询入参，具体见下文',
    type: 'object',
  },
  {
    id: 6,
    param: 'fields',
    description: '要返回的字段',
    type: 'string/array',
    default: '[\'id\']',
  },
  {
    id: 7,
    param: 'props',
    description: 'el-select 的所有属性',
    type: 'object',
  },
]
export const paramsData = [
  {
    id: 1,
    param: 'everQueryType',
    description: '查询的接口类型，可选值为out或者空，out表示查询/thc-platform-core/out/staff/getStaffListByCondition接口，建议调用时都将此参数设置为out',
    type: 'string',
    default: '空',
  },
  {
    id: 2,
    param: 'orgIdList',
    description: '人员所属机构',
    type: 'array',
  },
  {
    id: 3,
    param: 'typeCodeList',
    description: '人员类型',
    type: 'array',
  },
]
export const eventData = [
  {
    id: 1,
    param: 'finish',
    description: '查询完成后想外暴露的事件，返回本次查询的结果'
  }
]
