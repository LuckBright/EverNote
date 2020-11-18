<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="ui_dialog_02">
      <div class="print_table_fixed">
        <el-table :data="tableData" tooltip-effect="dark" id="printTable">
          <el-table-column prop="settleCode" label="结算单号" min-width="180"></el-table-column>
          <el-table-column prop="cashierName" label="收银员"></el-table-column>
          <el-table-column prop="payTime" label="收费日期"></el-table-column>
          <el-table-column prop="payName" label="支付方式"></el-table-column>
          <el-table-column prop="flowFee" label="金额" align="right">
            <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
          </el-table-column>
        </el-table>
        <div v-show="false">
          <hospitalization-dateFormPrint
            id="page1"
            :title="pTitle"
            :totalBenefit="totalBenefit"
            :receivableFee="receivableFee"
            :receivedFee="receivedFee"
            :subTotal="subTotal"
            :prepaymentFee="prepaymentFee"
            :operator="operator"
            :closeDate="closeDate"
            :closeBillItems="closeBillItems"
            :dailySettlementDetail="dailySettlementDetail"
            :paymentids="paymentids"
            :totalCount="totalCount"
            :date="reportDate"
            :totalFeeF="totalFeeF"
            :totalCash="totalCash"
          ></hospitalization-dateFormPrint>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          v-if="(closeBillItems.length || prepaymentData.length) && orderType === '1'"
          @click="printHandler()"
          type="primary"
        >打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import HospitalizationDateFormPrint from '@/rcm/page/income/hospitalizationday/hospitalizationdateformprint'
