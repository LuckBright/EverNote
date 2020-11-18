<template>
  <div>
    <el-table
      border
      v-loading="loading"
      :data="batchTableData">
      <el-table-column label="入库时间" width="180" align="center" prop="inDate"></el-table-column>
      <el-table-column label="采购入库单" width="180" align="center" prop="inStockCode"></el-table-column>
      <el-table-column label="生产批号" width="180" align="center" prop="batchNum"></el-table-column>
      <el-table-column label="系统批号" width="180" align="center" prop="sysBatchCode"></el-table-column>
      <el-table-column label="生产日期" width="180" align="center">
        <template slot-scope="{ row: { produceDate } }">
          {{produceDate | formatDateByExp('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="180" align="center">
        <template slot-scope="{ row: { validityDate } }">
          {{validityDate | formatDateByExp('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column label="采购单价" width="180" align="center" prop="purchasePrice"></el-table-column>
      <el-table-column v-for="item in rightColimns" :key="item.scene" :prop="item.scene" :label="item.sceneName">
        <template slot-scope="scope">
          <price-details-template :scene="item.scene" :row="scope.row"></price-details-template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { floatTool } from '@/util/common'
import { priceChang } from '@/warehouse/page/institutionmaterial/constructor/decimals.js'

export default {
  props: {
    tableData: {
      type: Array,
      default: () => ([ ])
    },
    Columns: {
      type: Array,
      default: () => ([ ])
    },
    loading: Boolean,
  },
  components: {
    priceDetailsTemplate: () => import('@/rcm/page/tariffs/price.details/price.details.table.vue')
  },
  methods: {
    // 加成率公式
    formula (purchasePrice, val) {
      return priceChang(floatTool.multiply(floatTool.subtract(floatTool.divide(val, purchasePrice), 1), 100))
    }
  },
  computed: {
    batchTableData () {
      return this.tableData.map(item => {
        if (item.base) {
          // 计算原来的加成率
          const { originalPrice, currentPrice } = item.base
          const { purchasePrice } = item
          item.bonusRate = {
            originalPrice: this.formula(purchasePrice, originalPrice),
            currentPrice: this.formula(purchasePrice, currentPrice)
          }
        }
        return item
      })
    },
    rightColimns () {
      const base = this.Columns.find(key => key.scene === 'base')
      return base ? [{ scene: 'bonusRate', sceneName: '加成率' }, ...this.Columns] : this.Columns
    }
  }
}
</script>
