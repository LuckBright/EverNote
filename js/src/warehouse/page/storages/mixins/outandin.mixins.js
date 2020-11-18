import tableListColumn from '@/warehouse/page/storages/column/tablle.list.column.js'
import inAndOutFunctional from '@/warehouse/page/storages/column/inandout.functional.js'
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import { hanlderItems, arraySpanMethod } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

let staffSchema = [
  {
    name: 'applicantName',
    label: '申请人',
    comp: 'readonlyitem',
    span: 6
  },
  {
    name: 'relatedPartyName',
    label: '发货库房',
    comp: 'readonlyitem',
    span: 6
  },
]

export default {
  data () {
    return {
      tableListColumn,
      tableColumns: [],
      staffSchema,
      tableDefaultCellValue,
      commoditylocation: this.$hasPermission('Auth_menu_treasury_businessmanagement_commoditylocation'),
    }
  },
  components: {
    inAndOutFunctional
  },
  computed: {
    // 计算需要合并单元格的物资，记录物资 下标和length old
    hanlderItems () {
      let tableData = this.obj.outStockItemList ? this.obj.outStockItemList : this.obj.inStockItemList[0].item
      return hanlderItems(tableData)
    },
    renderColumns () {
      return this.tableListColumn.filter(item => (item.render || item.slot))
    }
  },
  methods: {
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      let tableData = this.obj.outStockItemList ? this.obj.outStockItemList : this.obj.inStockItemList[0].item
      return arraySpanMethod({ row, column, rowIndex, columnIndex }, tableData, this.columnIndes)
    },
  }
}
