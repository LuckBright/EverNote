import { regs } from '@/manages/page/organization/utils/model'

export const bedColumns = [
  {
    prop: 'bedCode',
    label: '床位编号',
  },
  // {
  //   prop: 'bedName',
  //   label: '床位名称',
  // },
  {
    prop: 'roomCode',
    label: '房间名称',
  },
  // {
  //   prop: 'roomName',
  //   label: '房间名称',
  // },
  {
    prop: 'bedTypeName',
    label: '床位类型',
  },
  {
    prop: 'bedStatusName',
    label: '床位状态',
  },
  // {
  //   prop: 'bedPositionName',
  //   label: '床位位置',
  // },
  {
    prop: 'orderNumber',
    label: '排序号',
  },
  {
    prop: 'op',
    label: '操作',
    type: 'btns',
    btns: [
      'edit', 'del',
    ]
  }
]
export const bedTypeColumns = [
  {
    prop: 'bedTypeName',
    label: '床位类型',
  },
  {
    prop: 'bedLevelName',
    label: '床位等级',
  },
  {
    prop: 'fitPeopleName',
    label: '适用人群',
  },
  {
    prop: 'status',
    label: '状态',
    formatter ({value}) {
      return value === 1 ? '启用' : '禁用'
    }
  },
  {
    prop: 'bedNumber',
    label: '床位数量',
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
    ]
  }
]
export const bedSchema = [
  {
    name: 'bedCode',
    label: '床位编号',
    span: 12,
  },
  // {
  //   name: 'bedName',
  //   label: '名称',
  //   span: 12,
  // },
  {
    name: 'room',
    label: '房间名称',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'bedType',
    label: '床位类型',
    span: 12,
    comp: 'custom',
  },
  {
    name: 'bedStatus',
    label: '床位状态',
    span: 12,
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'THC_WH_CWZT',
      useObject: true,
      objSimple: true
    }
  },
  // {
  //   name: 'bedPosition',
  //   label: '床位位置',
  //   span: 12,
  //   comp: 'sys-type',
  //   parentClass: 'w',
  //   props: {
  //     code: 'THC_WH_CWWZ',
  //     useObject: true,
  //     objSimple: true
  //   }
  // },
  {
    name: 'orderNumber',
    label: '排序号',
    span: 12,
  },
  {
    name: 'tsBedConfigureDTOList',
    label: '床位配置',
    comp: 'custom',
    span: 12,
  },
]
export const bedTypeSchema = [
  {
    name: 'bedTypeName',
    label: '床位类型',
    span: 12,
  },
  {
    name: 'bedLevel',
    label: '床位等级',
    span: 12,
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'THC_WH_FJLX',
      useObject: true,
      objSimple: true
    }
  },
  {
    name: 'fitPeople',
    label: '适用人群',
    span: 12,
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'THC_WH_CWLX',
      useObject: true,
      objSimple: true
    }
  },
  {
    name: 'orderNumber',
    label: '排序号',
    span: 12,
  },
  {
    name: 'status',
    label: '状态',
    comp: 'select',
    parentClass: 'w',
    props: {
      options: [
        {
          id: 0,
          name: '禁用',
        },
        {
          id: 1,
          name: '启用',
        }
      ],
    },
    span: 12,
  },
  {
    name: 'tsBedTypeItemDTOList',
    label: '床位收费项关联列表',
    comp: 'custom',
    span: 24,
  },
  // 床位list
  {
    name: 'tsBedDTOList',
    label: '床位',
    comp: 'custom',
    span: 24,
  },
]
export const bedRules = {
  bedCode: [{required: true, message: '必填项', trigger: 'change'}],
  // bedName: [{required: true, message: '必填项', trigger: 'change'}],
  room: [{required: true, message: '必填项', trigger: 'change'}],
  bedType: [{required: true, message: '必填项', trigger: 'change'}],
  bedStatus: [{required: true, message: '必填项', trigger: 'change'}],
  orderNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
}
export const bedTypeRules = {
  bedTypeName: [{required: true, message: '必填项', trigger: 'change'}],
  status: [{required: true, message: '必填项', trigger: 'change'}],
}

