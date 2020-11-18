<template>
  <div>
    <hosdailylist v-if="!isShowInDialog" ref="hosdailylist"></hosdailylist>
    <div class="layout_inner" @click="toggleDailyList">
      <el-row v-if="!isShowInDialog">
        <el-col :span="24" :class="'main-head mb20'">
          <el-button @click="printHandler" v-if="obj.paymentids.length>0||lastCloseId">打印</el-button>
          <el-button type="primary" @click="showDailyDetail">查看明细</el-button>
          <el-button
            type="primary"
            @click="createDailySettlementFn"
            v-if="obj.paymentids.length>0&&!lastCloseId"
          >日结</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <div class="main-wrap" v-loading.body="loading">
        <el-row :gutter="20">
          <el-col :span="24" id="page1">
            <hosdailycontent
              :obj="obj"
              :isShowInDialog="isShowInDialog"
              @getflowfeelist="getflowfeelist"
              @getBillDetail="getBillDetail"
            ></hosdailycontent>
          </el-col>
        </el-row>
      </div>
      <!-- 查看明细弹窗 -->
      <el-dialog title="住院明细" :visible.sync="dialogTableVisible" class="ui_dialog_02">
        <el-table :data="dialogTableData" tooltip-effect="dark" id="printTable">
          <el-table-column prop="settleCode" label="结算单号" min-width="180"></el-table-column>
          <el-table-column prop="cashierName" label="收银员"></el-table-column>
          <el-table-column prop="payTime" label="收费日期"></el-table-column>
          <el-table-column prop="payName" label="支付方式"></el-table-column>
          <el-table-column prop="flowFee" label="金额" align="right">
            <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <div class="main-option f14 mb10">
            <el-button @click="printHandler()" type="primary">打印</el-button>
          </div>
        </div>
      </el-dialog>
      <!--支付方式明细-->
      <dailysettleto-settlecode
        :dialogtosettle.sync="dialogtosettle"
        :flowfeeData="flowfeeData"
        :title="dialogtosettleTitle"
        :isHospitali="true"
        :isBtn="false"
      ></dailysettleto-settlecode>
      <!--预交金日结弹的单独的dialog-->
      <advance-payment-dialog :dialogtosettle.sync="advanceShow" :flowfeeData="flowfeeData"></advance-payment-dialog>
      <!--票据详情-->
      <billDetailDialog
        v-if="billDetailShow"
        :visible.sync="billDetailShow"
        :billDetailData="billDetailData"
      ></billDetailDialog>
    </div>
  </div>
</template>
<script>
import hosdailylist from '@/rcm/page/income/hospitalizationday/hosdailylist'
import hosdailycontent from '@/rcm/page/income/hospitalizationday/hosdailycontent'
import DailysettletoSettlecode from '@/rcm/page/income/dailysettletosettlecode'
import advancePaymentDialog from '@/rcm/page/income/hospitalizationday/advancepaymentdialog'
import billDetailDialog from '@/rcm/page/income/dailysettlement/billdetail.dialog.vue'
import api from '@/rcm/store/income/hosdaily'
import { _findIndex } from '@/util/formcustom'
import { floatTool } from '@/util/common'

