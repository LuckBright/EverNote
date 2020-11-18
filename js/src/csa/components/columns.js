let RECEIPT_PATIENT = {
  title: '患者接收',
  schema: [
    {
      name: 'handoverTime',
      label: '接收时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverFromNurseId',
      label: '交接人：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverToNurseId',
      label: '手术室护士：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    }
  ],
  api: ''
}
let ENTER_SURGERY_ROOM = {
  title: '入手术间',
  schema: [
    {
      name: 'handoverTime',
      label: '转入时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverToRoomId',
      label: '手术间号：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverToNurseId',
      label: '手术室护士：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    }
  ],
  api: ''
}
let LEAVE_SURGERY_ROOM = {
  title: '出手术间',
  schema: [
    {
      name: 'handoverTime',
      label: '转出时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverTo',
      label: '转出去向：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [ {
          id: '1',
          name: '复苏室'
        }, {
          id: '3',
          name: '病房'
        }, {
          id: '4',
          name: 'SICU'
        }, {
          id: '5',
          name: '离院'
        }, {
          id: '6',
          name: '其他'
        }],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverToRoomId',
      label: '复苏室：',
      comp: 'ever-select',
      parentClass: 'surgery_room',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverFromNurseId',
      label: '手术室护士：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    }
  ],
  api: ''
}
let ENTER_RESUSCITATION_ROOM = {
  title: '入复苏室',
  schema: [
    {
      name: 'handoverTime',
      label: '接收时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverToNurseId',
      label: '复苏室护士：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    }
  ],
  api: ''
}
let LEAVE_RESUSCITATION_ROOM = {
  title: '出复苏室',
  schema: [
    {
      name: 'handoverTime',
      label: '转出时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverTo',
      label: '转出去向：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [{
          id: '3',
          name: '病房'
        }, {
          id: '4',
          name: 'SICU'
        }, {
          id: '5',
          name: '离院'
        }, {
          id: '6',
          name: '其他'
        }, {
          id: '2',
          name: '手术室'
        }],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverToRoomId',
      label: '手术房间：',
      comp: 'ever-select',
      parentClass: 'surgery_room',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverFromNurseId',
      label: '复苏室护士：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
  ],
  api: ''
}
let REJECT = {
  title: '拒绝手术',
  schema: [
    {
      name: 'handoverTime',
      label: '拒绝时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverFromNurseId',
      label: '拒绝人：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'cancelRemarks',
      label: '拒绝原因：',
      comp: 'el-input',
      props: {
        type: 'textarea',
        maxlength: 100,
        placeholder: '请输入原因',
      }
    },
  ],
  api: ''
}
let CANCEL_SURGERY = {
  title: '术后撤销',
  schema: [
    {
      name: 'handoverTime',
      label: '撤销时间：',
      comp: 'elDatePicker',
      props: {
        type: 'datetime',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        placeholder: '请选择日期',
      }
    },
    {
      name: 'handoverTo',
      label: '返回去向：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [ {
          id: '1',
          name: '复苏室'
        }, {
          id: '2',
          name: '手术室'
        }],
        filterable: true,
        clearable: true
      }
    },
    {
      name: 'handoverToRoomId',
      label: '房间：',
      comp: 'ever-select',
      props: {
        placeholder: '请选择',
        options: [],
        filterable: true,
        clearable: true
      }
    },
  ],
  api: ''
}
export {
  RECEIPT_PATIENT, ENTER_SURGERY_ROOM, LEAVE_SURGERY_ROOM, ENTER_RESUSCITATION_ROOM, LEAVE_RESUSCITATION_ROOM, REJECT, CANCEL_SURGERY
}
