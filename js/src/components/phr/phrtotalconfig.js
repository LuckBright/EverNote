import moment from 'moment'
let tableNames = [
  {
    name: '就诊',
    nameEn: 'JIUZHEN',
    activeName: 'phr_total_detail'
  },
  {
    name: '预约记录',
    nameEn: 'YUYUEJILU',
    activeName: 'phr_appointment'
  },
  {
    name: '过敏记录',
    nameEn: 'GUOMINJILU',
    activeName: 'phr_allergens'
  },
  {
    name: '诊断',
    nameEn: 'ZHENDUAN',
    activeName: 'phr_diagnosis'
  },
  {
    name: '门诊处方',
    nameEn: 'MENZHENCHUFANG',
    activeName: 'phr_advice'
  },
  // {
  //   name: '住院用药',
  //   nameEn: 'ZHUYUANYONGYAO'
  // },
  {
    name: '检验',
    nameEn: 'JIANYAN',
    activeName: 'phr_jianyan'
  },
  {
    name: '检查',
    nameEn: 'JIANCHA',
    activeName: 'phr_jiancha'
  }
]
let formatter = ({value}) => {
  if (!value) return ''
  return moment(value).format('YYYY-MM-DD')
}
let longWidth = 112
let shortWidth = 62
let tableHeaders = {
  JIUZHEN: [
    {
      prop: 'comeTime',
      label: '就诊/入院日期',
      width: longWidth,
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'finishTime',
      label: '出院日期',
      width: longWidth,
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'visitTypeName',
      label: '类型',
      width: shortWidth,
      showOverflowTooltip: true
    },
    {
      prop: 'visitDeptName',
      label: '就诊/入院科室',
      width: longWidth,
      showOverflowTooltip: true
    },
    {
      prop: 'visitOrgName',
      label: '就诊/入院机构',
      width: longWidth,
      showOverflowTooltip: true
    },
    {
      prop: 'doctorName',
      label: '医生',
      // width: 80,
      showOverflowTooltip: true
    }
  ],
  YUYUEJILU: [
    {
      prop: 'appointmentCreateTime',
      label: '创建日期',
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'appointmentDate',
      label: '预约日期',
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'appointmentType',
      label: '预约类型',
      showOverflowTooltip: true
    },
    {
      prop: 'patientMobile',
      label: '预约电话',
      showOverflowTooltip: true
    },
    {
      prop: 'orgName',
      label: '预约机构',
      showOverflowTooltip: true
    },
    {
      prop: 'appointmentChannel',
      label: '预约方式',
      showOverflowTooltip: true
    }
  ],
  GUOMINJILU: [
    {
      prop: 'recordTime',
      label: '记录日期',
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'doctorName',
      label: '记录人',
      showOverflowTooltip: true
    },
    {
      prop: 'allergenTypeName',
      label: '过敏类型',
      showOverflowTooltip: true
    },
    {
      prop: 'allergenName',
      label: '过敏源',
      showOverflowTooltip: true
    },
    {
      prop: 'comment',
      label: '备注',
      showOverflowTooltip: true
    }
  ],
  ZHENDUAN: [
    {
      prop: 'visitTime',
      label: '就诊/入院日期',
      width: longWidth,
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'deptName',
      label: '诊断科室',
      showOverflowTooltip: true
    },
    {
      prop: 'orgName',
      label: '诊断机构',
      showOverflowTooltip: true
    },
    {
      prop: 'typeName',
      label: '类型',
      showOverflowTooltip: true
    },
    {
      prop: 'diseaseName',
      label: '诊断名称',
      showOverflowTooltip: true
    },
    {
      prop: 'doctorName',
      label: '医生',
      showOverflowTooltip: true
    }
  ],
  MENZHENCHUFANG: [
    {
      prop: 'orderDatetime',
      label: '就诊日期',
      formatter,
      showOverflowTooltip: true
    },
    {
      prop: 'adviceTypeName',
      label: '类型',
      showOverflowTooltip: true
    },
    {
      slot: 'adviceContent',
      prop: 'adviceContent',
      label: '医嘱内容',
      showOverflowTooltip: true
    }
  ],
  ZHUYUANYONGYAO: [
    {
      prop: 'a',
      label: '开始时间'
    },
    {
      prop: 'b',
      label: '长/临'
    },
    {
      prop: 'c',
      label: '类型'
    },
    {
      prop: 'd',
      label: '医嘱内容'
    }
  ],
  JIANYAN: [
    {
      prop: 'serviceName',
      label: '检验项目',
      showOverflowTooltip: true
    },
    {
      prop: 'statusName',
      label: '状态',
      showOverflowTooltip: true
    },
    {
      prop: 'visitDeptName',
      label: '申请科室',
      showOverflowTooltip: true
    },
    {
      prop: 'visitOrgName',
      label: '申请机构',
      showOverflowTooltip: true
    },
    {
      prop: 'applicationTime',
      label: '申请日期',
      formatter,
      showOverflowTooltip: true
    }
  ],
  JIANCHA: [
    {
      prop: 'classifyName',
      label: '检查类别',
      showOverflowTooltip: true
    },
    {
      prop: 'doctorAdviceContent',
      label: '检查项目',
      showOverflowTooltip: true
    },
    {
      prop: 'operationPositionName',
      label: '部位',
      showOverflowTooltip: true
    },
    {
      prop: 'statusName',
      label: '状态',
      showOverflowTooltip: true
    },
    {
      prop: 'examineApplyTenantSubjectName',
      label: '申请科室',
      showOverflowTooltip: true
    },
    {
      prop: 'examineApplyOrgName',
      label: '申请机构',
      showOverflowTooltip: true
    },
    {
      prop: 'applicationDate',
      label: '申请日期',
      showOverflowTooltip: true,
      formatter
    }
  ]
}
let tableData = {
  JIUZHEN: [
    // {
    //   a: '2222',
    //   b: 2,
    //   c: 3,
    //   d: 4,
    //   e: 5,
    //   f: 6,
    //   g: 7
    // }
  ],
  YUYUEJILU: [
  ],
  GUOMINJILU: [
  ],
  ZHENDUAN: [
  ],
  MENZHENCHUFANG: [
  ],
  ZHUYUANYONGYAO: [
    {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7
    }
  ],
  JIANCHA: [
  ],
  JIANYAN: [
  ]
}

export {
    tableNames,
    tableHeaders,
    tableData
}
