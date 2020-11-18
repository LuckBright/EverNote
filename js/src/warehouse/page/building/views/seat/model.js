import { regs } from '@/manages/page/organization/utils/model'

export const seatColumns = [
  {
    prop: 'seatCode',
    label: '座位编号',
  },
  // {
  //   prop: 'seatName',
  //   label: '座位名称',
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
    prop: 'seatTypeName',
    label: '座位类型',
  },
  {
    prop: 'seatStatusName',
    label: '座位状态',
  },
  // {
  //   prop: 'seatPositionName',
  //   label: '座位位置',
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
      'edit',
      // 'del',
    ]
  }
]
export const seatTypeColumns = [
  {
    prop: 'seatTypeName',
    label: '座位类型',
  },
  {
    prop: 'seatLevelName',
    label: '座位等级',
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
    prop: 'seatNumber',
    label: '座位数量',
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
export const seatSchema = [
  {
    name: 'seatCode',
    label: '座位编号',
    span: 12,
  },
  // {
  //   name: 'seatName',
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
    name: 'seatType',
    label: '座位类型',
    span: 12,
    comp: 'custom',
  },
  {
    name: 'seatStatus',
    label: '座位状态',
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
  //   name: 'seatPosition',
  //   label: '座位位置',
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
    name: 'tsSeatConfigureDTOList',
    label: '座位配置',
    comp: 'custom',
    span: 12,
  },
]
export const seatTypeSchema = [
  {
    name: 'seatTypeName',
    label: '座位类型',
    span: 12,
  },
  {
    name: 'seatLevel',
    label: '座位等级',
    span: 12,
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'THC_WH_ZWDJ',
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
    name: 'tsSeatTypeItemDTOList',
    label: '座位收费项关联列表',
    comp: 'custom',
    span: 24,
  },
  // 座位list
  {
    name: 'tsSeatDTOList',
    label: '座位',
    comp: 'custom',
    span: 24,
  },
]
export const seatRules = {
  seatCode: [{required: true, message: '必填项', trigger: 'change'}],
  // seatName: [{required: true, message: '必填项', trigger: 'change'}],
  room: [{required: true, message: '必填项', trigger: 'change'}],
  seatType: [{required: true, message: '必填项', trigger: 'change'}],
  seatStatus: [{required: true, message: '必填项', trigger: 'change'}],
  orderNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
}
export const seatTypeRules = {
  seatTypeName: [{required: true, message: '必填项', trigger: 'change'}],
  status: [{required: true, message: '必填项', trigger: 'change'}],
}

