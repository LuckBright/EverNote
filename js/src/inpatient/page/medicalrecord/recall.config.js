const recallStatusOption = [
  {id: 1, name: '已申请'},
  {id: 2, name: '质控同意'},
  {id: 3, name: '质控拒绝'},
  {id: 4, name: '病案同意'},
  {id: 5, name: '病案拒绝'},
  {id: 6, name: '召回已归档'}
]
const recallStatus = {
  1: '已申请',
  2: '质控同意',
  3: '质控拒绝',
  4: '病案同意',
  5: '病案拒绝',
  6: '召回已归档'
}
const recallMethod = {
  1: '全部召回',
  2: '部分召回'
}
// const roleInfo = {
//   'resident': {
//     prop: 'admitDoctorName',
//     label: '住院医师'
//   },
//   // 'aaa': {
//   //   props: '',
//   //   label: '责任护士'
//   // },
//   'inpatient': {
//     prop: 'admitDoctorName',
//     label: '住院医师'
//   }
// }
// 召回申请
export let recallApplySchema = [
  {
    name: 'visitId',
    label: '住院号',
    span: 6
  },
  {
    name: 'name',
    label: '姓名',
    span: 6
  },
  {
    name: 'sex',
    label: '性别',
    comp: 'sys-type',
    props: {
      code: 'GBT.2261.1'
    }
  },
  {
    name: 'admission',
    label: '入院时间',
    comp: 'el-date-picker',
    props: {
      type: 'datetimerange',
      format: 'yyyy-MM-dd HH:mm:00',
      valueFormat: 'yyyy-MM-dd HH:mm:00',
    }
  },
  {
    name: 'discharge',
    label: '出院时间',
    comp: 'el-date-picker',
    props: {
      type: 'datetimerange',
      format: 'yyyy-MM-dd HH:mm:00',
      valueFormat: 'yyyy-MM-dd HH:mm:00',
    }
  }
]
// let recallApplyColums = [
//   {
//     prop: 'visitId',
//     label: '住院号',
//   },
//   {
//     prop: 'name',
//     label: '姓名',
//     width: 200,
//   },
//   {
//     prop: 'sex',
//     label: '性别',
//     slotName: 'sex'
//     // formatter ({ value }) {
//     //   return value
//     //   // return value ? moment(value).format('YYYY-MM-DD') : ''
//     // }
//   },
//   {
//     prop: 'age',
//     label: '年龄',
//   },
//   {
//     type: 'role',
//     prop: 'primaryNurseName',
//     label: '住院医师',
//   },
//   {
//     prop: 'admissionTime',
//     label: '入院时间',
//   },
//   {
//     prop: 'dischargeTime',
//     label: '出院时间',
//   },
//   {
//     prop: 'dptName',
//     label: '科室',
//   },
//   {
//     prop: 'updaterName',
//     label: '主要诊断',
//   },
//   {
//     prop: 'ever-op', // 该列的唯一标示
//     type: 'btns',
//     label: '操作',
//     width: '100',
//     fixed: 'right',
//     btns: [
//       {
//         prop: 'showRecord',
//         label: '召回申请'
//       }
//     ]
//   }
// ]
export let getRecallApplyColums = function(space) {
  return [
    {
      prop: 'visitId',
      label: '住院号',
    },
    {
      prop: 'name',
      label: '姓名',
      width: 200,
    },
    {
      prop: 'sex',
      label: '性别',
      slotName: 'sex'
    // formatter ({ value }) {
    //   return value
    //   // return value ? moment(value).format('YYYY-MM-DD') : ''
    // }
    },
    {
      prop: 'age',
      label: '年龄',
    },
    {
      prop: 'admitDoctorName',
      label: '住院医师'
    },
    {
      prop: 'admissionTime',
      label: '入院时间',
    },
    {
      prop: 'dischargeTime',
      label: '出院时间',
    },
    {
      prop: 'dptName',
      label: '科室',
    },
    {
      prop: 'diagnosis',
      label: '主要诊断',
    },
    {
      prop: 'ever-op', // 该列的唯一标示
      type: 'btns',
      label: '操作',
      width: '100',
      fixed: 'right',
      btns: [
        {
          prop: 'apply',
          label: '召回申请'
        }
      ]
    }
  ]
}
// 召回记录
export let recallLogSchema = [
  {
    name: 'patientName',
    label: '姓名',
    span: 6
  },
  {
    name: 'recallStatus',
    label: '召回状态',
    span: 6,
    comp: 'sys-select',
    props: {
      options: recallStatusOption,
      placeholder: '选择召回状态',
      field: {
        multiple: false,
        collapsetags: true
      }
    }
  },
  {
    name: 'visitId',
    label: '住院号',
    span: 6
  }
]
export let recallLogColums = [
  {
    prop: 'applicationTime',
    label: '申请日期',
    showOverflowTooltip: true
  },
  {
    prop: 'recallPersonName',
    label: '召回人',
    showOverflowTooltip: true
  },
  {
    prop: 'recallMethod',
    label: '召回方式',
    showOverflowTooltip: true,
    formatter ({ value }) {
      return recallMethod[value]
    }
  },
  {
    prop: 'recallStatus',
    label: '召回状态',
    showOverflowTooltip: true,
    formatter({value}) {
      return recallStatus[value]
    }
  },
  {
    prop: 'visitId',
    label: '住院号',
    showOverflowTooltip: true
  },
  {
    prop: 'patientName',
    label: '姓名',
    showOverflowTooltip: true,
    formatter ({ value }) {
      return value
      // return value ? moment(value).format('YYYY-MM-DD') : ''
    }
  },
  {
    prop: 'sex',
    label: '性别',
    showOverflowTooltip: true,
    slotName: 'sex'
  },
  {
    prop: 'age',
    showOverflowTooltip: true,
    label: '年龄'
  },
  {
    prop: 'admitDoctorName',
    showOverflowTooltip: true,
    label: '住院医师'
  },
  {
    prop: 'admissionTime',
    showOverflowTooltip: true,
    label: '入院时间'
  },
  {
    prop: 'dischargeTime',
    showOverflowTooltip: true,
    label: '出院时间'
  },
  {
    prop: 'recallPurpose',
    showOverflowTooltip: true,
    label: '召回目的'
  },
  {
    prop: 'recallPeriod',
    label: '召回期限',
    showOverflowTooltip: true,
    formatter({value}) {
      return value + '天'
    }
  },
  {
    prop: 'qcReasonsForRejection',
    showOverflowTooltip: true,
    label: '质控拒绝原因'
  },
  {
    prop: 'recordReasonsForRejection',
    showOverflowTooltip: true,
    label: '病案拒绝原因'
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    type: 'btns',
    label: '操作',
    width: '100',
    fixed: 'right',
    btns ({row}) {
      if (Number(row.recallStatus) === 4) {
        return [
          {
            prop: 'showRecord',
            label: '查看详情'
          }
        ]
      } else {
        return []
      }
    }
  }
]
// 质控召回审核
export let recallLevel3Schema = [
  {
    name: 'patientName',
    label: '姓名',
    span: 6
  },
  {
    name: 'recallPersonName',
    label: '召回人',
    span: 6
  },
  {
    name: 'recallStatus',
    label: '召回状态',
    span: 6,
    comp: 'sys-select',
    props: {
      options: recallStatusOption,
      placeholder: '选择召回状态',
      field: {
        multiple: false,
        collapsetags: true
      }
    }
  },
  {
    name: 'visitId',
    label: '住院号',
    span: 6
  },
  {
    name: 'dptId',
    label: '科室',
    span: 6,
    comp: 'custom'
  }
]

