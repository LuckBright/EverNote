<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogTableVisible" class="ui_dialog_02">
      <div class="print_table_fixed">
        <h3 class="print_header">{{title}}</h3>
        <el-table :data="tableData"   tooltip-effect="dark" id="printTable">
          <el-table-column prop="settlecode" label="结算单号">
          </el-table-column>
          <el-table-column prop="createUser" label="收银员">
          </el-table-column>
          <el-table-column prop="settledate" label="收费日期">
          </el-table-column>
          <el-table-column prop="payMethod" label="支付方式">
            <template slot-scope="scope">
              <sys-value :code="scope.row.payMethod" type="THC_RCM_PAYMENT_TYPE" :invalidDateShow="1"></sys-value>
            </template>
          </el-table-column>
          <el-table-column prop="flowFee" label="金额">
          </el-table-column>
        </el-table>
        <div class="main-option">总计：{{totalNum}}元</div>
        <div v-show="false">
          <daily-settlement-print id="page1" :title="pTitle" :operator="operator" :closeDate="closeDate" :closeBillItems="printDataDetail" :dailySettlementDetail="printDataDetail" :totalNum="totalNumSpe" :paymentids="paymentids" :payment="printData" :totalCount="totalCountSpe" :date="reportDate" :preCloseTime="preCloseTime"></daily-settlement-print>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onDialogClose">
          <i class="iconfont icon-quxiao"></i>返回</el-button>
        <el-button @click="printHandler('printWrap')" type="primary">
          <i class="iconfont icon-dayinji-"></i>打印</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/rcm/store/income/dailySettlementDetail'
import DailySettlementPrint from '@/rcm/page/income/dailySettlementPrint'
import { isNull } from '@/util/common'
import jcpjs from 'jcpjs'
export default {
  name: 'servicesdialog',
  props: ['title', 'orderType', 'date', 'pTitle'],
  data () {
    return {
      dialogTableVisible: false,
      loading: false,
      tableData: [],
      totalNum: 0,
      totalNumSpe: 0,
      closeId: null,
      printData: [],
      paymentids: [],
      receivableData: [],
      operator: null,
      closeDate: null,
      preCloseTime: null,
      totalCountSpe: 0,
      printDataDetail: [[], []],
      reportDate: this.$moment(),
      isNull
    }
  },
  components: {
    DailySettlementPrint
  },
  methods: {
    onDialogClose () {
      this.dialogTableVisible = false
    },
    onDialogOpen () {
      this.tableData = []
      this.dialogTableVisible = true
    },
    printHandler (dom) {
      var mydoc = {
        documents: document,
        settingsId: 'rcm日结',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      jcpjs.getJCP().printPreview(mydoc)
    },
    async getFlowFee () {
      const _self = this
      const result = await api.getFlowFee({
        closeTime: _self.date,
        orderType: Number(_self.orderType)
      })
      if (result && result.head && result.head.errCode === 0 && result.data) {
        _self.tableData = result.data
        _self.totalNum = 0
        _self.closeId = result.closeId
        _self.tableData.forEach(item => {
          if (item.flowFee) {
            item.flowFee = Number(item.flowFee).toFixed(2)
            _self.totalNum += Number(item.flowFee)
          }
        })
        _self.totalNum = Number(_self.totalNum).toFixed(2)
      } else {
        this.tableData = []
      }
      _self.totalNumSpe = 0
      _self.printDataDetail[0] = []
      _self.printDataDetail[1] = []
      _self.totalCountSpe = 0
      _self.printData = []
      _self.receivableData = []
      if (!_self.isNull(_self.closeId)) {
        const printData = await api.getFlowFeeDetail({ id: _self.closeId })
        _self.totalCountSpe =
          (printData.data.docCount || 0) + (printData.data.returnCount || 0)
        if (
          printData &&
          printData.head &&
          printData.head.errCode === 0 &&
          printData.data
        ) {
          _self.printData = printData.data.payDetail || []
          _self.paymentids = printData.data.payArray || []
          _self.operator = printData.data.operatorName
          _self.closeDate = printData.data.closeTime
          _self.preCloseTime = printData.data.preCloseTime
          if (printData.data.comReceivable) {
            _self.receivable.push({ 商保应收: printData.data.comReceivable })
          }
          _self.reportDate = printData.head.date || this.$moment()
          if (
            printData.data.details &&
            printData.data.details.closeBillItems &&
            printData.data.details.closeBillItems.length
          ) {
            printData.data.details.closeBillItems.forEach((item, index) => {
              item.fee = Number(item.fee).toFixed(2)
              _self.totalNumSpe += Number(item.fee)
              let midNum =
                printData.data.details.closeBillItems.length > 7
                  ? Math.ceil(printData.data.details.closeBillItems.length / 2)
                  : 7
              if (index < midNum) {
                _self.printDataDetail[0].push(item)
              } else {
                _self.printDataDetail[1].push(item)
              }
            })
          }
        }
      }
      _self.totalNumSpe = Number(_self.totalNumSpe).toFixed(2)
    }
  },
  watch: {
    dialogTableVisible: {
      async handler (cur, old) {
        if (cur) {
          await this.getFlowFee()
        }
      }
    }
  }
}
</script>

