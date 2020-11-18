<template>
  <div>
    <ever-bread-crumb name="内部交易结算单详情"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="flex_col_1_hidden main-wrap">
        <el-table ref="table" :data="tableData" v-loading="loading">
          <el-table-column label="发起机构" prop="startOrgName"></el-table-column>
          <el-table-column label="执行机构" prop="clinicName"></el-table-column>
          <el-table-column label="交易类型" prop="tradeType">
            <template slot-scope="scope">{{scope.row.tradeType | convertTradeType}}</template>
          </el-table-column>
          <el-table-column label="单据号" prop="tradeNo" min-width="110"></el-table-column>
          <el-table-column label="结算项目名称" prop="itemName"></el-table-column>
          <el-table-column label="规格" prop="spec"></el-table-column>
          <el-table-column label="数量" prop="quantity" width="50"></el-table-column>
          <el-table-column label="单价" prop="price" align="right">
            <template slot-scope="scope">{{scope.row.price | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="金额" prop="amount" align="right">
            <template slot-scope="scope">{{scope.row.amount | formatToFinacial}}</template>
          </el-table-column>
          <el-table-column label="业务日期" prop="tradeTime" width="160" :formatter="convertTradetime"></el-table-column>
          <el-table-column label="审批状态" prop="status">
            <template slot-scope="scope">{{scope.row.status | convertSettleStatus}}</template>
          </el-table-column>
          <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getSettlementById } from '@/rcm/store/insidetradesettlement/insidetradesettlement.js'
import { tradeTypeOptions, settleStatus } from '@/rcm/page/insidetrademanagement/config.js'
export default {
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  created () {
    this.getList()
  },
  filters: {
    convertTradeType (key) {
      return tradeTypeOptions[key] || '未取到交易类型'
    },
    convertSettleStatus (key) {
      return settleStatus[key] || '未取到状态'
    }
  },
  methods: {
    getList () {
      this.loading = true
      let params = {
        id: this.$route.params.id
      }
      getSettlementById(params).then(res => {
        this.loading = false
        let settleInfo = res.data
        let tableData = res.data.details.internalSettlementDtl.map(item => {
          item.startOrgName = settleInfo.startOrgName
          item.clinicName = settleInfo.clinicName // 执行机构
          item.tradeType = settleInfo.tradeType
          item.status = settleInfo.status
          return item
        })
        this.tableData = tableData
      }, err => {
        this.loading = false
        console.log(err)
      })
    },
    convertTradetime (row) {
      if (row.tradeTime) {
        return this.$moment(row.tradeTime).format('YYYY-MM-DD hh:mm:ss')
      } else {
        return ''
      }
    }
  }
}
</script>
