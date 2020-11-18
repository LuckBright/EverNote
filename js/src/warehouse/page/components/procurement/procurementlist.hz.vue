<template>
  <el-table
    border
    v-loading.body="loading"
    :key="auditFlag"
    @selection-change="handleSelectionChange"
    :data="tableData">
    <el-table-column
      v-if="auditFlag == '2'"
      type="selection"
      :selectable="selectable"
      width="45">
    </el-table-column>
    <el-table-column width="50" align="center">
      <template slot-scope="scope">
        {{scope.$index + 1}}
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      label="采购申请单号"
      width="200">
      <template slot-scope="scope">
        <a @click="handlerRoute(scope.row)">{{scope.row.code}}</a>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="clinicName"
      label="机构名称">
    </el-table-column>
    <el-table-column
      align="center"
      prop="storageRoomName"
      label="收货库房">
    </el-table-column>
    <el-table-column
      align="center"
      prop="applicantName"
      label="申请人">
    </el-table-column>
    <el-table-column
      align="center"
      prop="applyTime"
      width="170"
      label="申请时间">
    </el-table-column>
    <el-table-column
      v-if="auditFlag == '2'"
      align="center"
      label="汇总单号"
      width="200">
      <template slot-scope="scope">
        <a @click="handlerSummaryRoute(scope.row)">{{scope.row.summaryCode}}</a>
      </template>
    </el-table-column>
    <el-table-column
      v-if="auditFlag == '2'"
      align="center"
      prop="summaryer"
      label="汇总人">
    </el-table-column>
    <el-table-column
      v-if="auditFlag == '2'"
      align="center"
      width="170"
      prop="summaryTime"
      label="汇总时间">
    </el-table-column>
    <el-table-column
      v-if="auditFlag == '2'"
      align="center"
      prop="summaryStatus"
      label="汇总状态">
      <template slot-scope="scope">
        <span v-if="scope.row.summaryStatus">{{FULL_STATE.summaryStatus[scope.row.summaryStatus].name}}</span>
        <span v-else>未汇总</span>
      </template>
    </el-table-column>
    <el-table-column
      align="center"
      prop="status"
      label="申请单状态">
      <template slot-scope="scope">
        <span>{{FULL_STATE.procurement[scope.row.status]}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { FULL_STATE } from '@/util/warehouseconfig'
export default {
  props: ['tableData', 'loading', 'path', 'auditFlag'],
  data () {
    return {
      FULL_STATE
    }
  },
  methods: {
    handlerRoute (row) {
      this.$router.push(`${this.path}${row.id}?operation=1`)
    },
    handlerSummaryRoute (row) {
      this.$router.push(`/goods/summarydetail/${row.summaryId}?status=${row.summaryStatus}`)
    },
    handleSelectionChange (val) {
      this.$emit('handleSelectionChange', val)
    },
    selectable (row, index) {
      return !row.summaryCode && row.status !== 814
    }
  },
}
</script>

<style lang="less" scoped>
</style>
