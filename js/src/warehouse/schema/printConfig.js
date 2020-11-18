import Vue from 'vue'
// import basemoment from 'moment'
import moment from 'vue-moment'
Vue.use(moment)

/* eslint-disable no-new */
const vm = new Vue({})

let printFormat = {
  // 美尔目 - 出库单
  format1: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 1.5 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '生产批号', data: 'batchNum' },
      { name: '有效期', data: 'validityDate', type: 'date', format: '' },
      { name: '出库数量', data: 'num' }
      // {name: '采购金额', data: 'totalPirce', class: 'lh', flex: 2, list: [{name: '单价', data: 'price'}, {name: '合计', data: 'count'}]},
      // {name: '', data: '', flex: 0.2}
    ],
    printFooter: [
      { name: '核发人', data: 'totalMoney' },
      { name: '领用人', data: 'doctor' },
      { name: '打印时间', data: 'createDate', flex: 1.5 }
    ],
    pHeader: [
      { name: '接收方', data: '', width: '50%' },
      // {name: '领用人', data: '', width: '35%'},
      { name: '出库时间', data: '', width: '50%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss'),
      totalMoney: ''
    }
  },
  // 光熙模版 - 出库单
  format2: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '申请数量', data: 'expectNum' },
      { name: '核发数量', data: 'num' }
      // {name: '', data: '', flex: 0.2}
    ],
    printFooter: [
      { name: '调配人', data: 'doctor', flex: 1 },
      { name: '核发人', data: 'totalMoney', flex: 1 },
      { name: '打印时间', data: 'createDate', flex: 1.5 }
    ],
    pHeader: [
      { name: '接收方', data: '', width: '35%' },
      { name: '接收人', data: '', width: '35%' },
      { name: '出库时间', data: '', width: '30%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss'),
      totalMoney: ''
    }
  },
  // 领用单 --  不区分机构
  format3: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '产品名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '数量', data: 'num', flex: 0.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '备注', data: '' }
    ],
    printFooter: [
      // {name: '调配人', data: 'doctor'},
      // {name: '核发人', data: 'totalMoney'},
      { name: '打印时间', data: 'createDate' }
    ],
    pHeader: [
      { name: '领用科室', data: '', width: '50%' },
      // {name: '领用人', data: '', width: '35%'},
      { name: '领用时间', data: '', width: '50%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss'),
      totalMoney: ''
    }
  },
  // 采购单 -- 美尔目（美尔目需求）
  format_3_1: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '产品名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '数量', data: 'num', flex: 0.5 },
      { name: '价格', data: 'price' },
      { name: '金额', data: 'totalPrice' }
    ],
    printFooter: [
      { name: '打印时间', data: 'createDate' }
    ],
    printFooterSign: [
      { name: '采购人', data: '', width: '35%' }
    ],
    pHeader: [
      { name: '收货库房', data: '', width: '35%' },
      { name: '供应商', data: '', width: '35%' },
      { name: '采购时间', data: '', width: '30%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  // 退返单 -- 美尔目（美尔目需求）
  format_3_7: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '数量', data: 'num', flex: 0.5 },
      { name: '批号', data: 'batchNum' },
      { name: '备注', data: '' }
    ],
    printFooter: [
      { name: '打印时间', data: 'createDate' }
    ],
    printFooterSign: [
      { name: '申请人', data: '', width: '35%' }
    ],
    pHeader: [
      { name: '发货库房', data: '', width: '35%' },
      { name: '退返供应商', data: '', width: '35%' },
      { name: '申请时间', data: '', width: '30%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  // 退库单 -- 美尔目（美尔目需求）
  format_3_6: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '数量', data: 'num', flex: 0.5 },
      { name: '批号', data: 'batchNum' },
      { name: '备注', data: '' }
    ],
    printFooter: [
      { name: '打印时间', data: 'createDate' }
    ],
    printFooterSign: [
      { name: '申请人', data: '', width: '35%' }
    ],
    pHeader: [
      { name: '收货库房', data: '', width: '35%' },
      { name: '发货库房', data: '', width: '35%' },
      { name: '申请时间', data: '', width: '30%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  // 申领单 -- 美尔目（美尔目需求）
  format_3_4: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '数量', data: 'num', flex: 0.5 },
      { name: '批号', data: 'batchNum' },
      { name: '备注', data: '' }
    ],
    printFooter: [
      { name: '打印时间', data: 'createDate' }
    ],
    printFooterSign: [
      { name: '申请人', data: '', width: '35%' }
    ],
    pHeader: [
      { name: '申领库房', data: '', width: '35%' },
      { name: '发货库房', data: '', width: '35%' },
      { name: '申请时间', data: '', width: '30%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  // 入库单 -- 美尔目（美尔目需求）
  format_3_10: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '采购价', data: 'price', flex: 0.75 },
      { name: '采购金额', data: 'totalPrice', flex: 1.25 },
      { name: '生产批号', data: 'batchNum' },
      { name: '有效期', data: 'validityDate', type: 'date' },
      { name: '入库数量', data: 'num' }
    ],
    printFooter: [
      { name: '打印时间', data: 'createDate' }
    ],
    printFooterSign: [
      { name: '入库人', data: '', width: '35%' }
    ],
    pHeader: [
      { name: '入库库房', data: '', width: '50%' },
      { name: '入库时间', data: '', width: '50%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  },
  // 销毁报废单 -- 美尔目（美尔目需求）
  format_3_100: {
    recordData: {
      head: { patientId: 'LY2018909122321', origName: '' }
    },
    printData: [],
    tableHead: [
      { name: '名称', data: 'name', flex: 3 },
      { name: '规格', data: 'spec', flex: 1.5 },
      { name: '数量', data: 'num' },
      { name: '单位', data: 'unitId', flex: 0.5 },
      { name: '备注', data: '' }
    ],
    printFooter: [
      { name: '打印时间', data: 'createDate' }
    ],
    printFooterSign: [
      { name: '申请人', data: '', width: '35%' }
    ],
    pHeader: [
      { name: '出库库房', data: '', width: '50%' },
      // {name: '', data: '', width: '35%'},
      { name: '申请时间', data: '', width: '50%' }
    ],
    printFooterData: {
      doctor: '',
      createDate: vm.$moment().format('YYYY-MM-DD HH:mm:ss')
    }
  }
}

export default printFormat