import jcpjs from 'jcpjs'
export default {
  data () {
    return {
      loading: false,
      dialogTableVisible: false,
      advanceShow: false,
      dialogTableData: [],
      dialogTotalFee: 0,
      dialogtosettle: false,
      flowfeeData: [],
      dialogtosettleTitle: '',
      obj: {
        cashierName: '',
        lastCloseTime: '',
        closeBillItems: '',
        dailySettlementDetail: [[], [], []],
        payment: '',
        paymentids: [],
        title: '',
        totalCount: 0,
        date: '',
        preCloseTime: '',
        totalBenefit: '',
        receivableFee: '',
        receivedFee: '',
        subTotal: '',
        receivable: '',
        prepaymentFee: '', // 冲预交金
        totalFeeF: '',
        totalCash: '',
        sortLogs: [], // 预交金的统计分类,
        sortLogsFee: 0
      },
      lastCloseId: '',
      isShowInDialog: this.$route.query.isShowInDialog,
      billDetailShow: false,
      billDetailData: []
    }
  },
  components: {
    hosdailylist, // 历史列表组件
    hosdailycontent, // 住院日结内容组件
    DailysettletoSettlecode, // 按支付方式查看明细组件
    advancePaymentDialog, // 预交金专用弹窗
    billDetailDialog // 票据使用详情弹窗
  },
  watch: {
    '$route.query.id': {
      handler: function (val) {
        if (val) {
          this.lastCloseId = val
        } else {
          this.lastCloseId = ''
        }
        this.showDetail()
      },
      immediate: true
    }
  },
  methods: {
    toggleDailyList () {
      if (this.$refs.hosdailylist) this.$refs.hosdailylist.isShow = false
    },
    // 支付方式明细
    async getflowfeelist (methods, name) {
      this.loading = true
      let params = { payMethod: methods }
      let apiName = ''

      if (methods === 1000) {
        apiName = 'getAdvancePaymentList'
      } else {
        if (this.lastCloseId) {
          apiName = 'getflowfeelistById'
        } else {
          apiName = 'getflowfeelist'
        }
      }
      if (this.lastCloseId) {
        params.lastCloseId = this.lastCloseId
      }
      api[apiName](params).then(res => {
        this.loading = false
        if (res && res.head && res.head.errCode === 0) {
          this.flowfeeData = res.data
          if (methods === 1000) {
            this.advanceShow = true
          } else {
            this.dialogtosettleTitle = name
            this.dialogtosettle = true
          }
        }
      }).catch(() => {
        this.loading = false // 避免接口调用错误，loading还在
      })
    },
    printDaily (type) {
      if (Number(type) === 1 && !this.lastCloseId) {
        this.$confirm('尚未日结，是否直接日结打印', '提示', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(() => {
          this.printHandler()
          api.close({ type: 2 }).then(res => {
            if (res && res.head && res.head.errCode === 0) {
              this.lastCloseId = ''
              this.showDetail()
            }
          })
        }).catch(() => {
          this.printHandler()
        })
      } else {
        this.printHandler()
      }
    },
    // 页面打印
    printHandler () {
      var mydoc = {
        documents: document,
        settingsId: '财务日结单',
        copyrights: '杰创软件拥有版权 www.jatools.com'
      }
      jcpjs.getJCP().printPreview(mydoc)
    },
    // 查看明细弹窗打开
    showDailyDetail () {
      this.dialogTableData = []
      this.dialogTotalFee = 0
      let params = { type: 2 }
      if (this.lastCloseId) {
        params.lastCloseId = this.lastCloseId
      }
      api.getLastCloseDetails(params).then(result => {
        if (result && result.head && result.head.errCode === 0) {
          const lastRes = result.data
          this.dialogTotalFee = lastRes.totalFee
          this.dialogTableData = lastRes.lastCloseInfo
        }
      })
      this.dialogTableVisible = true
    },
    reset () {
      this.$router.replace({
        path: this.$route.path,
        query: {}
      })
      this.lastCloseId = ''
      this.showDetail()
    },
    // 页面日结
    async createDailySettlementFn () {
      try {
        await this.$confirm('是否确认结账', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        api.close({ type: 2 }).then(res => {
          if (res && res.head && res.head.errCode === 0) {
            this.lastCloseId = ''
            this.showDetail()
          }
        })
      } catch (err) {
        console.log('取消')
      }
    },
    showDetail () {
      let params = {}
      if (this.lastCloseId) {
        params.lastCloseId = this.lastCloseId
      }
      api.getIpCloseInfo(params).then(res => {
        this.billDetailData = res.billNoteQueryList
        let resultData = res.data
        // console.log(resultData, 'kakkak')
        Object.assign(this.obj, resultData)
        /*
          depositLog-->收预交金
          depositLogF-->收预交金
          feeLogs-->出院收款
          feeLogsF-->出院退款
          sortLogs->预交金按分类统计
          feeClass->费用分类数组
        */
        // 四种合计清零
        let depositLogSum = 0
        let depositLogFSum = 0
        let feeLogsSum = 0
        let feeLogsFSum = 0
        // 合并到一个数组里面
        this.obj.paymentids = resultData.depositLog
        for (let i = 0; i < resultData.depositLog.length; i++) {
          let paymethod = this.obj.paymentids[i].payMethod
          if (paymethod === resultData.depositLogF[i].payMethod && paymethod === resultData.feeLogs[i].payMethod && paymethod === resultData.feeLogsF[i].payMethod) {
            this.obj.paymentids[i]['depositLog'] = resultData.depositLog[i].flowFee
            this.obj.paymentids[i]['depositLogF'] = resultData.depositLogF[i].flowFee
            this.obj.paymentids[i]['feeLogs'] = resultData.feeLogs[i].flowFee
            this.obj.paymentids[i]['feeLogsF'] = resultData.feeLogsF[i].flowFee
          }
        }
        // 过滤四行都是0的列
        this.obj.paymentids = this.obj.paymentids.filter(item => item.depositLog !== 0 || item.depositLogF !== 0 || item.feeLogs !== 0 || item.feeLogsF !== 0)
        // 统计冲预交金
        let prepaymentFeeIndex = _findIndex(this.obj.paymentids, 1000, 'payMethod')
        if (prepaymentFeeIndex > -1) {
          this.obj.prepaymentFee = this.calcSmallSum(prepaymentFeeIndex)
          this.obj.paymentids.splice(prepaymentFeeIndex, 1)
        } else {
          this.obj.prepaymentFee = 0
        }

        // 应交现金
        let cashIndex = _findIndex(this.obj.paymentids, 1, 'payMethod')
        if (cashIndex > -1) {
          this.obj.totalCash = this.calcSmallSum(cashIndex)
        } else {
          this.obj.totalCash = 0
        }
        // 计算小计与合计
        for (let i = 0; i < this.obj.paymentids.length; i++) {
          // 对应列的小计
          depositLogSum += this.obj.paymentids[i]['depositLog']
          depositLogFSum += this.obj.paymentids[i]['depositLogF']
          feeLogsSum += this.obj.paymentids[i]['feeLogs']
          feeLogsFSum += this.obj.paymentids[i]['feeLogsF']
          // 合计
          this.obj.paymentids[i]['sumZF'] = this.calcSmallSum(i)
        }
        // 退款合计
        this.obj.totalFeeF = depositLogFSum + feeLogsFSum
        // 将合计推入数组
        this.obj.paymentids.push({ payName: '合计', depositLog: depositLogSum, depositLogF: depositLogFSum, feeLogs: feeLogsSum, feeLogsF: feeLogsFSum, sumZF: depositLogSum + depositLogFSum + feeLogsSum + feeLogsFSum })
        // 处理费用分类
        if (resultData.feeClass) {
          this.obj.dailySettlementDetail[0] = []
          this.obj.dailySettlementDetail[1] = []
          this.obj.dailySettlementDetail[2] = []
          let subTotal = 0
          resultData.feeClass.forEach((item, index) => {
            subTotal = floatTool.add(subTotal, item.fee)
            // let midNum = this.dailySettlement.details.closeBillItems.length > 7 ? Math.ceil(this.dailySettlement.details.closeBillItems.length / 2) : 7
            if (index % 3 === 0) {
              this.obj.dailySettlementDetail[0].push(item)
            } else if (index % 3 === 1) {
              this.obj.dailySettlementDetail[1].push(item)
            } else {
              this.obj.dailySettlementDetail[2].push(item)
            }
          })
          this.obj.subTotal = subTotal
        }
        // 预交金总和
        if (resultData.sortLogs) {
          this.obj.sortLogsFee = resultData.sortLogs.reduce((sum, curr) => {
            sum += Number(curr.flowFee)
            return sum
          }, 0)
        }
      })
    },
    // 查看明细弹窗关闭
    onDialogClose () {
      this.dialogTableVisible = false
    },
    calcSmallSum (index) {
      return this.obj.paymentids[index]['depositLog'] + this.obj.paymentids[index]['depositLogF'] + this.obj.paymentids[index]['feeLogs'] + this.obj.paymentids[index]['feeLogsF']
    },
    getBillDetail () {
      this.billDetailShow = true
    }
  }
}
</script>
<style scoped>
.layout_inner {
  flex: 1;
  overflow: scroll;
}
.main-head {
  padding: 0 50px;
  text-align: right;
}
.ui_dialog_02 /deep/ .el-dialog__footer {
  border-top: none;
}
</style>
<style lang="scss" scoped>
@import "src/assets/css/spe_table";
body {
  min-width: 95% !important;
  width: 95% !important;
}
.print_header {
  display: block;
}
.table_spe {
  font-family: "微软雅黑";
  color: #000;
}
.ml50 {
  margin-left: 50px;
}
.dividing-line {
  border-bottom: 2px solid #eeeeee;
  margin: 10px 0;
}
.f14 {
  font-size: 14px;
  line-height: 22px;
}
.mt10 {
  margin: 10px 0;
}
.statement_number {
  cursor: pointer;
  color: #1c7bef;
}

td.prepaymentFee {
  color: #ee4433;
  vertical-align: middle !important;
}
td.noWrap {
  white-space: nowrap;
}
</style>

