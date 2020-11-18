<template>
  <el-dialog :title="'退款信息'" :visible.sync="v" width="1100px" class="paytwo" :modal-append-to-body="false" :close-on-click-modal="false" :before-close="handleClose">
    <div class="scoll">
      <div class="settle_paymethod">
        <div class="settlepaymentbox">
          <div class='paymethodList'>
            <div class="otherPaymethod">
              <el-col :span="8" v-for='list in obj.refundReceiptFlows' :key='list.payMethod' class="paymethod_con1">
                <el-col :span="8" class="paymethodlabel">
                  <span>{{list.payName}}</span>
                </el-col>
                <el-col :span="10">
                  <el-input v-model='list.flowfee' type='number' :disabled="true">
                  </el-input>
                </el-col>
              </el-col>
              <div class="clearfix"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <span class="paymethod_con_label">实退金额：</span>
      <span class="paymethod_con_money">￥{{Number(obj.unexefee).toFixed(2)}}</span>
      <el-button type="primary" :disabled="isSureLoading" @click="refundBtn">确认退款</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  confirmRefund,
  phyDelete,
  supermarketRefund
} from '@/rcm/store/outpatient/outpatient'
export default {
  props: ['refunddialogVisible', 'obj', 'type'],
  data () {
    return {
      isSureLoading: false
    }
  },
  created () {
  },
  computed: {
    v: {
      get () {
        return this.refunddialogVisible
      },
      set (val) {
        this.$emit('update:refunddialogVisible', val)
      }
    }
  },
  methods: {
    refundBtn () {
      if (this.type === 8) {
        this.supermarket()
      } else {
        this.confirmRefundBtn()
      }
    },
    supermarket () {
      let params = {
        settementId: this.obj.id
      }
      supermarketRefund(params).then(rs => {
        if (rs.head.errCode === 0) {
          this.$emit('refundSuccess')
        }
      })
    },
    async confirmRefundBtn () {
      this.isSureLoading = true
      let params = {
        id: this.obj.id,
        reSettleId: this.obj.reSettleId || ''
      }
      try {
        let data = await confirmRefund(params)
        this.isSureLoading = false
        if (data.data) {
          this.$notify({
            message: '退款成功',
            type: 'success'
          })
          this.v = false
          this.$emit('afterOriginRefund')
        }
      } catch (err) {
        console.log(err)
        this.isSureLoading = false
      }
    },
    // 关闭前回调
    async closedialog (done) {
      try {
        let params = {
          id: this.obj.id
        }
        let data = await phyDelete(params)
        if (data && data.data) {
          done()
        }
      } catch (err) {
        done()
      }
    },
    // 是否需要关闭前回调
    handleClose (done) {
      if (this.obj.iscallback) {
        this.closedialog(done)
      } else {
        this.v = false
      }
    }
  }
}
</script>
<style scoped>
.settle_fee {
  padding: 0 0px;
  background: #f4f4f4;
  margin: 0 0px;
}
.settle_fee .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.settle_fee .label_money {
  font-size: 18px;
  color: #000;
  font-weight: 400;
  vertical-align: middle;
}
.settle_fee .label_dis_need {
  font-size: 20px;
  color: #000;
  font-weight: 500;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
}
.settle_fee {
  height: 50px;
  line-height: 50px;
}
.settle_fee .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.settle_fee .label_money {
  font-size: 18px;
  color: #000;
  font-weight: 400;
  vertical-align: middle;
}
.settle_fee .label_money_need {
  font-size: 25px;
  color: #ff9c00;
  font-weight: 500;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
}
.settle_paymethod {
  margin-top: 20px;
  padding: 0 20px;
}
.settle_paymethod_title {
  font-size: 16px;
  color: #000;
  padding-left: 13px;
  border-left: 3px solid #1c7bef;
  margin-top: 10px;
}
.settle_paymethod .el-menu {
  background: #fff;
}
.settle_paymethod_tab {
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #000;
  line-height: 16px;
  border-bottom: 1px solid #eee;
  border-radius: 4px 4px 0 0;
}
.settle_paymethod_tab .el-menu-item {
  padding: 0 15px;
}
.settle_paymethod_tab .el-menu-item {
  height: 50px;
  line-height: 50px;
  border-bottom: 3px solid transparent;
}
.settle_paymethod_tab .el-menu-item:hover,
.settle_paymethod_tab .el-menu-item.is-active {
  border-bottom: 3px solid #1c7bef;
  background: #fff;
}
.paymethod_pay {
  width: auto;
  overflow-x: scroll;
  clear: both;
}
.paymethod_pay_item {
  margin-top: 30px;
  margin-right: 40px;
  margin-bottom: 15px;
  width: 120px;
  padding-left: 20px;
  height: 60px;
  line-height: 60px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 16px;
  vertical-align: middle;
  float: left;
  position: relative;
}
.paymethod_pay_item_noicon {
  width: 100px;
  text-align: center;
  padding: 0;
}
.paymethod_pay_item .iconfont {
  font-size: 25px;
  vertical-align: middle;
}
.paymethod_pay_item .iconfont1 {
  color: #7973e1;
}
.paymethod_pay_item .iconfont2 {
  color: #f2aa37;
}
.paymethod_pay_item .iconfont9 {
  color: #21cfba;
}
.paymethod_pay_item .iconfont3 {
  color: #1aaceb;
}
.paymethod_pay_item .iconfont4 {
  color: #00b700;
}
.paymethod_con {
  height: 86px;
  line-height: 86px;
  vertical-align: middle;
  /* background: #f8f8f8;
  border: 1px solid #ddd; */
  color: #666;
  font-size: 14px;
}
.paymethod_con .el-input {
  margin-left: 10px;
  margin-right: 20px;
  display: inline-block;
  width: 162px;
  color: #000;
}
.paymethodList {
  min-height: 40px;
}
.paymethod_con1 {
  vertical-align: middle;
  color: #666;
  padding-bottom: 15px;
  font-size: 14px;
}
.paymethod_con1 .el-input {
  margin-left: 10px;
  display: inline-block;
  width: 150px;
  color: #000;
}
.paymethod_con1 .el-input__inner {
  width: 150px;
  height: 36px;
}
.otherPaymethod .el-input {
  width: 200px;
}
.paymethod_con1 .el-input {
  width: 200px;
}
.otherPaymethod .el-input__inner {
  width: 200px;
}
.paymethod_con_label {
  font-size: 14px;
  color: #000;
}
.paymethod_con_money {
  margin-right: 20px;
  font-size: 18px;
  color: #000;
  font-weight: 400;
}
.paymethod_con_backmoney span {
  font-size: 16px;
  color: #ff9c00;
}
.paymethod_con .el-button {
  padding: 12px 20px;
  margin-left: 20px;
  margin-top: 22px;
}
.settle_paymethod hr {
  margin: 30px 0;
}
.paymethod_pay_item.active {
  border: 2px solid #1c7bef;
  height: 58px;
  line-height: 58px;
  padding-left: 19px;
  width: 119px;
}
.paymethod_pay_item_noicon.active {
  width: 98px;
  padding-left: 0;
}
.paymethod_pay_item .icon-Selected {
  font-size: 26px;
  position: absolute;
  height: 26px;
  width: 26px;
  right: 0;
  bottom: 15px;
  color: #1c7bef;
}
.settle_paymethod.paymethod_pay .paymethod_pay_item_box {
  overflow-y: auto;
}
.paytwo /deep/ .el-dialog__footer {
  border-top: 1px solid #dddddd;
}
.paytwo /deep/ .el-dialog__body {
  padding: 0;
}
.scoll {
  max-height: 500px;
  overflow-y: scroll;
}
.colorRed {
  margin-right: 10px;
  font-size: 16px;
  color: #ff9c00;
}
.paymethodunitbehind {
  line-height: 36px;
  text-align: left;
}
.paymethodunit {
  text-align: right;
}
.paymethodlabel {
  text-align: right;
  font-size: 14px;
  line-height: 33px;
  color: #000;
  font-weight: bold;
}
.remark {
  line-height: 44px;
  margin-bottom: 12px;
}
.remark .label {
  float: left;
  width: 115px;
  font-size: 14px;
  color: #000;
  font-weight: bold;
  text-align: right;
  padding-right: 12px;
}
.remark .remarkcontent {
  float: left;
  width: 910px;
}
.isclick {
  color: #000;
}
.clearfix {
  clear: both;
}
.paytwo /deep/ input::-webkit-outer-spin-button,
.paytwo /deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.paytwo /deep/ input[type="number"] {
  -moz-appearance: textfield;
}
.his {
  width: 15%;
  float: left;
}
.textlabel {
  text-align: right;
  margin-right: 10px;
}
.paytwo /deep/ .el-input__suffix {
  line-height: 36px;
  color: #666;
}
.feelist {
  padding: 0;
  margin: 0;
}
.feelist li {
  float: left;
  padding: 0 20px;
  line-height: 50px;
  height: 50px;
  text-align: center;
}
.brright {
  color: #bbbbbb;
  margin-left: 20px;
}
.bfont {
  font-size: 20px;
}
.receive {
  cursor: pointer;
}
.chargefee {
  color: #f27700;
  font-weight: 500;
}
.getvalue {
  color: #1c7bef;
  font-weight: 500;
  font-size: 14px;
  font-family: sans-serif;
  font-style: inherit;
  cursor: pointer;
}
.remarkicon:before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
.icon-menzhen-shoufei-yanz{
  font-size: 18px;
}
.paytwo /deep/ .his {
  width: 15%;
  float: left;
}
</style>