export let recallLevel3Colums = [
  {
    prop: 'applicationTime',
    label: '申请日期',
    showOverflowTooltip: true
  },
  {
    prop: 'recallPersonName',
    label: '召回人',
    showOverflowTooltip: true
  },
  {
    prop: 'recallMethod',
    label: '召回方式',
    showOverflowTooltip: true,
    formatter ({ value }) {
      return recallMethod[value]
    },
    width: 120
  },
  {
    prop: 'recallStatus',
    label: '召回状态',
    showOverflowTooltip: true,
    formatter({value}) {
      return recallStatus[value]
    }
  },
  {
    prop: 'visitId',
    showOverflowTooltip: true,
    label: '住院号'
  },
  {
    prop: 'patientName',
    showOverflowTooltip: true,
    label: '姓名'
  },
  {
    prop: 'sex',
    label: '性别',
    showOverflowTooltip: true,
    slotName: 'sex'
  },
  {
    prop: 'age',
    label: '年龄',
    showOverflowTooltip: true
  },
  {
    prop: 'admitDoctorName',
    label: '住院医生',
    showOverflowTooltip: true
  },
  {
    prop: 'admissionTime',
    label: '入院时间',
    showOverflowTooltip: true,
    width: '80'
  },
  {
    prop: 'dischargeTime',
    label: '出院时间',
    showOverflowTooltip: true
  },
  {
    prop: 'dptName',
    label: '科室',
    showOverflowTooltip: true
  },
  {
    prop: 'recallPurpose',
    label: '召回目的',
    showOverflowTooltip: true
  },
  {
    prop: 'recallPeriod',
    label: '召回期限',
    showOverflowTooltip: true,
    formatter({value}) {
      return value + '天'
    }
  },
  {
    prop: 'qualityControlApproverName',
    label: '质控审核人',
    showOverflowTooltip: true
  },
  {
    prop: 'qualityControlApprovalTime',
    label: '质控审核日期',
    showOverflowTooltip: true
  },
  {
    prop: 'qcReasonsForRejection',
    label: '病案拒绝原因',
    showOverflowTooltip: true
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    type: 'btns',
    label: '操作',
    width: 150,
    fixed: 'right',
    btns ({row}) {
      return [
        {
          prop: 'agree',
          label: '通过',
          disabled: !([1].includes(Number(row.recallStatus)))
        },
        {
          prop: 'refuse',
          label: '拒绝',
          disabled: !([1].includes(Number(row.recallStatus)))
        }
      ]
    }
  }
]
// 病案召回审核
export let recallLevel2Schema = [
  {
    name: 'patientName',
    label: '姓名',
    span: 6
  },
  {
    name: 'recallPersonName',
    label: '召回人',
    span: 6
  },
  {
    name: 'recallStatus',
    label: '召回状态',
    span: 6,
    comp: 'sys-select',
    props: {
      options: recallStatusOption,
      placeholder: '选择召回状态',
      field: {
        multiple: false,
        collapsetags: true
      }
    }
  },
  {
    name: 'visitId',
    label: '住院号',
    span: 6
  },
  {
    name: 'dptId',
    label: '科室',
    span: 6,
    comp: 'custom'
  }
]
export let recallLevel2Colums = [
  {
    prop: 'applicationTime',
    label: '申请日期',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'recallPersonName',
    label: '召回人',
    showOverflowTooltip: true,
    width: 120
  },
  {
    prop: 'recallMethod',
    label: '召回方式',
    showOverflowTooltip: true,
    formatter ({ value }) {
      return recallMethod[value]
    },
    width: 120
  },
  {
    prop: 'recallStatus',
    label: '召回状态',
    showOverflowTooltip: true,
    formatter({value}) {
      return recallStatus[value]
    }
  },
  {
    prop: 'visitId',
    label: '住院号',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'patientName',
    label: '姓名',
    showOverflowTooltip: true,
    formatter ({ value }) {
      return value
      // return value ? moment(value).format('YYYY-MM-DD') : ''
    },
    width: 120
  },
  {
    prop: 'sex',
    label: '性别',
    showOverflowTooltip: true,
    slotName: 'sex'
  },
  {
    prop: 'age',
    label: '年龄',
    showOverflowTooltip: true,
    width: 120
  },
  {
    prop: 'admitDoctorName',
    label: '住院医师',
    showOverflowTooltip: true,
    width: 120
  },
  {
    prop: 'dptName',
    label: '科室',
    showOverflowTooltip: true,
    width: 120
  },
  {
    prop: 'admissionTime',
    label: '入院时间',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'dischargeTime',
    label: '出院时间',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'recallPurpose',
    label: '召回目的',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'recallPeriod',
    label: '召回期限',
    showOverflowTooltip: true,
    width: 120,
    formatter({value}) {
      return value + '天'
    }
  },
  {
    prop: 'qualityControlApproverName',
    label: '质控审核人',
    showOverflowTooltip: true,
    width: 120
  },
  {
    prop: 'qualityControlApprovalTime',
    label: '质控审核日期',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'qcReasonsForRejection',
    label: '质控拒绝原因',
    showOverflowTooltip: true,
    width: 160
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    type: 'btns',
    label: '操作',
    width: '150',
    fixed: 'right',
    btns ({row}) {
      if (Number(row.recallAuditMethod) === 2 || (Number(row.recallAuditMethod) === 3 && Number(row.recallStatus) === 2)) {
        return [
          {
            prop: 'agree',
            label: '通过',
            disabled: [4, 5, 6].includes(Number(row.recallStatus))
          },
          {
            prop: 'refuse',
            label: '拒绝',
            disabled: [4, 5, 6].includes(Number(row.recallStatus))
          }
        ]
      } else {
        return []
      }
    }
  }
]
