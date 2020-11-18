import Vue from 'vue'
// 创建采购退货单schema old
export const schema = [
  {
    name: 'supplierLocalId',
    label: '供应商',
    comp: 'custom',
    span: 6
  },
  {
    name: 'description',
    label: '退货原因',
    props: {},
    span: 6
  }
]
// 查看采购退货单
export const readSchema = [
  {
    name: 'code',
    label: '采购退货单号:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'statusName',
    label: '业务状态:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applicantName',
    label: '申请人:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createTime',
    label: '申请时间:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'supplierName',
    label: '供应商:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'description',
    label: '退货原因:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'storageRoomName',
    label: '发货库房:',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outStockCode',
    label: '出库任务单:',
    comp: 'custom',
    span: 6
  }
]
// 新建采购入库单搜索物资默认数据
export const defaultItem = {
  materialName: '',
  localMaterialId: '',
  num: '',
  batchNumList: [],
  usableNum: '',
  isInvented: '',
  unitName: '',
  isExpiryDate: '',
  classifyId: '',
  inStockCode: '',
  spec: '',
  unitId: '',
  isManageAlone: '',
}
// 新建采购退货单tableData列
export const columns = [
  {
    slot: 'materialName',
    label: '物资名称',
  },
  {
    prop: 'spec',
    label: '规格',
    width: 80
  },
  {
    prop: 'stockUsableNum',
    label: '总可用库存',
    formatter ({ value, row }) {
      if (value) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 100
  },
  {
    slot: 'batchNum',
    label: '生产批号',
    width: 200
  },
  {
    slot: 'inStockCode',
    label: '采购入库单',
    width: 240
  },
  {
    prop: 'inStockNum',
    label: '入库数量',
    formatter ({ value, row }) {
      if (value) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 80
  },
  {
    prop: 'price',
    label: '入库单价',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatToFinacial(value, 4)
      } else {
        return '--'
      }
    },
    width: 120
  },
  {
    prop: 'stockSysBatchUsableNum',
    label: '批次可用库存',
    formatter ({ value, row }) {
      if (value) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 120
  },
  {
    slot: 'num',
    label: '退货数量',
    width: 150
  },
  {
    prop: 'totalPrice',
    label: '退货金额',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatToFinacial(value, 4)
      } else {
        return '--'
      }
    },
    width: 120
  },
  {
    slot: 'operate',
    label: '操作',
    width: 60
  },
]
// 采购退货单查看详情
export const columnsBackSee = [
  {
    slot: 'materialName',
    label: '物资名称',
  },
  {
    prop: 'spec',
    label: '规格',
    width: 80
  },
  {
    prop: 'batchNum',
    label: '生产批号',
    width: 150
  },
  {
    prop: 'inStockCode',
    label: '采购入库单',
    width: 200
  },
  {
    prop: 'num',
    label: '预计退货数量',
    formatter ({ value, row }) {
      if (value) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 120
  },
  {
    prop: 'outNum',
    label: '实际退货数量',
    formatter ({ value, row }) {
      if (value) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 120
  },
  {
    prop: 'price',
    label: '退货单价',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatToFinacial(value, 4)
      } else {
        return '--'
      }
    },
    width: 100
  },
  {
    prop: 'outTotalPrice',
    label: '实际退货金额',
    formatter ({ value, row }) {
      if (row.outNum && row.price) {
        return Vue.prototype.$filters.formatToFinacial(row.outNum * row.price, 4)
      } else {
        return '--'
      }
    },
    width: 120
  },
  {
    prop: 'diffNum',
    label: '差异数量',
    formatter ({ value, row }) {
      if (value) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 120
  },
]
