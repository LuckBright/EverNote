// 解锁申请页面
const lockStatusOption = [
  {id: '1', name: '未解锁'},
  {id: '2', name: '已申请'},
  {id: '3', name: '已解锁'}
]
const lockStatus = {
  1: '未解锁',
  2: '已申请',
  3: '已解锁'
}
export const applyDeblockSchema = [
  {
    name: 'patientName',
    label: '姓名',
    span: 6,
    // comp: 'custom'
  },
  {
    name: 'lockStatus',
    label: '解锁状态',
    span: 6,
    comp: 'sys-select',
    props: {
      options: lockStatusOption,
      placeholder: '选择解锁状态',
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

export const applyDeblockColumns = [
  {
    prop: 'visitId',
    label: '住院号',
    showOverflowTooltip: true,
    width: 150
  },
  {
    prop: 'patientName',
    label: '姓名',
    showOverflowTooltip: true,
    width: 150,
    formatter ({ value }) {
      return value
      // return value ? moment(value).format('YYYY-MM-DD') : ''
    }
  },
  {
    prop: 'patientSex',
    label: '性别',
    showOverflowTooltip: true,
    width: 100
  },
  {
    prop: 'patientAge',
    label: '年龄',
    showOverflowTooltip: true,
    width: 100
  },
  {
    prop: 'doctorName',
    label: '住院医师',
    showOverflowTooltip: true,
    width: 150
  },
  {
    prop: 'hospitalizedTime',
    label: '入院时间',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'leaveHospitalTime',
    label: '出院时间',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'subjectName',
    label: '科室',
    showOverflowTooltip: true,
    width: 150
  },
  {
    prop: 'medicalName',
    label: '锁定病历',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'lockTime',
    label: '锁定日期',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'lockStatus',
    label: '解锁状态',
    showOverflowTooltip: true,
    width: 100,
    formatter ({value}) {
      return lockStatus[value]
    }
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    type: 'btns',
    label: '操作',
    width: '100',
    fixed: 'right',
    btns ({row}) {
      if (Number(row.lockStatus) === 1) {
        return [
          {
            prop: 'applyUnLock',
            label: '申请解锁'
          }
        ]
      } else {
        return []
      }
    }
  }
]
export const unlockAuditSchema = [
  {
    name: 'patientName',
    label: '姓名',
    span: 6
  },
  {
    name: 'applyName',
    label: '申请人',
    span: 6
  },
  {
    name: 'lockStatus',
    label: '解锁状态',
    span: 6,
    comp: 'sys-select',
    props: {
      options: lockStatusOption,
      placeholder: '选择解锁状态',
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
    name: 'subjectId',
    label: '科室',
    span: 6,
    comp: 'custom'
  }
]
export const unlockAuditColumns = [
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
    width: 150
  },
  {
    prop: 'patientSex',
    label: '性别',
    showOverflowTooltip: true,
    width: 100
    // slotName: 'sex'
  },
  {
    prop: 'patientAge',
    label: '年龄',
    showOverflowTooltip: true,
    width: 100
    // formatter ({value}) {
    //   return value || '--'
    // }
  },
  {
    prop: 'doctorName',
    label: '住院医师',
    showOverflowTooltip: true,
    width: 150
  },
  {
    prop: 'hospitalizedTime',
    label: '入院时间',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'leaveHospitalTime',
    label: '出院时间',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'subjectName',
    label: '科室',
    showOverflowTooltip: true,
    width: 100
  },
  {
    prop: 'medicalName',
    label: '锁定病历',
    showOverflowTooltip: true,
    width: 100
  },
  {
    prop: 'lockTime',
    label: '锁定日期',
    showOverflowTooltip: true,
    width: 200
  },
  {
    prop: 'lockStatus',
    label: '解锁状态',
    showOverflowTooltip: true,
    width: 100,
    formatter ({value}) {
      return lockStatus[value]
    }
  },
  {
    prop: 'applyName',
    label: '申请人',
    showOverflowTooltip: true,
    width: 150,
  },
  {
    prop: 'applyTime',
    label: '申请日期',
    showOverflowTooltip: true,
    width: 200,
  },
  {
    prop: 'auditName',
    label: '审批人',
    showOverflowTooltip: true,
    width: 150,
  },
  {
    prop: 'auditTime',
    label: '审批日期',
    showOverflowTooltip: true,
    width: 200,
  },
  {
    prop: 'ever-op', // 该列的唯一标示
    type: 'btns',
    label: '操作',
    width: '100',
    fixed: 'right',
    btns ({row}) {
      if (Number(row.lockStatus) === 2) {
        return [
          {
            prop: 'agree',
            label: '通过'
          }
        ]
      } else {
        return []
      }
    }
  }
]
