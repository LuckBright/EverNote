<template>
  <div>
    <ever-bread-crumb name="差异详情" showTitle="差异详情" path="/rcm/account/check"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body spe">
        <el-tabs active-name="first" class="ever_tabs_top">
          <el-tab-pane label="系统" name="first" class="main-wrap">
            <el-table
              :data="tableData"
              style="width:100%"
              >
              <el-table-column
                prop="payDateTime"
                label="支付日期"
                align="center">
              </el-table-column>
              <el-table-column
                prop="flowNumber"
                label="交易流水号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="patientName"
                label="姓名"
                align="center">
              </el-table-column>
              <el-table-column
                prop="outTradeNo"
                label="结算单"
                align="center">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="支付金额"
                align="center">
              </el-table-column>
              <el-table-column
                prop="createName"
                label="操作人"
                align="center">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="通道" name="second" class="main-wrap">
            <el-table
              :data="tableData"
              style="width:100%"
              >
              <el-table-column
                prop="tradeTime"
                label="支付日期"
                align="center">
              </el-table-column>
              <el-table-column
                prop="channelOrderNo"
                label="交易流水号"
                align="center">
              </el-table-column>
              <el-table-column
                prop="charge"
                label="手续费"
                align="center">
              </el-table-column>
              <el-table-column
                prop="flowFee"
                label="支付金额"
                align="center">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/rcm/store/account.check/check'

  export default {
    data () {
      return {
        tableData: [],
        objId: this.$route.params.id
      }
    },
    async created () {
      const res = await api.getById(this.objId)
      if (res && res.data) {
        this.tableData = res.data
      }
    }
  }
</script>
