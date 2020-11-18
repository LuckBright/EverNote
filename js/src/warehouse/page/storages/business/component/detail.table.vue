<template>
  <el-table
    border
    :span-method="arraySpanMethod"
    :data="itemsData">
    <el-table-column label="物资名称" align="center" min-width="400">
      <template slot-scope="{ row: { materialName } }">
        <span class="fl">{{materialName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="规格" align="center">
      <template slot-scope="{ row: { spec } }">
        {{spec || '-'}}
      </template>
    </el-table-column>
    <!-- 批次定价专用列 -->
    <template v-if="isBatch || showBatchInfo">
      <el-table-column label="生产批号" align="center">
        <template slot-scope="{ row: { batchNum } }">
          {{batchNum || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="系统批号" align="center" width="130" v-if="isBatch">
        <template slot-scope="{ row: { sysBatchCode } }">
          {{sysBatchCode || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="生产日期" align="center">
        <template slot-scope="{ row: { produceDate } }">
          <span v-if="produceDate">
            {{produceDate | formatDateByExp('YYYY-MM-DD')}}
          </span>
          <span v-else>{{tableDefaultCellValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center">
        <template slot-scope="{ row: { validityDate } }">
          <span v-if="validityDate">
            {{validityDate | formatDateByExp('YYYY-MM-DD')}}
          </span>
          <span v-else>{{tableDefaultCellValue}}</span>
        </template>
      </el-table-column>
      <el-table-column label="采购单价" align="center" v-if="isBatch">
        <template slot-scope="{ row: { price } }">
          {{price || tableDefaultCellValue}}
        </template>
      </el-table-column>
      <el-table-column label="销售价" align="center" v-if="isBatch">
        <template slot-scope="{ row: { salePrice } }">
          {{salePrice || tableDefaultCellValue}}
        </template>
      </el-table-column>
    </template>
    <el-table-column label="申请数量" align="center">
      <template slot-scope="{ row: { num, packagUnitName } }">
        {{num}}{{packagUnitName}}
      </template>
    </el-table-column>
    <el-table-column label="出库数量" align="center">
      <template slot-scope="{ row: { outNum, packagUnitName } }">
        <span v-if="outNum">{{outNum}}{{packagUnitName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="入库数量" align="center">
      <template slot-scope="{ row: { inNum, packagUnitName } }">
        <span v-if="inNum">{{inNum}}{{packagUnitName}}</span>
      </template>
    </el-table-column>
    <el-table-column label="退返入库数量" align="center">
      <template slot-scope="{ row: { returnNum, packagUnitName } }">
        <span v-if="returnNum">{{returnNum}}{{packagUnitName}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { tableDefaultCellValue } from '@/warehouse/views/util/constant.js'
import { hanlderItems, arraySpanMethod } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'
export default {
  data () {
    return {
      tableDefaultCellValue
    }
  },
  props: {
    tableData: {
      type: Array,
      default: () => ([ ])
    },
    isBatch: {
      type: Boolean,
      default: false
    },
    showBatchInfo: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    itemsData () {
      return hanlderItems(this.tableData)
    }
  },
  methods: {
    // 合并表格
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      return arraySpanMethod({ row, column, rowIndex, columnIndex }, this.tableData, [0, 1])
    }
  }
}

</script>
