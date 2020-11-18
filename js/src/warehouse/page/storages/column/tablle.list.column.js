import materialShowName from '@/warehouse/page/components/material.show.name.vue'
// import everSelect from '@/components/select.vue'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import Vue from 'vue'
const filters = Vue.options.filters

export default [
  {
    prop: 'name',
    label: '物资名称',
    align: 'center',
    slotName: 'name',
    isBatch: true,
    show: true,
    render (h, ctx, row, index) {
      const { materialName, icons } = row
      return h(materialShowName, {
        props: {
          materialName: materialName,
          icons: icons,
        },
        class: {
          fl: true
        }
      })
    }
  },
  {
    prop: 'spec',
    label: '规格',
    align: 'center',
    isBatch: true,
    show: true,
    width: 120
  },
  {
    prop: 'freight',
    label: '货位号',
    isBatch: true,
    width: 120,
    show: false,
    align: 'center',
    slotName: 'freight',
    render (h, ctx, row, index) {
      const { freight, freightCode } = row
      return (<span>{freight && freight.code || freightCode || '无货位号'}</span>)
    }
  },
  {
    prop: 'unitName',
    label: '单位',
    width: 80,
    show: false,
    align: 'center'
  },
  {
    prop: 'batchNum',
    label: '生产批号',
    type: ['14', '3', '22', '20', '15', '33', '40', '41'],
    status: ['10', '11', '200', '21', '13', '100'],
    align: 'center',
    isBatch: true,
    width: 200,
    show: false,
    slotName: 'batchNum',
    render (h, ctx, row, index) {
      const { batchNum } = row
      return (<span>{batchNum ? batchNum : tableDefaultCellValue}</span>)
    }
  },
  {
    prop: 'sysBatchCode',
    width: 130,
    align: 'center',
    isBatch: true,
    label: '系统批号'
  },
  {
    prop: 'inStockCode',
    label: '采购入库单',
    type: ['15'],
    width: 180,
    show: false,
    slotName: 'inStockCode',
    render (h, ctx, row, index) {
      const { inStockCode } = row
      return (<span>{inStockCode}</span>)
    }
  },
  {
    prop: 'bedNum',
    label: '预计退货数量',
    type: ['15'],
    width: 180,
    show: false,
    slotName: 'bedNum',
    render (h, ctx, row, index) {
      const { expectNum, packagUnitName } = row
      return (<div>
        <span>{expectNum}{packagUnitName}</span>
      </div>)
    }
  },
  {
    prop: 'inStockPrice',
    label: '退货单价',
    type: ['15'],
    width: 120,
    show: false,
    slotName: 'inStockPrice',
    render (h, ctx, row, index) {
      const { inStockPrice } = row
      return (<span>{inStockPrice && filters.formatToFinacial(inStockPrice, 4) || tableDefaultCellValue}</span>)
    }
  },
  {
    prop: 'returnAmount',
    label: '预计退货金额',
    type: ['15'],
    width: 140,
    show: false,
    slotName: 'returnAmount',
    render (h, ctx, row, index) {
      const { inStockPrice, expectNum } = row
      return (<span>{expectNum && inStockPrice && filters.formatToFinacial(inStockPrice * expectNum, 4) || tableDefaultCellValue}</span>)
    }
  },
  {
    prop: 'batchNumEdit',
    label: '生产批号',
    status: ['20', '24'],
    width: 200,
    align: 'center',
    slotName: 'batchNumEdit',
    slot: true
  },
  {
    prop: 'produceDate',
    label: '生产日期',
    isBatch: true,
    width: 100,
    type: ['14', '3', '22', '31', '2', '20', '33', '40', '41'],
    show: false,
    status: ['20', '21', '10', '11', '200', '24', '13', '100'],
    slotName: 'produceDate',
    render (h, ctx, row, index) {
      const { produceDate } = row
      return (<span>{produceDate ? filters.formatDateByExp(produceDate, 'YYYY-MM-DD') : tableDefaultCellValue}</span>)
    }
  },
  {
    prop: 'validityDate',
    label: '有效期',
    width: 100,
    isBatch: true,
    type: ['14', '3', '22', '31', '2', '20', '33', '40', '41'],
    status: ['20', '21', '10', '11', '200', '24', '13', '100'],
    show: false,
    slotName: 'validityDate',
    render (h, ctx, row, index) {
      const { validityDate } = row
      return (<span>{validityDate ? filters.formatDateByExp(validityDate, 'YYYY-MM-DD') : tableDefaultCellValue}</span>)
    }
  },
  {
    prop: 'purchasePrice',
    width: 90,
    align: 'center',
    isBatch: true,
    label: '采购单价'
  },
  {
    prop: 'salePrice',
    width: 90,
    isBatch: true,
    align: 'center',
    label: '销售价'
  },
  {
    prop: 'expectNum',
    label: '预计数量',
    width: 150,
    isBatch: true,
    align: 'center',
    show: true,
    slotName: 'expectNum',
    render (h, ctx, row, index) {
      const { expectNum, packagUnitName } = row
      return (<div>
        <span>{expectNum}{packagUnitName}</span>
      </div>)
    }
  },
  {
    prop: 'num',
    label: '出库数量',
    width: 150,
    status: ['20', '21', '200', '24'],
    align: 'center',
    outBatchEdit: true,
    slotName: 'num',
    slot: true
  },
  {
    prop: 'inNum',
    label: '入库数量',
    align: 'center',
    intBatchEdit: true,
    slotName: 'inNum',
    status: ['11', '10', '100', '13'],
    width: 150,
    slot: true
  },
  {
    prop: 'inDiversityNum',
    label: '退返数量',
    align: 'center',
    slotName: 'inDiversityNum',
    type: ['32', '11', '12'],
    width: 100,
    render (h, ctx, row, index) {
      const { inDiversityNum, packagUnitName } = row
      return (inDiversityNum ? <div>
        <span>{inDiversityNum}{packagUnitName}</span>
      </div> : <span>{tableDefaultCellValue}</span>)
    },
  },
  {
    prop: 'diversityNum',
    label: '差异数量',
    align: 'center',
    slotName: 'diversityNum',
    width: 100,
    type: ['31', '2', '14', '20'],
    status: ['20', '21', '200', '24'],
    render (h, ctx, row, index) {
      const { diversityNum, packagUnitName } = row
      return (diversityNum ? <div>
        <span>{diversityNum}{packagUnitName}</span>
      </div> : <span>{tableDefaultCellValue}</span>)
    },
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    width: 80,
    type: ['31', '13', '2'],
    slotName: 'operation',
    slot: true
  }
]
