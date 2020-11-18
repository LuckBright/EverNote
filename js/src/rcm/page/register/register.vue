<template>
  <div class="register_con" v-loading="loading" id="register_con">
    <h4 class="register_title">结算详情</h4>
    <div class="register_patientinfo">
      <el-row>
        <el-col :span="9">
          <el-row>
            <el-col :span="6" class="register_label">患者信息：</el-col>
            <el-col :span="18">
              <el-tooltip
                class="item"
                effect="dark"
                :content="settlementData.patientName + '/' + settlementData.patientAge + '岁/' + settlementData.patientMobile"
                placement="top-start"
              >
                <b class="overhideclass">
                  {{settlementData.patientName}}
                  <b
                    v-if="settlementData.patientAge || settlementData.patientAge===0"
                  >/</b>
                  {{settlementData.patientAge}}
                  <b
                    v-if="settlementData.patientAge || settlementData.patientAge===0"
                  >岁</b>
                  <b v-if="settlementData.patientMobile">/</b>
                  {{settlementData.patientMobile}}
                </b>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-col :span="6" class="register_label">申请人：</el-col>
            <el-col
              :span="18"
              v-if="settlementData.details && settlementData.details.settlementDetail &&settlementData.details.settlementDetail.length"
            >{{settlementData.details.settlementDetail[0].doctorName}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="9">
          <el-row>
            <el-col :span="6" class="register_label">申请时间：</el-col>
            <el-col
              :span="18"
            >{{settlementData.booktime && settlementData.booktime.substring(0, 10)}}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-row>
            <el-col :span="6" class="register_label">门诊档案号：</el-col>
            <el-col :span="18">{{settlementData.outpatientNumber}}</el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <el-row>
            <el-col :span="7" class="register_label">业务来源：</el-col>
            <el-col :span="17">门诊</el-col>
          </el-row>
        </el-col>
        <el-col :span="9">
          <el-row>
            <el-col :span="6" class="register_label">结算单号：</el-col>
            <el-col :span="18">{{settlementData.settlecode}}</el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="register_list">
      <el-row
        v-for="(item, i) in settlementData.details.settlementDetail"
        :key="i"
        class="register_list_item"
      >
        <el-col :span="12" style="text-align: left;">{{item.itemname}}</el-col>
        <el-col :span="12" style="text-align: right;">{{item.fee | formatToFinacial}}</el-col>
      </el-row>
    </div>
    <div class="register_money">
      <el-row>
        <el-col :span="6" :offset="18" style="text-align: right;">
          <span class="label_name">总额：</span>
          <span class="label_pay">￥{{settlementData.totalPayedFee | formatToFinacial}}</span>
        </el-col>
      </el-row>
    </div>
    <template v-if="!refund">
      <h4 class="register_title">支付选择</h4>
      <div class="paymethod_pay">
        <div class="paymethod_pay_item_box">
          <template v-for="item in paymethodArr">
            <div
              class="paymethod_pay_item"
              :class="{active: payObj.paymethod === item.value}"
              @click="selectmethod(item)"
              v-if="item.value === '1' || item.value === '2' || item.value === '9'"
            >
              <span v-if="item.value === '1'">
                <i class="iconfont icon-cash iconfont1"></i>
                {{item.name}}
              </span>
              <span v-if="item.value === '2'">
                <i class="iconfont icon-card iconfont2"></i>
                {{item.name}}
              </span>
              <span v-if="item.value === '9'">
                <i class="iconfont icon-QR iconfont9"></i>
                {{item.name}}
              </span>
              <i class="iconfont icon-Selected" v-show="payObj.paymethod === item.value"></i>
            </div>
            <div
              class="paymethod_pay_item"
              @click="toweixinpay(item.value)"
              v-if="item.value === '3' || item.value === '4'"
            >
              <span v-if="item.value === '3'">
                <i class="iconfont icon-alipay iconfont3"></i>
                {{item.name}}
              </span>
              <span v-if="item.value === '4'">
                <i class="iconfont icon-wechat iconfont4"></i>
                {{item.name}}
              </span>
            </div>
            <div
              class="paymethod_pay_item paymethod_pay_item_noicon"
              :class="{active: payObj.paymethod === item.value}"
              @click="selectmethod(item)"
              v-if="item.value !== '3' && item.value !== '4' && item.value !== '1' && item.value !== '2' && item.value !== '9'"
            >
              <span v-if="item.value ==0">
                <span>{{item.name}}</span>
                <div class="cardfee">{{`(余额${usercardinfo.allmoney}元)`}}</div>
              </span>
              <span v-if="item.value !=0">
                <span>{{item.name}}</span>
              </span>
              <br />
              <span v-if="item.value !=0">{{item.name}}</span>
              <i class="iconfont icon-Selected" v-show="payObj.paymethod === item.value"></i>
            </div>
          </template>
        </div>
        <div class="paymethod_con" style="clear: both;">
          <div class="paymethod_con_money" style="float: left;" v-show="payObj.paymethod === '9'">
            实收金额
            <el-input
              placeholder="请填写金额"
              type="number"
              v-model="payObj.qrfee"
              :disabled="payObj.paymethod === '9'"
            ></el-input>
          </div>
          <div class="paymethod_con_money" style="float: left;" v-show="payObj.paymethod !== '9'">
            实收金额
            <el-input
              placeholder="请填写金额"
              type="number"
              v-model="payObj.flowfee"
              :disabled="payObj.paymethod !== '1'"
            ></el-input>
          </div>
          <div class="paymethod_con_money" style="float: left;" v-if="payObj.paymethod === '9'">
            授权码
            <el-input
              v-focus="payObj.paymethod === '9'"
              placeholder="请扫码"
              type="number"
              v-model="payObj.auth_code"
            ></el-input>
          </div>
          <div class="paymethod_con_backmoney" style="float: left;" v-if="payObj.paymethod === '1'">
            找零金额：
            <span>￥{{oddchange | formatToFinacial}}</span>
          </div>
          <div class="paymethod_con_money" style="float: left;">
            备注
            <el-input placeholder="请填写备注" v-model="payObj.remark"></el-input>
          </div>
          <el-button
            style="float: left;"
            type="primary"
            @click="pay"
            :disabled="settlementData.payStatus===2"
            :loading="payLoading"
          >确认支付</el-button>
          <div style="clear: both;"></div>
        </div>
      </div>
    </template>
    <el-button style="float:right;" type="primary" @click="refundSettle" v-show="refund">确认退费</el-button>
    <!-- <printregistrationform :printinfo="settlementData" v-show="false" ref="registrationForm"></printregistrationform> -->
  </div>
</template>
<script>
import api from '@/rcm/store/settlementapi'
import useraccountapi from '@/workspace/store/useraccountapi'
import refundapi from '@/rcm/store/paymentreturnapi'
// import sysvalue from '@/warehouse/store/sysvalueapi.js'
// import receipt from '@/rcm/store/receiptflowapi'
// import payapi from '@/rcm/store/weixinpayapi'
// 挂号条的打印组件，只是引用，没有调打印方法和传值 注释掉（4.11.1 by lvjiangtao@everjiankang.com）
// import printregistrationform from '@/workspace/page/print-registrationform'
import { everprint } from '@/util/common'
import settleapi from '@/rcm/store/settlepaymentapi'
export default {
  props: ['settlementId', 'refund', 'type'],
  data () {
    return {
      loading: false,
      payLoading: false,
      paymethodArr: [],
      payObj: {
        paymethod: '',
        flowfee: ''
      },
      usercardinfo: {
        allmoney: 0,
        id: ''
      },
      settlementData: {
        id: '',
        patientAge: 0,
        patientName: '',
        patientid: '',
        settlecode: '',
        doctorName: '',
        visitSn: '',
        visitNum: '',
        payStatus: '',
        details: {
          settlementDetail: []
        }
      }
    }
  },
  components: {
    // printregistrationform
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
  computed: {
    oddchange () {
      let that = this
      let odd = 0
      if (that.payObj.flowfee - that.settlementData.totalPayedFee > 0) {
        odd = that.payObj.flowfee - that.settlementData.totalPayedFee
      } else {
        odd = 0
      }
      return odd
    }
  },
  methods: {
    printFee () {
      let that = this
      let fee = 0
      let payDetails = typeof that.settlementData.payDetails === 'string' ? JSON.parse(that.settlementData.payDetails) : that.settlementData.payDetails
      for (var v in payDetails) {
        if (v !== '会员卡支付') {
          fee += payDetails[v]
        }
      }
      return fee.toFixed(2)
    },
    refundSettle () {
      // 一站式退号
      let that = this
      that.loading = true
      refundapi
        .confirmRefund({
          id: this.settlementId
        })
        .then(
          result => {
            that.loading = false
            if (result.head.errCode === 0) {
              that.$emit('paysuccess')
              that.getPrintData(true)
            } else {
              that.$emit('payerror')
            }
          },
          errorFn => {
            that.$emit('payerror')
            that.loading = false
          }
        )
    },
    pay () {
      let that = this
      if (Number(that.payObj.paymethod) === 0 && (this.usercardinfo.allmoney < that.settlementData.totalPayedFee)) {
        that.$notify({
          message: '会员卡金额小于总额',
          type: 'error'
        })
        return false
      }
      if (
        that.payObj.paymethod === '1' &&
        that.payObj.flowfee < that.settlementData.totalPayedFee
      ) {
        that.$notify({
          message: '只能一次支付，支付金额大于等于总额',
          type: 'error'
        })
        return false
      }
      if (
        that.payObj.paymethod === '9' &&
        (!that.payObj.auth_code || that.payObj.auth_code === '')
      ) {
        Notification.error('请扫码')
        return false
      }
      that.loading = true
      this.payLoading = true
      settleapi
        .tradeCreate({
          patientId: that.settlementData.patientid,
          settlementId: that.settlementData.id,
          settlementNo: that.settlementData.settlecode,
          rootOrderId: that.settlementData.visitNum,
          type: 1,
          feeList: [
            {
              payMethod: Number(that.payObj.paymethod),
              flowFee: that.settlementData.totalPayedFee,
              remark: that.payObj.remark,
              cardId: Number(that.payObj.paymethod) === 0 ? this.usercardinfo.id : ''
            }
          ],
          authCode: that.payObj.auth_code
        })
        .then(
          result => {
            this.payLoading = false
            that.$emit('paysuccess')
            that.loading = false
            that.createPrint()
            // that.getPrintData(true)
          },
          errorFn => {
            this.payLoading = false
            that.$emit('payerror')
            that.loading = false
          }
        )
      // if (that.payObj.paymethod !== '4' && that.payObj.paymethod !== '3' && that.payObj.paymethod !== '9') {
      //   receipt.create(Object.assign({
      //     paymethod: that.payObj.paymethod,
      //     remark: that.payObj.remark,
      //     flowfee: that.settlementData.totalPayedFee,
      //     patientid: that.settlementData.patientid,
      //     settlementid: that.settlementData.id,
      //     receivableid: that.settlementData.receivableid
      //   })).then(result => {
      //     that.$emit('paysuccess')
      //     that.loading = false
      //     that.getPrintData(true)
      //   }, errorFn => {
      //     that.$emit('payerror')
      //     that.loading = false
      //   })
      // } else if (that.payObj.paymethod === '9') {
      //   if (!that.payObj.auth_code || that.payObj.auth_code === '') {
      //     Notification.error('请扫码')
      //   } else {
      //     payapi.createForThirdPay({
      //       patientid: that.settlementData.patientid,
      //       settlementid: that.settlementData.id,
      //       receivableid: that.settlementData.receivableid,
      //       settleCode: that.settlementData.settlecode,
      //       paymethod: that.payObj.paymethod,
      //       flowfee: that.settlementData.totalPayedFee
      //     }).then(result => {
      //       payapi.gateway({
      //         channel: 'MICROPAY',
      //         auth_code: that.payObj.auth_code,
      //         out_trade_no: result.data.out_trade_no,
      //         body: result.data.body,
      //         total_fee: parseFloat(that.payObj.flowfee)
      //       }).then(response => {
      //         that.loading = false
      //         if (response.data.tradeStatus === 'SUCCESS') {
      //           that.$notify({
      //             type: 'success',
      //             message: '支付成功'
      //           })
      //           that.$emit('paysuccess')
      //           that.getPrintData(true)
      //         } else if (response.data.tradeStatus !== 'NOTPAY') {
      //           that.$notify({
      //             type: 'error',
      //             message: response.data.tradeMsg
      //           })
      //           that.$emit('payerror')
      //         }
      //       }, errorFn => {
      //         that.$emit('payerror')
      //         that.loading = false
      //       })
      //     }, errorFn => {
      //       that.$emit('payerror')
      //       that.loading = false
      //     })
      //   }
      // }
    },
    toweixinpay (paymethod) {
      let that = this
      that.$router.push(
        '/rcm/weixinpay?settleCode=' +
        that.settlementData.settlecode +
        '&patientid=' +
        that.settlementData.patientid +
        '&settlementid=' +
        that.settlementData.id +
        '&paymethod=' +
        paymethod +
        '&flowfee=' +
        that.payObj.flowfee +
        '&receivableid=' +
        that.settlementData.receivableid
      )
    },
    selectmethod (obj) {
      let that = this
      if (obj.value === '9') {
        that.payObj.qrfee = that.settlementData.totalPayedFee
      } else {
        that.payObj.flowfee = that.settlementData.totalPayedFee
      }
      Object.assign(that.payObj, {
        paymethod: obj.value
      })
    },
    createPrint () {
      let printModel = this.$ever.getClinicConfig().printModel
      if (printModel === 1) {
        let params = { id: this.settlementId }
        everprint('mzsfmx_xht', params, { preview: true })
      }
    },
    getPrintData (printStatus) {
      let that = this
      api.getById(this.settlementId).then(result => {
        that.settlementData = Object.assign(that.settlementData, result)
        that.payObj.flowfee = that.settlementData.totalPayedFee
        that.settlementData.printfee = that.printFee()
        that.settlementData.visitSn =
          result.details.settlementDetail[0].rootorderid
        if (that.settlementData.payStatus === 2 && !printStatus) {
          that.$emit('paysuccess')
          that.createPrint()
        }
        if (printStatus) {
          that.createPrint()
        }
        useraccountapi.getRcmUserCard(that.settlementData.patientid).then(v => {
          if (v.head.errCode === 0) {
            if (v.data.length > 0) {
              this.usercardinfo.allmoney = Number(v.data[0].storedMoney) + Number(v.data[0].givedMoney)
              this.usercardinfo.id = v.data[0].id
            } else {
              this.usercardinfo.allmoney = 0
              this.usercardinfo.id = ''
            }
          }
        })
      })
    },
    paymethod () {
      // 支付方式 由值集换成接口 2018.7.9
      let that = this
      settleapi.payment(4).then(result => {
        if (result.head.errCode === 0) {
          result.data.default.forEach(function (item) {
            item.value = item.value && String(item.value)
            that.paymethodArr.push(item)
          })
        }
        that.payObj.paymethod =
          that.paymethodArr &&
          that.paymethodArr.length &&
          that.paymethodArr[0].value
      })
    }
  },
  created () {
    let that = this
    that.getPrintData()
    that.paymethod()
    // sysvalue.cascade('THC_RCM_PAYMENT_TYPE').then(options => {
    //   options.sort(function (a, b) {
    //     return Number(a.value) - Number(b.value)
    //   })
    //   options.forEach(function (item) {
    //     if (item.erpCode === 'receivable') {
    //       // that.pendingorderArr.push(item)
    //     } else if (item.erpCode === 'other') {
    //       that.paymethodArr.push(item)
    //     } else if (item.erpCode === '') {
    //       that.paymethodArr.push(item)
    //     }
    //   })
    //   that.payObj.paymethod = that.paymethodArr[0].value
    // })
  }
}
</script>
<style scoped>
#register_con {
  background: #fff;
}
.register_title {
  height: 16px;
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #1c7bef;
  margin: 3px 0 3px;
  text-align: left;
}
.register_patientinfo {
  white-space: nowrap;
  color: #000;
  padding-top: 10px;
  font-size: 14px;
  text-align: left;
}
.register_patientinfo b {
  font-weight: normal;
}
.register_patientinfo b.overhideclass {
  display: inline-block;
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.register_patientinfo .register_label {
  color: #999;
  text-align: right;
}
.register_patientinfo > .el-row {
  margin: 10px 0 10px;
}
.register_list {
  background: #f4f4f4;
  padding: 20px;
  border-radius: 4px;
  font-size: 14px;
  color: #000;
}
.register_list_item {
  padding-bottom: 10px;
}
.register_list_item:last-child {
  padding-bottom: 0;
}
.register_money {
  height: 86px;
  line-height: 86px;
}
.register_money .label_name {
  font-size: 14px;
  color: #999;
  vertical-align: middle;
}
.register_money .label_pay {
  font-size: 24px;
  color: #ff9c00;
  vertical-align: middle;
}
#register_con .paymethod_pay {
  clear: both;
  text-align: left !important;
}
.register_con .paymethod_pay_item_box {
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: -1px;
}
.register_con .paymethod_pay_item {
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
  display: inline-block;
  position: relative;
}
.register_con .paymethod_pay_item_noicon {
  min-width: 140px;
  text-align: center;
  padding: 0;
}
#register_con .paymethod_pay_item .iconfont {
  font-size: 25px;
  vertical-align: middle;
}
.register_con .paymethod_pay_item .iconfont1 {
  color: #7973e1;
}
.register_con .paymethod_pay_item .iconfont2 {
  color: #f2aa37;
}
.register_con .paymethod_pay_item .iconfont9 {
  color: #21cfba;
}
.register_con .paymethod_pay_item .iconfont3 {
  color: #1aaceb;
}
.register_con .paymethod_pay_item .iconfont4 {
  color: #00b700;
}
.register_con .paymethod_con {
  min-height: 86px;
  line-height: 86px;
  vertical-align: middle;
  background: #f8f8f8;
  border: 1px solid #ddd;
  color: #666;
  font-size: 14px;
}
.register_con .paymethod_con .el-input {
  margin-left: 10px;
  margin-right: 20px;
  display: inline-block;
  width: 162px;
  color: #000;
}
.register_con .paymethod_con .el-input__inner {
  width: 162px;
  height: 40px;
}
.register_con .paymethod_con_money {
  margin-left: 20px;
}
.register_con .paymethod_con_backmoney span {
  font-size: 16px;
  color: #ff9c00;
}
.register_con .paymethod_con .el-button {
  padding: 12px 20px;
  margin-left: 20px;
  margin-top: 22px;
}
.register_con .settle_paymethod hr {
  margin: 30px 0;
}
.register_con .paymethod_pay_item.active {
  border: 2px solid #1c7bef;
  height: 58px;
  line-height: 58px;
  padding-left: 19px;
  width: 119px;
}
.register_con .paymethod_pay_item_noicon.active {
  min-width: 140px;
  padding-left: 0;
}
#register_con .paymethod_pay_item .icon-Selected {
  font-size: 26px;
  position: absolute;
  height: 26px;
  width: 26px;
  right: -1px;
  bottom: 15px;
  color: #1c7bef;
}
.register_con .paymethod_pay_item.active:before {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: -17px;
  left: 50px;
  border-bottom: 6px solid #ddd;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}
.register_con .paymethod_pay_item.active:after {
  content: "";
  display: block;
  width: 0;
  height: 0;
  position: absolute;
  bottom: -17px;
  left: 52px;
  border-bottom: 4px solid #f8f8f8;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
}
.cardfee {
  color: #fa5555;
  font-size: 12px;
  position: absolute;
  left: 0;
  bottom: 0;
  line-height: 15px;
  width: 140px;
  text-align: center;
}
</style>
