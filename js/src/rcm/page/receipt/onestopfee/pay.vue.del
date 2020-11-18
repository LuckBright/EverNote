<template>
    <div>
        <div class="layout_inner settle_fee" style="margin-top: 20px;">
            <el-row>
                <el-col :span="8" :offset="16">
                    <span class="label_name">还需支付：</span>
                    <span class="label_pay">￥{{obj.flowFee| formatToFinacial}}</span>
                </el-col>
            </el-row>
        </div>
        <div class="layout_inner settle_paymethod" style="margin-top: 20px;">
            <div class="settlepaymentbox">
                <h4 class="settle_paymethod_title">支付选择</h4>
                <el-menu mode="horizontal" class="settle_paymethod_tab" @select="handleSelect">
                    <el-menu-item index="1">
                        支付方式
                    </el-menu-item>
                </el-menu>
                <div class="paymethod_pay">
                    <template v-for="item in paymethodArr">
                        <div class="paymethod_pay_item" :key="item.value" :class="{active: obj.payObj.paymethod == item.value}" @click="selectmethod(item)" v-if="(item.value === 0 || item.value === 1 || item.value === 2 || item.value === 7 || item.value === 9 || item.value === 10 || item.value === 11 || item.value === 12)">
                            <span v-if="item.value == 0">
                                <i class="iconfont icon-cash iconfont1"></i> {{item.name}}</span>
                            <span v-if="item.value == 1">
                                <i class="iconfont icon-cash iconfont1"></i> {{item.name}}</span>
                            <span v-if="item.value == 2">
                                <i class="iconfont icon-card iconfont2"></i> {{item.name}}</span>
                            <span v-if="item.value == 5">
                                <i class="iconfont icon-cash iconfont1"></i> {{item.name}}</span>
                            <span v-if="item.value == 6">
                                <i class="iconfont icon-cash iconfont1"></i> {{item.name}}</span>
                            <span v-if="item.value == 7">
                                <i class="iconfont icon-cash iconfont1"></i> {{item.name}}</span>
                            <span v-if="item.value == 9">
                                <i class="iconfont icon-QR iconfont9"></i> {{item.name}}</span>
                            <span v-if="item.value == 10">
                                <i class="iconfont icon-card iconfont2"></i> {{item.name}}</span>
                            <span v-if="item.value == 11">
                                <i class="iconfont icon-alipay iconfont4"></i> {{item.name}}</span>
                            <span v-if="item.value == 12">
                                <i class="iconfont icon-alipay iconfont3"></i> {{item.name}}</span>
                            <i class="iconfont icon-Selected" v-show="obj.payObj.paymethod === item.value"></i>
                        </div>
                        <div class="paymethod_pay_item paymethod_pay_item_noicon" :class="{active: obj.payObj.paymethod === item.value}" @click="selectmethod(item)" v-if="(item.value === 13 || item.value === 5|| item.value === 6)">
                            {{item.name}}
                            <i class="iconfont icon-Selected" v-show="obj.payObj.paymethod == item.value"></i>
                        </div>
                        <div class="paymethod_pay_item" :key="item.value" @click="toweixinpay(item.value)" v-if="item.value === 3 || item.value === 4">
                            <span v-if="item.value === 3">
                                <i class="iconfont icon-alipay iconfont3"></i> {{item.name}}</span>
                            <span v-if="item.value === 4">
                                <i class="iconfont icon-wechat iconfont4"></i> {{item.name}}</span>
                        </div>
                    </template>
                    <div class="paymethod_con" style="clear: both;">
                        <div class="paymethod_con_money" style="float: left;" v-show="obj.payObj.paymethod === 9">
                            实收金额
                            <el-input placeholder="请填写金额" type="number" v-model="obj.payObj.qrfee" :disabled="obj.payObj.paymethod === 9"></el-input>
                        </div>
                        <div class="paymethod_con_money" style="float: left;" v-show="obj.payObj.paymethod !== 9">
                            实收金额
                            <el-input placeholder="请填写金额" type="number" v-model="obj.payObj.flowfee" :disabled="true"></el-input>
                        </div>
                        <div class="paymethod_con_money" style="float: left;" v-if="obj.payObj.paymethod === 9">
                            授权码
                            <el-input v-focus="obj.payObj.paymethod === 9" placeholder="请扫码" type="number" v-model="obj.payObj.auth_code"></el-input>
                        </div>
                        <div class="paymethod_con_backmoney" style="float: left;" v-if="obj.payObj.paymethod === 1">
                            找零金额：
                            <span>￥{{oddchange() | formatToFinacial}}</span>
                        </div>
                        <div class="paymethod_con_money" style="float: left;">
                            备注
                            <el-input placeholder="请填写备注" v-model="obj.payObj.remark"></el-input>
                        </div>
                        <el-button style="float: left;" type="primary" @click="pay" :loading="isSureLoading">确认支付</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { createFlow, getPayment } from '@/rcm/store/marketingReceiptApi'
