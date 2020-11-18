<template>
  <div>
    <div class="more_container">
      <el-table
        :data="tableData"
        class="operation_table"
        style="width: 100%"
        :show-header = "false"
        border>
        <el-table-column show-overflow-tooltip
          label="操作人姓名"
          width="200"
          prop="operateName">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          label="操作时间"
          width="200"
          prop="operateTime">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          label="操作类型"
          width="200"
          prop="operateType">
        </el-table-column>
        <el-table-column show-overflow-tooltip
          label="操作内容"
          prop="operateNote">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  props: ['data'],
  methods: {
  },
  created () {
  },
  watch: {
    data: {
      handler: function (val, oldval) {
        if (val) {
          this.tableData = val.operationLogs
        }
      },
      immediate: true
    }
  }
}
</script>
<style lang="less" scoped>
  .more_container {
    padding-top: 20px;
  }
  .operation_table /deep/ td {
    border-bottom: 1px solid #e4e7ed !important;
    padding: 5px 0;
  }
</style>
