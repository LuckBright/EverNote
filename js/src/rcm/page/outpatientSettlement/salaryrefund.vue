<template>
    <el-dialog title="金额退费" :visible.sync="v" class="refund" :close-on-click-modal="false" :modal-append-to-body="true" :append-to-body="true">
        <div class="showText">
            <span class="textItem">支付金额：<span class="cRed">{{salaryRefundObj.payedFee | formatToFinacial}}</span></span>
            <span class="textItem">可退金额：<span class="cRed">{{salaryRefundObj.canRefundFee | formatToFinacial}}</span></span>
        </div>
        <div class="showInput">
            <el-col :span="8">
                <div class="el-form-item el-form-item--small">
                    <label class="el-form-item__label">退款金额：</label>
                    <div class="el-form-item__content">
                        <el-input v-model="salaryRefundObj.refundFee" type="number" placeholder="请输入退款金额"></el-input>
                    </div>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="el-form-item el-form-item--small">
                    <label class="el-form-item__label">退款原因：</label>
                    <div class="el-form-item__content">
                        <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 1 }" placeholder="请输入退款原因" v-model="salaryRefundObj.refundReason"></el-input>
                    </div>
                </div>
            </el-col>
        </div>
        <div>
            <el-table :data="salaryRefundObj.payTradeLog">
                <el-table-column prop="payName" label="支付方式"></el-table-column>
                <el-table-column prop="payTime" label="支付时间"></el-table-column>
                <el-table-column prop="flowFee" label="支付金额" align="right">
                    <template slot-scope="scope">{{scope.row.flowFee | formatToFinacial}}</template>
                </el-table-column>
                <el-table-column prop="payState" label="状态">
                    <template slot-scope="scope">{{scope.row.payStatus}}</template>
                </el-table-column>
            </el-table>
        </div>
        <div class="footer">
            <el-button @click="v=false">取消</el-button>
            <el-button type="primary" @click="sureRefund">确认</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
  props: {
    salaryRefundvisiable: {
      type: Boolean,
      required: true,
      default: false
    },
    salaryRefundObj: {
      type: Object,
      required: true,
      default: _ => {
        return {}
      }
    }
  },
  data () {
    return {
      tradeLogData: []
    }
  },
  computed: {
    v: {
      get () {
        return this.salaryRefundvisiable
      },
      set (v) {
        this.$emit('update:salaryRefundvisiable', v)
      }
    }
  },
  methods: {
    sureRefund () {
      if (this.salaryRefundObj.refundFee === '') {
        this.$messageTips(this, 'error', '请填写正确的退款金额')
        return false
      } else if (Number(this.salaryRefundObj.refundFee) <= 0) {
        this.$messageTips(this, 'error', '退费金额必须大于0')
        return false
      }
      if (Number(this.salaryRefundObj.refundFee) > this.salaryRefundObj.payedFee) {
        this.$confirm('退款金额大于本单支付金额，是否继续退款?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('suresalaryrefund', this.salaryRefundObj.refundFee)
        })
      } else {
        this.$emit('suresalaryrefund', this.salaryRefundObj.refundFee)
      }
    }
  }
}
</script>
<style scoped>
.showText{
    margin-bottom:15px;
}
.showText .textItem{
    margin-right:24px;
}
.showInput{
    margin-left:0px;
}
.footer{
    text-align: right;
}
.el-form-item{
    margin-right: 15px;
}
.el-form-item__label{
    text-align: left;
    width: 83px;
}
.el-form-item__content{
    margin-left:83px;
}
.el-form-item__content /deep/ .el-input__inner{
    height:33px;
    line-height: 33px;
}
</style>