import { frDoPrint } from '@/util/common'
import { Notification } from 'element-ui'
export default {
  props: ['obj'],
  data () {
    return {
      money: 0,
      businessCode: '',
      payedList: [],
      pendingorderArr: [],
      paymethodArr: [],
      otherArr: [],
      receiptId: '',
      settlementId: this.$route.query.settlementId,
      isSureLoading: false
    }
  },
  directives: {
    focus: {
      inserted: function (el, { value }) {
        if (value) {
          el.getElementsByTagName('input')[0].focus()
        }
      }
    }
  },
  created () {
    this.getPayArr()
  },
  methods: {
    async getPayArr () {
      this.payLoading = true
      try {
        let payMentParams = {
          type: 3
        }
        let payMentData = await getPayment(payMentParams)
        if (payMentData && payMentData.data) {
          this.paymethodArr = payMentData.data.form.paymethod
        } else {
          this.payLoading = false
        }
        this.payLoading = false
      } catch (err) {
        this.payLoading = false
        console.log(err)
      }
    },
    async print () {
      this.$emit('getData')
      let params = {
        code: 'RCM-market', // 报告编码
        params: `id=${this.settlementId}`
      }
      frDoPrint(params)
    },
    // 找零金额
    oddchange () {
      let odd = 0.0
      // settlestatus挂单
      return odd.toFixed(2)
    },
    // 应收金额（扫码场景）
    changeflowfee (num) {
      let needtopay = 0
      needtopay = ((this.obj.payPrice || 0) - (this.obj.exefee || 0)).toFixed(2)
      return needtopay
    },
    // 确认支付（微信支付宝扫码除外）
    async pay () {
      this.isSureLoading = true
      if (this.obj.payObj.paymethod === 1) {
        let params = {
          feeList: [{
            // 支付方式
            payMethod: this.obj.payObj.paymethod,
            // 备注
            remark: this.obj.payObj.remark,
            // 金额
            flowFee: this.obj.payObj.flowfee - this.oddchange()
          }],
          // 患者id
          patientId: this.obj.patientId,
          // 结算id
          settlementId: this.obj.settlementId,
          // 结算单号
          settlementNo: this.obj.settlementNo,
          // 类型1门诊2住院3商城
          type: 3
        }
        try {
          let data = await createFlow(params)
          if (data && data.data && data.data.tradeSuccess) {
            // this.receiptlist()
            this.print()
          }
          this.isSureLoading = false
        } catch (err) {
          this.isSureLoading = false
          console.log(err)
        }
      } else if (
        [2, 5, 6, 7, 8, 10, 11, 12, 13].includes(
          parseInt(this.obj.payObj.paymethod)
        )
      ) {
        let params = {
          feeList: [{
            // 支付方式
            payMethod: this.obj.payObj.paymethod,
            // 备注
            remark: this.obj.payObj.remark,
            // 金额
            flowFee: this.obj.payObj.flowfee
          }],
          // 患者id
          patientId: this.obj.patientId,
          // 结算id
          settlementId: this.obj.settlementId,
          // 结算单号
          settlementNo: this.obj.settlementNo,
          // 类型1门诊2住院3商城
          type: 3
        }
        try {
          let data = await createFlow(params)
          if (data && data.data && data.data.tradeSuccess) {
            // this.receiptlist()
            this.print()
          }
          this.isSureLoading = false
        } catch (err) {
          this.isSureLoading = false
          console.log(err)
        }
      } else if (this.obj.payObj.paymethod === 9) {
        if (!this.obj.payObj.auth_code || this.obj.payObj.auth_code === '') {
          Notification.error('请扫码')
        } else {
          let params = {
            feeList: [{
              // 支付方式
              payMethod: this.obj.payObj.paymethod,
              // 备注
              remark: this.obj.payObj.remark,
              // 金额
              flowFee: this.obj.payObj.flowfee
            }],
            // 患者id
            patientId: this.obj.patientId,
            // 结算id
            settlementId: this.obj.settlementId,
            // 结算单号
            settlementNo: this.obj.settlementNo,
            // 类型1门诊2住院3商城
            type: 3,
            // 授权码
            authCode: this.obj.payObj.auth_code
          }
          try {
            let data = await createFlow(params)
            if (data && data.data && data.data.tradeSuccess) {
              //   this.receiptlist()
              this.print()
            }
            this.isSureLoading = false
          } catch (err) {
            this.isSureLoading = false
            console.log(err)
          }
        }
      }
    },
    // 微信支付宝
    toweixinpay (payMethod) {
      this.$router.push(
        '/rcm/scanCodePayment?&patientId=' +
          this.obj.patientId +
          '&settlementId=' +
          this.obj.settlementId +
          '&payMethod=' +
          payMethod +
          '&flowFee=' +
          this.obj.payObj.flowfee +
          '&settlementNo=' +
          this.obj.settlementNo +
          '&type=3'
      )
    },
    // 现金扫码刷卡
    selectmethod (obj) {
      if (obj.value === 9) {
        this.obj.payObj.qrfee = this.changeflowfee()
      } else {
        this.obj.payObj.flowfee = this.changeflowfee()
      }
      Object.assign(this.obj.payObj, {
        paymethod: obj.value
      })
    },
    handleSelect (key, keyPath) {}
  },
  watch: {}
}
</script>
<style scoped>
.layout_box .layout_inner.settle_fee {
  padding: 0;
  width: 100%;
}
.layout_box .layout_inner {
  border-radius: 0;
  box-shadow: none;
  margin: 0;
}
.settle_fee {
  height: 86px;
  line-height: 86px;
}
.settle_fee .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.settle_fee .label_money {
  font-size: 20px;
  color: #000;
  vertical-align: middle;
}
.settle_fee .label_pay {
  font-size: 30px;
  color: #ff9c00;
  vertical-align: middle;
}
.layout_box .layout_inner.settle_paymethod {
  padding: 0;
  width: 100%;
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
  background: #f8f8f8;
  border: 1px solid #ddd;
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
.paymethod_con .el-input__inner {
  width: 162px;
  height: 40px;
}
.paymethod_con_money {
  margin-left: 20px;
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
.paymethod_pay_item.active:before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: -18px;
  left: 50px;
  border-bottom: 6px solid #ddd;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}
.paymethod_pay_item.active:after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: -18px;
  left: 52px;
  border-bottom: 4px solid #f8f8f8;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
</style>
