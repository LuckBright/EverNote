<template>
  <div v-loading='payLoading'>
    <ever-bread-crumb name="收银台" path="/rcm/weixinpay"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body weixinpaybody">
        <div class="titlemessage">
          <span class="billmessage">订单提交成功，请尽快付款！订单号：{{out_trade_no}}</span>
          <span class="moneymessage">应付金额
            <strong>{{flowfee}}</strong>元</span>
        </div>
        <div class="paymentBox">
          <div class="paytitle">
            {{paytitle}}支付
            <span class="cutnum">
              <span v-show="showNum!== '00'">倒计时
                <b>{{showNum}}</b>结束后，</span>请刷新二维码</span>
            <el-button type="primary" size="small" v-if="refreshBtn" @click="createCode">刷新</el-button>
          </div>
          <div class="picBox">
            <div class="codeBox">
              <img :src="codeImg" class="codeImg">
              <div class="desmessage">
                <p>请使用{{paytitle}}扫一扫</p>
                <p>扫描二维码支付</p>
              </div>
            </div>
            <div class="picsidebar" v-bind:class="$route.query.paymethod==='4' ? 'weixinpic' : 'alipaypic'"></div>
          </div>
          <div class="backlink">
            <a @click="backlink" class="setCursor">
              < 返回更换支付方式</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createFlow, getPayStatus } from '../../../store/marketingReceiptApi'
export default {
  data () {
    return {
      codeImg: '',
      settlecode: '',
      out_trade_no: '',
      flowfee: this.$route.query.flowFee,
      paytitle: this.$route.query.payMethod === '4' ? '微信' : '支付宝',
      showNum: 60,
      timer: null,
      refreshBtn: false,
      payLoading: false
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  },
  methods: {
    backlink () {
      history.go(-1)
    },
    queryresult (num, type) {
      let channel = ''
      channel = type === '4' ? 'WX_POLLING' : 'ALI_POLLING'
      clearInterval(this.timer)
      this.timer = setInterval(async () => {
        if (Number(this.showNum) === 0) {
          clearInterval(this.timer)
        }
        try {
          let params = {
            channel: channel,
            out_trade_no: num
          }
          let data = await getPayStatus(params)
          if (
            data &&
            data.data &&
            data.data.tradeStatus &&
            data.data.tradeStatus === 'SUCCESS'
          ) {
            this.$notify({
              type: 'success',
              message: '支付成功'
            })
            clearInterval(this.timer)
            history.go(-1)
          } else if (
            data &&
            data.data &&
            data.data.tradeStatus &&
            data.data.tradeStatus !== 'NOTPAY'
          ) {
            //   this.$notify({
            //     type: 'error',
            //     message: data.data.tradeMsg
            //   })
            //   clearInterval(this.timer)
          }
        } catch (err) {
          console.log(err)
          clearInterval(this.timer)
        }
      }, 2000)
    },
    cutDownNumber (num) {
      let timer = null
      clearTimeout(timer)
      this.showNum = this.toDouble(num)
      if (num <= 0) {
        this.refreshBtn = true
        return false
      }
      num--
      timer = setTimeout(() => {
        this.cutDownNumber(num)
      }, 1000)
    },
    toDouble (n) {
      return n < 10 ? '0' + n : n.toString()
    },
    async createCode () {
      this.payLoading = true
      let params = {
        feeList: [{
          // 支付方式
          payMethod: this.$route.query.payMethod,
          // 金额
          flowFee: this.$route.query.flowFee
        }],
        // 患者id
        patientId: this.$route.query.patientId,
        // 结算id
        settlementId: this.$route.query.settlementId,
        // 结算单号
        settlementNo: this.$route.query.settlementNo,
        // 类型1门诊2住院3商城
        type: 3
      }
      try {
        let data = await createFlow(params)
        if (
          data &&
          data.data &&
          data.data.codeUrl &&
          data.data.response &&
          data.data.response.outTradeNo &&
          data.data.tradeSuccess === true
        ) {
          this.out_trade_no = data.data.response.outTradeNo
          this.codeImg = 'data:image/jpeg;base64,' + data.data.codeUrl
          this.payLoading = false
          this.cutDownNumber(60)
          this.queryresult(this.out_trade_no, this.$route.query.payMethod)
        } else {
          this.$notify({
            type: 'error',
            message: data.data.tradeMsg
          })
          this.payLoading = false
        }
      } catch (err) {
        this.payLoading = false
        console.log(err)
      }
    }
  },
  created () {
    this.createCode()
  }
}
</script>
<style type="text/css" scoped>
.weixinpaybody {
  width: 990px;
  margin: 0 auto;
  position: relative;
}
.titlemessage {
  height: 90px;
  width: 100%;
  line-height: 90px;
  clear: both;
  color: #000;
  font-size: 14px;
}
.billmessage {
  float: left;
}
.moneymessage {
  float: right;
}
.moneymessage strong {
  font-size: 18px;
  color: #e31613;
  padding: 0 3px;
}
.paymentBox {
  background: #fff;
  padding: 12px 30px 0;
  /* box-shadow: 0 6px 32px rgba(0, 0, 0, 0.13); */
  height: 541px;
}
.paytitle {
  margin-bottom: 20px;
  font-size: 18px;
}
.picBox {
  padding-left: 130px;
  margin-bottom: 30px;
  clear: both;
  position: relative;
  height: 440px;
}
.codeBox {
  float: left;
  width: 300px;
}
.codeImg {
  height: 298px;
  width: 298px;
  border: 1px solid #ccc;
}
.desmessage {
  height: 44px;
  padding: 8px 0 8px 125px;
  background: url(../../../../assets/icon-red.png) 50px 8px no-repeat #ff7674;
}
.desmessage p {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: #fff;
  font-weight: 700;
}
.picsidebar {
  float: left;
  width: 379px;
  height: 440px;
  padding-left: 50px;
  margin-top: -20px;
}
.weixinpic {
  background: url(../../../../assets/phone-bg.png) 50px 0 no-repeat;
}
.alipaypic {
  background: url(../../../../assets/alipay.png) 50px 0 no-repeat;
  background-size: auto 440px;
}
.backlink {
  font-size: 14px;
  line-height: 20px;
  color: #4074e1;
}
.cutnum {
  font-size: 14px;
  padding-left: 20px;
}
.cutnum b {
  font-size: 18px;
  padding: 0 3px;
  color: red;
}
.setCursor {
  cursor: pointer;
}
</style>

