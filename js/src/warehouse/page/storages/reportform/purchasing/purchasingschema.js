// 报表所有变化的schema 对象
let schemaObj = {
  CLINICIDS: {
    name: 'clinicIds',
    label: '机构名称',
    comp: 'sys-select',
    style: 'width: 270px;',
    props: {
      placeholder: '请选择机构',
      options: [],
      disabled: false,
      field: {
        multiple: true,
        collapsetags: true
      }
    }
  },
  SUPPLIER: { // 供应商
    name: 'supplierIds',
    label: '供应商',
    comp: 'sys-select',
    style: 'width: 300px;',
    props: {
      placeholder: '请选择供应商',
      options: [],
      field: {
        multiple: true,
        collapsetags: true
      }
    }
  },
  INTERESTED_PARTIES: {
    name: 'interestedParties',
    label: '相关方',
    comp: 'sys-select',
    style: 'width: 230px;',
    class: 'interested',
    props: {
      placeholder: '相关方',
      options: [],
      disabled: true,
      field: {
        multiple: true,
        useObject: true,
        collapsetags: true
      }
    }
  },
  SECTIONS: { // 科室,
    name: 'sectionIds',
    label: '科室',
    comp: 'sys-select',
    style: 'width: 270px;',
    props: {
      placeholder: '请选择科室',
      options: [],
      field: {
        multiple: true,
        collapsetags: true
      }
    }
  },
  BREAKDOWN_TYPE_OPTIONS: [{ value: '2', label: '按药房分列', children: [{ value: '3', label: '按物资分类分列', children: [{ value: '4', label: '按物资分列' }] }] }],
  BREAKDOWN_TYPE: { // 分列项
    name: 'showTypes',
    label: '分列',
    style: 'width: 270px;',
    comp: 'custom',
  },
  BUSINESS_TYPE_MULTIPLE: { // 业务类型 多选
    name: 'businessTypes',
    label: '业务类型',
    comp: 'sys-select',
    style: 'width: 230px;',
    props: {
      placeholder: '请选择业务类型',
      options: [],
      field: {
        multiple: true,
        collapsetags: true
      }
    }
  },
  DAYS_DETENTION: { // 滞留天数
    name: 'holeUpDays',
    label: '滞留天数',
    comp: 'sys-select',
    style: 'width: 160px;',
    props: {
      options: [{id: 0, name: '0天'}, {id: 1, name: '1天'}, {id: 2, name: '2天'}, {id: 3, name: '3天'}, {id: 4, name: '3天以上'}],
      field: {
        multiple: true,
        collapsetags: true
      }
    }
  },
  PRICE_CODE: {
    name: 'printCode',
    label: '序号',
    comp: 'el-input',
    style: 'width: 100px;'
  },
  BUSINESS_TYPE: { // 单选 业务类型
    name: 'businessType',
    label: '业务类型',
    comp: 'sys-select',
    style: 'width: 200px;',
    props: {
      placeholder: '请选择业务类型',
      options: []
    }
  }
}

export default schemaObj