import { doPrint, dateFormat } from '@/util/common'
import { _findIndex } from '@/util/formcustom'
import jcpjs from 'jcpjs'
export default {
  name: 'servicesdialog',
  props: ['title', 'orderType', 'date', 'pTitle', 'customApi', 'lastCloseId'],
  data () {
    return {
      dialogTableVisible: false,
      loading: false,
      operator: '',
      tableData: [],
      paymentids: [],
      closeBillItems: [],
      dailySettlementDetail: [[], [], []],
      dailySettlement: {
        feeType: this.$route.params.feeType || '1',
        operator: null,
        details: {
          closeBillItems: []
        }
      },
      closeDate: null,
      totalCount: 0,
      totalBenefit: 0,
      receivableFee: 0,
      receivedFee: 0,
      subTotal: 0,
      totalFee: 0,
      prepaymentFee: 0,
      reportDate: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
      doPrint,
      dateFormat,
      prepaymentData: [],
      cashierId: '',
      totalFeeF: 0,
      totalCash: 0
    }
  },
  components: {
    HospitalizationDateFormPrint
  },
  methods: {
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      this.tableData = []
      this.getFlowFee()
      this.getDetails()
      this.dialogTableVisible = true
    },
    printHandler () {
      var mydoc = {
        documents: document,
        settingsId: '财务日结单',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      jcpjs.getJCP().printPreview(mydoc)
    },
    getDetails () {
      this.closeBillItems = []
      this.dailySettlementDetail[0] = []
      this.dailySettlementDetail[1] = []
      this.prepaymentData = []
      let paramsName = ''
      this.orderType === '1' ? paramsName = 'getIpCashierCloseInfo' : paramsName = 'getDepositCloseInfo'
      this.customApi[paramsName]({ lastCloseId: this.lastCloseId }).then(res => {
        if (res && res.head && res.head.errCode === 0 && res.data) {
          const settlementRes = res.data
          if (this.orderType === '1') {
            // 这三个数组的清空如果放到外面，如果接口重复调用会出异步问题
            this.dailySettlementDetail[0] = []
            this.dailySettlementDetail[1] = []
            this.dailySettlementDetail[2] = []

            this.reportDate = res.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.closeTime = res.head.date || this.$moment().format('YYYY-MM-DD HH:mm:ss')
            this.receivableFee = settlementRes.receivableFee
            this.totalBenefit = settlementRes.totalBenefit
            this.receivedFee = settlementRes.receivedFee
            this.subTotal = settlementRes.subTotal
            this.totalCount = settlementRes.totalCount
            this.closeDate = dateFormat(settlementRes.lastCloseTime)
            this.dailySettlement.operator = settlementRes.cashierName

            if (settlementRes.feeClass) {
              this.dailySettlement.details.closeBillItems = settlementRes.feeClass
              this.dailySettlement.details.closeBillItems.forEach((item, index) => {
                // let midNum = this.dailySettlement.details.closeBillItems.length > 7 ? Math.ceil(this.dailySettlement.details.closeBillItems.length / 2) : 7
                if (index % 3 === 0) {
                  this.dailySettlementDetail[0].push(item)
                } else if (index % 3 === 1) {
                  this.dailySettlementDetail[1].push(item)
                } else {
                  this.dailySettlementDetail[2].push(item)
                }
                // if (this.dailySettlementDetail[0].length > this.dailySettlementDetail[1].length) {
                //   this.dailySettlementDetail[1].push({itemClassName: '', fee: '', itemClass: ''})
                // }
              })
            }
            if (settlementRes.feeLogs) {
              this.paymentids = settlementRes.feeLogs
              let prepaymentIndex = _findIndex(this.paymentids, 1000, 'payMethod')
              if (prepaymentIndex > -1) {
                this.prepaymentFee = this.paymentids[prepaymentIndex].flowFee
                this.paymentids.splice(prepaymentIndex, 1)
              } else { this.prepaymentFee = 0 }
              let totalFee = 0
              let totalFeeF = 0
              for (let i = 0; i < this.paymentids.length; i++) {
                if (this.paymentids[i].payMethod === settlementRes.feeLogsF[i].payMethod) {
                  this.paymentids[i]['flowFeeF'] = settlementRes.feeLogsF[i].flowFee
                  this.paymentids[i]['sumZF'] = this.paymentids[i].flowFee + this.paymentids[i].flowFeeF
                  totalFee += this.paymentids[i].flowFee
                  totalFeeF += this.paymentids[i].flowFeeF
                }
              }
              let cashIndex = _findIndex(this.paymentids, 1, 'payMethod')
              if (cashIndex > -1) {
                this.totalCash = this.paymentids[cashIndex].sumZF
              } else {
                this.totalCash = 0
              }
              // 退款合计
              this.totalFeeF = totalFeeF
              // 计算合计
              this.paymentids.push({ payName: '合计', flowFee: totalFee, flowFeeF: totalFeeF, sumZF: totalFee + totalFeeF })
            }
          } else {
            this.prepaymentData = settlementRes.depositLogs
          }
        }
      })
    },
    async getFlowFee () {
      this.tableData = []
      this.totalFee = 0
      let params = {}
      Object.assign(params, { type: this.orderType })
      if (this.lastCloseId) {
        params.lastCloseId = this.lastCloseId
      }
      this.customApi.getLastCloseDetails(params).then(result => {
        if (result && result.head && result.head.errCode === 0) {
          const lastRes = result.data
          this.totalFee = lastRes.totalFee
          this.tableData = lastRes.lastCloseInfo
          lastRes.lastCloseInfo && lastRes.lastCloseInfo.length ? this.cashierId = lastRes.lastCloseInfo[0].cashierId : this.$store.state.currentUser.userId
        }
      })
    }
  }
}
</script>
<style scoped>
.ui_dialog_02 /deep/ .el-dialog__title {
  font-size: 18px;
  font-weight: bold;
}
.ui_dialog_02 /deep/ .el-dialog__header {
  padding-bottom: 0;
}
.ui_dialog_02 /deep/ .el-dialog__body {
  padding-top: 0;
}
.ui_dialog_02 /deep/ .el-dialog__footer {
  border-top: none;
}
</style>
