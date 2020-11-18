/*
  销毁报废  schema配置   ever-table配置
*/
import Vue from 'vue'
// 创建销毁报废单 schema
export const schema = [
  {
    name: 'destroyReason',
    label: '销毁报废原因',
    span: 8
  }
]
// 查看销毁报废单
export const readSchema = [
  {
    name: 'code',
    label: '销毁报废单号',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'statusName',
    label: '业务状态',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'applicant',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'createTime',
    label: '申请时间',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'destroyReason',
    label: '销毁报废原因',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'storageRoomName',
    label: '出库库房',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'outStockCode',
    label: '出库任务单',
    comp: 'custom',
    span: 6
  },
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
      if (value !== '' && value !== undefined) {
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
    prop: 'produceDate',
    label: '生产日期',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '--'
      }
    },
    width: 150
  },
  {
    prop: 'validityDate',
    label: '有效期',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '--'
      }
    },
    width: 150
  },
  {
    prop: 'stockContainerUsableNum',
    label: '批次可用库存',
    formatter ({ value, row }) {
      if (value !== '' && value !== undefined) {
        return value + ' ' + row.packagUnitName
      } else {
        return ''
      }
    },
    width: 120
  },
  {
    slot: 'num',
    label: '销毁报废数量',
    width: 150
  },
  {
    slot: 'operate',
    label: '操作',
    align: 'center',
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
    width: 200
  },
  {
    prop: 'produceDate',
    label: '生产日期',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '--'
      }
    },
    width: 150
  },
  {
    prop: 'validityDate',
    label: '有效期',
    formatter ({ value, row }) {
      if (value) {
        return Vue.prototype.$filters.formatDateByExp(value, 'YYYY-MM-DD')
      } else {
        return '--'
      }
    },
    width: 150
  },
  {
    prop: 'num',
    label: '申请数量',
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
    label: '实际出库数量',
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
