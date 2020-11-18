<template>
  <div>
    <el-table
    :data="tableData"
    border
    class="el-td-border"
    highlight-current-row>
    <el-table-column
      show-overflow-tooltip
      label="套餐名称"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.setMealName || '--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="下单机构"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.saleOrgName || '--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="下单人员"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.saleManName || '--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="金额"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.totalPriceDis || scope.row.totalPriceDis === 0 ? scope.row.totalPriceDis:'--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="支付状态"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.payStatusChs || '--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="使用状态"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.useStatus === 1 ? '未使用' : '已使用'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="退款状态"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.refundStatusChs || '--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="已用金额"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.usedPriceDis || scope.row.usedPriceDis === 0 ? scope.row.usedPriceDis:'--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="剩余金额"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.leftPriceDis || '--'}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="下单时间"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.createTime| formatDateByExp('YYYY-MM-DD')}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="支付时间"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.chargeTime| formatDateByExp('YYYY-MM-DD')}}
      </template>
    </el-table-column>
    <el-table-column
      show-overflow-tooltip
      label="使用期限"
      align="center"
      max-width="100">
      <template slot-scope="scope">
        {{scope.row.limitUseDate| formatDateByExp('YYYY-MM-DD')}}
      </template>
    </el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current">
    </ever-pagination>
  </div>
</template>
<script>
  import list from '@/util/list'
  import api from '@/crm/store/combolistapi'
  export default {
    mixins: [list],
    data () {
      return {
        api,
        queryObj: {
          patientId: this.$route.params.patientId
        }
      }
    }
  }
</script>
