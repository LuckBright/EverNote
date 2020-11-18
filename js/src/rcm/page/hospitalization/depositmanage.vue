<template>
  <div v-loading="depositLoading" style="height:100%;">
    <div style="text-align:right">
      <el-button
        type="primary"
        @click="handleBackHospital"
        v-if="['3'].includes(this.$route.query.ipStatus+'')"
      >退院</el-button>
      <el-button
        type="primary"
        @click="openPayDialog"
        v-if="chargeStatus.includes(this.$route.query.ipStatus+'')"
      >补缴押金</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="settlementNo" label="收据号" width="170"></el-table-column>
      <el-table-column prop="payTime" label="操作时间" width="160"></el-table-column>
      <el-table-column prop="payTime" :formatter="formatBusinessType" label="业务类型" width="80"></el-table-column>
      <el-table-column prop="payName" label="支付方式" width="110"></el-table-column>
      <el-table-column prop="flowFee" label="金额" align="right" width="130">
        <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="payStatus" label="状态"></el-table-column>
      <el-table-column prop="updateUser" label="收费员" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="oldSettlementNo" label="原收据号" width="170"></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.wipeOff?'抹零':scope.row.remark}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="danger"
            v-if="scope.row.settlementType!==1"
            size="small"
            :disabled="($route.query.ipStatus==9 || scope.row.isCancelOrRefund==2)"
            @click="refund(scope.row)"
          >退费</el-button>
          <el-button
            type="primary"
            v-if="checkPrint(scope.row)"
            size="small"
            @click="settlePrint(scope.row.settlementId)"
          >补打</el-button>
          <el-dropdown @command="handleCommand" v-if="checkStatus(scope.row)">
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{func:'synchState',args:[scope.row,true]}">同步状态</el-dropdown-item>
              <el-dropdown-item :command="{func:'payAgain',args:[scope.row]}">再次支付</el-dropdown-item>
              <el-dropdown-item :command="{func:'retreat',args:[scope.row]}">撤销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pay
      :obj="obj"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      @getdata="getdata"
      @closedialog="handleClose"
    ></pay>
    <paymethodstwo
      v-if="PayMethodTwoDialogVisible"
      :obj="obj"
      :dialogVisible.sync="PayMethodTwoDialogVisible"
      @refundStatus="getdata"
      @cancel="closePaymethodtwo"
      @payStatus="getdata"
      @closedialog="handleClose"
    ></paymethodstwo>
    <tradelogpay :tradelogpayshow.sync="tradelogpayshow" :obj="payObj" @getData="payAgainSuccess"></tradelogpay>
  </div>
