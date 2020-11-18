<template>
  <el-popover
    popper-class="layout_box task_box spe"
    trigger="hover"
    placement="right"
    width="300"
    :open-delay="300"
    @show="show"
  >
    <el-table :data="tableData || []" border>
      <el-table-column prop="serviceName" label="收费项目" width="138"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="70"></el-table-column>
      <el-table-column prop="sellingPrice" label="金额" width="90">
        <template
          slot-scope="scope"
        >￥{{scope.row.sellingPrice ? parseFloat(scope.row.sellingPrice).toFixed(2) : '0.00'}}</template>
      </el-table-column>
    </el-table>
    <template slot="reference">
      <i class="iconfont icon-gantanhao charge"></i>
    </template>
  </el-popover>
</template>
<script>
import adviceapi from '@/inpatient/store/adviceapi'
export default {
  data () {
    return {
      adviceapi,
      tableData: []
    }
  },
  props: ['data', 'item'],
  methods: {
    show () {
      let params = {
        orderBatchNo: this.data.orderBatchNo,
        orderId: this.data.orderId,
        adviceId: this.item.id
      }
      adviceapi.getServiceOrderItemsByBatchNo(params).then(res => {
        if (res.head.errCode === 0 && res.data && res.data.length) {
          this.tableData = res.data
        } else {
          this.tableData = []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.task_popover {
  border: 1px solid #dddddd;
}
.charge {
  color: #bbbbbb !important;
  font-size: 14px;
}
</style>
