import {regs} from '@/manages/page/organization/utils/model'
export const roomColumns = [
  {
    prop: 'roomCode',
    label: '房间名称',
  },
  // {
  //   prop: 'roomName',
  //   label: '房间名称',
  // },
  {
    prop: 'buildingName',
    label: '所属建筑',
  },
  {
    prop: 'roomPurposeName',
    label: '用途',
  },
  {
    prop: 'belongFloor',
    label: '所属楼层',
  },
  {
    prop: 'usableArea',
    label: '使用面积（平方米）',
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
      // 'del',
    ]
  }
]
export const roomSchema = [
  {
    name: 'roomCode',
    label: '房间名称',
    span: 12,
  },
  {
    name: 'roomName',
    label: '名称',
    parentClass: 'dn',
    span: 12,
  },
  {
    name: 'building',
    label: '所属建筑',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'roomPurpose',
    label: '房间用途',
    span: 12,
    comp: 'sys-type',
    parentClass: 'w',
    props: {
      code: 'THC_WH_ROOM_PURPOSE',
      useObject: true,
      objSimple: true
    }
  },
  {
    name: 'belongFloor',
    label: '所属楼层',
    span: 12,
  },
  // {
  //   name: 'roomType',
  //   label: '房间类型',
  //   span: 12,
  //   comp: 'sys-type',
  //   parentClass: 'w',
  //   props: {
  //     code: 'THC_WH_FJLX',
  //     useObject: true,
  //     objSimple: true
  //   }
  // },
  {
    name: 'usableArea',
    label: '使用面积',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'orderNumber',
    label: '排序号',
    span: 12,
  },
  {
    name: 'tsRoomConfigureDTOList',
    label: '房间配置',
    comp: 'custom',
    span: 12,
  },
  {
    name: 'tsRoomOrgSubjectDTO',
    label: '关联科室',
    comp: 'custom',
    span: 12,
  },
]
export const roomRules = {
  roomCode: [{required: true, message: '必填项', trigger: 'change'}],
  // roomName: [{required: true, message: '必填项', trigger: 'change'}],
  building: [{required: true, message: '必填项', trigger: 'change'}],
  roomPurpose: [{required: true, message: '必填项', trigger: 'change'}],
  belongFloor: [{required: true, message: '必填项', trigger: 'change'}],
  usableArea: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
  orderNumber: [{pattern: regs.number, message: '只能输入正整数', trigger: 'change'}],
}

