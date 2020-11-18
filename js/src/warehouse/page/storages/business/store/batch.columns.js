import Vue from 'vue'
// 批次定价通用批次表格 columns
export const batchColumns = [
  {
    prop: 'inDate',
    align: 'center',
    minWidth: 120,
    label: '采购入库日期',
    formatter: ({ value }) => {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '-'
      }
    }
  },
  {
    prop: 'batchNum',
    width: 110,
    align: 'center',
    label: '生产批号'
  },
  {
    prop: 'sysBatchCode',
    width: 170,
    align: 'center',
    label: '系统批号'
  },
  {
    prop: 'produceDate',
    width: 110,
    align: 'center',
    label: '生产日期',
    formatter: ({ value }) => {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '-'
      }
    }
  },
  {
    prop: 'validityDate',
    width: 110,
    align: 'center',
    label: '有效期',
    formatter: ({ value }) => {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '-'
      }
    }
  },
  {
    prop: 'price',
    width: 90,
    align: 'center',
    label: '采购单价'
  },
  {
    prop: 'salePrice',
    width: 90,
    align: 'center',
    label: '销售价'
  },
  {
    prop: 'usableNum',
    width: 110,
    align: 'center',
    label: '批次可用库存'
  },
  {
    prop: 'batchUserNum',
    spilt: true,
    width: 110,
    align: 'center',
    label: '当前库存',
    slot: 'batchUserNum'
  },
  {
    prop: 'num',
    label: '拆零数量',
    align: 'center',
    spilt: true,
    width: 140,
    slot: 'num'
  },
  {
    prop: 'handle',
    width: 80,
    align: 'center',
    label: '操作',
    slot: 'handle'
  }
]

// 领用schema
export const receiveSchema = [
  {
    name: 'sectionId',
    label: '领用科室',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: false
    },
    span: 8
  },
  {
    name: 'storageRoomId',
    label: '发货库房',
    comp: 'ever-select',
    props: {
      options: [],
      clearable: false
    },
    span: 8
  },
  {
    name: 'description',
    label: '备注',
    props: {
      maxlength: 2000
    },
    span: 8
  }
]

// 申领schema
export const applySchema = [
  {
    name: 'toStorageRoomId',
    label: '发货库房',
    comp: 'sys-select',
    props: {
      options: []
    },
    span: 8
  },
  {
    name: 'description',
    label: '备注',
    props: {
      maxlength: 50
    },
    span: 8
  }
]

// 调拨schema
export const allocationSchema = [
  {
    name: 'storageRoomId',
    label: '收货库房',
    comp: 'sys-select',
    props: {
      options: []
    },
    span: 8
  },
  {
    name: 'reasons',
    label: '备注',
    span: 8,
    props: {
      maxlength: 200
    }
  }
]

// 退库schema
export const retiringSchema = [
  {
    name: 'toStorageRoomId',
    label: '收货库房',
    comp: 'sys-select',
    props: {
      options: []
    },
    span: 8
  },
  {
    name: 'description',
    label: '退库原因',
    props: {
      maxlength: 50
    },
    span: 8
  }
]