</template>
<script>
import pay from '@/rcm/page/pay/payhospitalization'
import tradelogpay from '@/rcm/page/pay/paytradelog.vue'
import { getDepositHistory, payDepositInBack, quitFromHospital, refundOriginalRoad, refundPay, getMedicalRegisterInfo } from '@/rcm/store/hospital/hospital'
import settleapi from '@/rcm/store/settlepaymentapi'
import { everprint } from '@/util/common'
import { chargeStatus } from '@/rcm/page/hospitalization/hospitalization-config.js'
export default {
  props: ['value'],
  components: {
    pay,
    tradelogpay
  },
  data () {
    return {
      // api,
      dialogVisible: false,
      PayMethodTwoDialogVisible: false,
      depositLoading: false,
      // 补缴押金弹窗方式,默认使用原来的支付弹窗，2代表可配置的弹窗
      hosPayCode: '1',
      obj: {
        patientId: '',
        ipNo: '',
        // 弹窗类型1押金2收费
        FeeType: 1,
        // 0一站式挂号 1门诊 2住院(押金) 3商城(营销) 4押金
        payType: 2,
        isDeposit: 1,
        // 总额
        totalFee: '',
        // 已收金额
        exefee: '',
        // 还需支付
        unexefee: 0,
        // 住院补缴押金，不会反算默认的支付方式
        backCalculation: false,
        // 结算单号
        settleCode: '',
        medicalNo: '', // 选择全自费可以填写医保卡号然后进行医保报销
        // 结算单id
        id: '',
        paymethodArr: [],
        loading: false,
        payObj: {
          paymethod: 1,
          remark: '',
          flowfee: 0,
          auth_code: ''
        },
        payTradeLog: [],
        details: [],
        status: '',
        pendingOrderFee: '',
        ipSettlementDetail: [],
        // 押金是false,费用为true
        isValited: false,
        isRefund: false,
        iscallback: true
      },
      tableData: [],
      totalAmountRefund: 0,
      isRefundHospital: false,
      payObj: {
        flowFee: '',
        flowNumber: '',
        // 方式2中，0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        type: 1,
        auth_code: ''
      },
      currentRow: null,
      tradelogpayshow: false,
      refundMethod: {
        '0': 'refundOriginalRoad',
        '1': 'refundPay'
      },
      chargeStatus
    }
  },
  watch: {
    '$route': {
      handler: function () {
        // 如果二者相等就没必要刷新了
        if (this.obj.patientId !== this.$route.query.patientId ||
          this.obj.ipNo !== this.$route.query.ipNo) {
          this.obj.patientId = this.$route.query.patientId
          this.obj.ipNo = this.$route.query.ipNo
          this.getDeposit()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 更新押金列表
    getdata (isFinish) {
      // 通道支付，支付完成前不允许关闭支付弹窗
      if (isFinish) {
        this.dialogVisible = false
      }
      this.closePaymethodtwo()
      // 如果是退院操作，支付完成后调接口去改状态
      if (this.isRefundHospital) {
        this.sureRufundBtn()
      } else if (this.obj.isRefund) {
        // 如果是退费，及时处理标识，避免影响下一次调用
        this.getDeposit()
        this.obj.isRefund = false
      } else {
        this.getDeposit()
        this.settlePrint(this.obj.id)
      }
    },
    refund (row) {
      this.$confirm('确定要退费?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refundOriginalRoad(row, this.refundSucess)
      })
    },
    // 原路退费
    refundOriginalRoad (row, callback) {
      refundOriginalRoad({ settlementId: row.settlementId }).then(_ => {
        callback.call(this)
      })
    },
    // 自定义退费
    refundPay (row) {
      refundPay({ settlementId: row.settlementId }).then(res => {
        Object.assign(this.obj, {
          id: res.data.id,
          settleCode: res.data.settleCode,
          totalFee: row.flowFee,
          unexefee: row.flowFee,
          isDeposit: 0, // 如果上一次操作是交押金，这里没有改回来，自定义退费就不校验了
          isRefund: true
        })
        // 退费的时候，将反算标识弄成true
        this.obj.backCalculation = true
        this.PayMethodTwoDialogVisible = true
      })
    },
    // 退费成功回调
    refundSucess () {
      // 退费完，将反算标识弄成false，避免给下次正向的补缴押金带来影响
      this.obj.backCalculation = false
      this.$messageTips(this, 'success', '退费成功!')
      this.getDeposit()
    },
    async settlePrint (settlementId) {
      everprint('thc_rcm.ipdepositprint', { id: settlementId }, { preview: true })
    },
    async getDeposit () {
      this.depositLoading = true
      try {
        let params = {
          patientId: this.$route.query.patientId, // 患者id
          ipNo: this.$route.query.ipNo, // 住院号
          containsOutHospitalSettle: true // 押金列表中包含出院计算
        }
        let data = await getDepositHistory(params)
        if (data && data.data) {
          this.tableData = data.data
          this.hosPayCode = data.hosPayMode || '1'
          // 计算退院时应该退费金额
          this.totalAmountRefund = data.data.filter(item => item.payState !== 3).reduce((sum, curr) => {
            sum += Number(curr.flowFee)
            return sum
          }, 0)
          this.$emit('refresh')
        }
        this.depositLoading = false
      } catch (err) {
        this.depositLoading = false
      }
    },
    openPayDialog () {
      // 生成补缴押金的结算单
      let params = {
        patientId: this.obj.patientId,  // 患者id
        ipNo: this.obj.ipNo, // 住院号
        fee: 0
      }
      payDepositInBack(params).then(data => {
        if (data.data) {
          this.obj.settleCode = data.data.settleCode
          this.obj.id = data.data.id
          this.obj.isRefund = false
          this.obj.isDeposit = 1 // 是押金
          this.obj.backCalculation = false
          this.obj.unexefee = 0
          this.obj.totalFee = 0
          // 20200401，由于补缴押金设计缺陷，改成统一使用支付方式一支付，不再接受配置，bug26270
          this.dialogVisible = true
        } else {
          this.$notify({
            message: '补缴押金生成结算单失败'
          })
        }
      })
    },
    // 退院处理，增加医保相关判断
    handleBackHospital () {
      let params = {
        visitNumber: this.$route.query.ipNo
      }
      getMedicalRegisterInfo(params).then(res => {
        let medicalStatus = (res.data && res.data[0] || {}).status
        // 医保状态：0临时 1入院登记 2修改登记 3撤销 4出院登记
        if (medicalStatus && medicalStatus !== 0 && medicalStatus !== 3) {
          this.$messageTips(this, 'error', '请先取消医保登记')
          return false
        } else {
          this.sureRufundFee()
        }
      })
    },
    // 退院处理逻辑
    sureRufundFee () {
      // console.log(this.totalAmountRefund, '退款金额')
      this.isRefundHospital = true
      payDepositInBack({
        patientId: this.$route.query.patientId, // 患者id
        ipNo: this.$route.query.ipNo, // 住院号（住院流水号）
        fee: -Number(this.totalAmountRefund)
      }).then(rs => {
        this.obj.patientid = this.$route.query.patientId
        this.obj.id = rs.data.id // 改了参数名
        this.obj.settleCode = rs.data.settleCode
        this.obj.isRefund = true
        this.obj.isDeposit = 0 // 不是押金，退费要验证
        this.obj.backCalculation = true
        this.obj.unexefee = Number(this.totalAmountRefund)
        this.obj.totalFee = Number(this.totalAmountRefund)
        this.PayMethodTwoDialogVisible = true
      })
    },

    closePaymethodtwo () {
      this.PayMethodTwoDialogVisible = false
    },
    async sureRufundBtn () {
      this.depositLoading = true
      this.isRefundHospital = false
      try {
        let params = {
          hospitalizedNumber: this.$route.query.ipNo, // 住院号（住院流水号）
          status: 0 // 已取消
        }
        let data = await quitFromHospital(params)
        let errCode = data && data.head && data.head.errCode
        if (errCode === 0) {
          this.getDeposit()
          this.$emit('refresh')
        }
        this.$messageTips(this, 'success', '操作成功')
        this.depositLoading = false
        this.$router.go(-1)
      } catch (err) {
        this.depositLoading = false
      }
    },
    // 以下是线上支付相关逻辑
    // 是否可以再次支付
    checkCanPayAgain (row) {
      // 线上渠道支付，支付状态为支付中的
      return (row.chargeId !== undefined) && (row.payState === 0)
    },
    // 再次支付
    payAgain (row) {
      this.currentRow = row
      Object.assign(this.payObj, row)
      this.tradelogpayshow = true
    },
    // 同步状态
    synchState (row, showTip) {
      settleapi.query({ flowNumber: row.flowNumber }).then(res => {
        row.payStatus = res.data.payStatus
        if (showTip) {
          this.$messageTips(this, 'success', '状态更新成功')
        }
      }).catch(err => {
        this.$messageTips(this, 'error', `状态同步失败,原因：${err}`)
      })
    },
    // 线上支付撤销
    retreat (row) {
      settleapi.retreatFlow({ flowNumber: row.flowNumber }).then(res => {
        if (res.data.tradeSuccess) { // 撤销成功
          this.$messageTips(this, 'success', res.data.tradeMsg)
          this.getDeposit()
        } else { // 撤销失败
          this.$messageTips(this, 'error', res.data.tradeMsg)
        }
      }, err => {
        console.log(err)
      })
    },
    handleCommand (command) {
      this[command.func].apply(this, command.args)
    },
    handleClose (done) {
      this.getDeposit()
      done()
    },
    // 线上支付再次支付成功之后的回调
    payAgainSuccess () {
      this.tradelogpayshow = false
      this.getDeposit()
    },
    // 判断线上支付的按钮是否能显示
    checkStatus (row) {
      return this.$route.query.ipStatus !== 9 && (row.onLine && row.payStatus === '支付中')
    },
    // 判断是否能补打收据
    checkPrint (row) {
      return row.settlementType !== 1 && row.payStatus === '支付成功'
    },
    formatBusinessType (row) {
      return row.settlementType === 1 ? '出院结算' : row.depositRefundFlag === 1 ? '退预交金' : '收预交金'
    }
  }
}
</script>
<style scoped>
.paylayer /deep/ .el-dialog__body {
  padding: 0;
}
</style>

