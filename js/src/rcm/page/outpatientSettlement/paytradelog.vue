<template>
  <div class="tradelog" v-if="obj.payTradeLog&&(obj.payTradeLog.length>0)">
    <h4 class="settle_paymethod_title">支付记录</h4>
    <el-table style="width:100%" :data="obj.payTradeLog" v-loading="loading">
      <el-table-column prop="payName" label="支付方式"></el-table-column>
      <el-table-column prop="payTime" label="支付时间"></el-table-column>
      <el-table-column prop="flowFee" label="支付金额">
        <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
      </el-table-column>
      <el-table-column prop="payStatus" label="状态"></el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">{{scope.row.wipeOff?'抹零':scope.row.remark}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="small"
            @click="undo(scope.row.id)"
            :disabled="checkIfDisabled(scope.row)"
            v-if="$hasPermission('Auth_rcm_settlements_paylist_cancelBtn')&&(!obj.writeOff)&&(!obj.recollect)"
          >作废</el-button>
          <el-button
            v-if="checkCanShow(scope.row)"
            type="primary"
            @click="synchState(scope.row,true)"
          >同步状态</el-button>
          <el-dropdown @command="handleCommand" v-if="checkCanPayAgain(scope.row)">
            <span class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{func:'payAgain',args:[scope.row]}">再次支付</el-dropdown-item>
              <el-dropdown-item :command="{func:'retreat',args:[scope.row]}">撤销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <tradelogpay :tradelogpayshow.sync="tradelogpayshow" :obj="payObj" @getData="getData"></tradelogpay>
  </div>
</template>
<script>
import settleapi from '@/rcm/store/settlepaymentapi'
import tradelogpay from '@/rcm/page/pay/paytradelog.vue'
export default {
  props: {
    obj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      tradelogpayshow: false,
      payObj: {
        flowFee: '',
        flowNumber: '',
        // 方式2中，0一站式挂号 1门诊 2住院(押金) 3商城(营销)写死的
        type: 1,
        auth_code: ''
      },
      currentRow: null
    }
  },
  methods: {
    getData (val) {
      this.tradelogpayshow = false
      this.$emit('refreshData')
    },
    undo (id) {
      const molingFeeList = this.obj.payTradeLog.filter(v => v.wipeOff && v.payState === 1)
      if (molingFeeList.length > 0) {
        this.undoAll()
      } else {
        this.undoSingle(id)
      }
    },
    // 无抹零流水作废单条
    undoSingle (id) {
      let that = this
      that.$confirm('确认作废此支付流水？').then(_ => {
        that.obj.loading = true
        that.loading = true
        settleapi.del(id).then(
          result => {
            that.loading = false
            if (result.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              this.$emit('refreshData')
            }
          },
          errorFn => {
            that.loading = false
            that.obj.loading = false
          }
        )
      })
    },
    // 有抹零流水，作废的话，支付成功状态(payState=1)的全部作废，
    // 除了（线上chargeId不为空，保险挂单支付方式8，会员卡支付支付方式为0）
    undoAll () {
      let that = this
      const cancelList = this.obj.payTradeLog.filter(v => v.payMethod !== 0 && !v.chargeId && v.payMethod !== 8 && v.payState === 1)
      var message = `<table><th>支付方式</th><th>支付时间</th><th align="right">支付金额</th>`
      message += cancelList.map(item => {
        return `<tr><td>${item.wipeOff ? '抹零' : item.payName}</td><td>${item.payTime}</td><td align="right">${this.$filters.formatToFinacial(item.flowFee)}${item.remark}</td></tr>`
      }).join('')
      message += `</table>`
      that.$confirm(`由于此结算单包含抹零，所以将以下支付流水进行作废:<br>${message}`, {
        dangerouslyUseHTMLString: true
      }).then(_ => {
        that.obj.loading = true
        that.loading = true
        settleapi.delAll(cancelList.map(item => ({ id: item.id }))).then(
          result => {
            that.loading = false
            if (result.head.errCode === 0) {
              this.$messageTips(this, 'success', '操作成功')
              this.$emit('refreshData')
            }
          },
          errorFn => {
            that.loading = false
            that.obj.loading = false
          }
        )
      })
    },
    synchState (row, showTip) {
      settleapi.query({ flowNumber: row.flowNumber }).then(res => {
        if (showTip) {
          this.$messageTips(this, 'success', '状态更新成功')
        }
        this.$emit('refreshData')
      }).catch(err => {
        this.$messageTips(this, 'error', `状态同步失败,原因：${err}`)
      })
    },
    checkIfDisabled (row) {
      // 以下情况不允许作废，3关闭，7表示个人挂单,8表示保险挂单，6表示已退费，refund表示退费，chargeId表示线上支付渠道
      return row.payState === 3 || row.payMethod === 7 || row.payMethod === 8 || this.obj.settleStatus === 6 || this.obj.refund || row.chargeId !== undefined
    },
    // 再次支付
    payAgain (row) {
      this.currentRow = row
      Object.assign(this.payObj, row)
      this.tradelogpayshow = true
    },
    // 线上支付撤销
    retreat (row) {
      settleapi.retreatFlow({ flowNumber: row.flowNumber }).then(res => {
        if (res.data.tradeSuccess) { // 撤销成功
          row.payStatus = res.data.tradeLog.payStatus
          row.payState = res.data.tradeLog.payState
          this.$messageTips(this, 'success', res.data.tradeMsg)
        } else { // 撤销失败
          this.$messageTips(this, 'error', res.data.tradeMsg)
        }
      }, err => {
        console.log(err)
      })
    },
    checkCanShow (row) {
      // 只有线上通道的允许同步状态
      return !!row.chargeId
    },
    checkCanPayAgain (row) {
      // 线上渠道支付，支付状态为支付中的
      return (!!row.chargeId) && (row.payState === 0)
    },
    handleCommand (command) {
      this[command.func].apply(this, command.args)
    }
  },
  components: {
    tradelogpay
  }
}
</script>
<style scoped>
.tradelog {
  margin-top: 10px;
}
</style>
