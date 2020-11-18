<template>
  <el-dialog
    title="交易记录"
    :visible.sync="dialogVisible"
    width="80%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-table :data="tableData" border>
      <el-table-column prop="opTypeCn" :label="$t('操作类型')"></el-table-column>
      <el-table-column prop="pointsChangeBefore" align="right" :label="$t('变更前总额')">
        <template slot-scope="scope">{{scope.row.pointsChangeBefore | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="pointsChange" align="right" :label="$t('积分变更')">
        <template
          slot-scope="scope"
        >{{(String(scope.row.pointsChange).indexOf('-')>-1?'':'+') + scope.row.pointsChange | initIntegral}}</template>
      </el-table-column>
      <el-table-column prop="pointsChangeAfter" align="right" :label="$t('变更后总额')">
        <template slot-scope="scope">{{scope.row.pointsChangeAfter | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="exchangeQueryName" :label="$t('积分变动类型')"></el-table-column>
      <el-table-column prop :label="$t('操作人')">
        <template
          slot-scope="scope"
        >{{scope.row.operator && scope.row.operator.name ? scope.row.operator.name : '--'}}</template>
      </el-table-column>
      <el-table-column prop="opTime" :label="$t('操作时间')"></el-table-column>
      <el-table-column prop="remark" :label="$t('备注')">
        <template
          slot-scope="scope"
        >{{scope.row.remark.indexOf('时间：')>-1&&scope.row.remark.indexOf('消费金额：')>-1?'消费金额：'+scope.row.flowFee: scope.row.remark}}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import api from '../store/creditapi'

export default {
  data () {
    return {
      dialogVisible: false,
      tableData: []
    }
  },
  filters: {
    initIntegral (val) {
      let integer = val.toString().split('.')[0]
      let decimal = val.toString().split('.')[1]
      if (decimal && decimal.length > 2) {
        return integer + '.' + Number(decimal.substring(0, 3) / 10).toFixed()
      } else {
        return val
      }
    }
  },
  methods: {
    onDialogOpen (rs) {
      this.dialogVisible = true
      this.changeList(rs.patientId)
    },
    handleClose () {
      this.dialogVisible = false
    },
    afterSave () {
      this.$router.push('/card/credits')
      this.dialogVisible = false
    },
    changeList (id) {
      api.changeList(id).then(result => {
        this.tableData = result.data.resultList
      })
    }
  },
  beforeCreate () {
    this.api = api
  }
}
</script>
