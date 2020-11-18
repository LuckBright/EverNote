<template>
  <el-dialog title="交易记录" :visible.sync="isShow" class="ui_dialog_02" :close-on-click-modal="false">
    <div class="main-option">
      <doc-download @downFile="downFile" ref="childMethod"></doc-download>
    </div>
    <el-table :data="tableData" border>
      <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
      <el-table-column width="200" prop="createTime" label="时间" align="center"></el-table-column>
      <el-table-column
        width="120"
        prop="changeType"
        label="交易类型"
        align="center"
        :formatter="formatTransaction"
      ></el-table-column>
      <el-table-column width="200" prop="chargeStatement" label="支付流水" align="center"></el-table-column>
      <!--  <el-table-column
        width="100"
        prop="chargeMethod"
        label="支付方式"
        align="center"
        :formatter="formatPay">
      </el-table-column>-->
      <el-table-column width="120" label="消费人" prop="usePatientName" align="center"></el-table-column>
      <el-table-column width="100" prop="changeStoredMoney" label="交易金额" align="right">
        <template
          slot-scope="scope"
        >{{(scope.row.changeStoredMoney + scope.row.changeGivedMoney) | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column width="120" label="账户余额" align="right">
        <template
          slot-scope="scope"
        >{{(scope.row.newStoredMoney + scope.row.newGivedMoney) | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="newStoredMoney" label="现金余额" align="right" width="140">
        <template
          slot-scope="scope"
        >{{Number(scope.row.newStoredMoney) > 0 ? Number(scope.row.newStoredMoney) : '0.00' | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="newGivedMoney" label="赠送余额" align="right" width="140">
        <template
          slot-scope="scope"
        >{{Number(scope.row.newGivedMoney) > 0 ? Number(scope.row.newGivedMoney) : '0.00' | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column label="操作人" prop="operatorName" align="center"></el-table-column>
    </el-table>
    <ever-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :totalCount="totalCount"
      :current="current"
    ></ever-pagination>
  </el-dialog>
</template>
<script>
import api from '../store/recordsapi'
import utillist from '../../util/list'

export default {
  mixins: [utillist],
  data () {
    return {
      tableData: [],
      queryObj: { cardId: this.id ? this.id : 0 },
      isShow: false
    }
  },
  methods: {
    downFile (data) {
      let params = {
        'cardId': this.queryObj.cardId
      }
      api.exportFile(params).then(result => {
        let filename = `${this.$ever.filePath}${result.data.fileId}`
        this.$refs.childMethod.downfile(filename)
      })
    }
  },
  beforeCreate () {
    this.api = api
  },
  watch: {
    'queryObj.cardId': function () {
      this.list(true)
    }
  }
}
</script>
