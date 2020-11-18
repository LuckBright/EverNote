<template>
  <div>
    <ever-bread-crumb name="收银台" path="/rcm/weixinpay"></ever-bread-crumb>
    <div class="layout_inner">
      <div class="panel-body weixinpaybody">
        <div class="titlemessage">
          <span class="billmessage">订单提交成功，请尽快付款！订单号：{{settlecode}}</span>
          <span class="moneymessage">应付金额<strong>{{flowfee}}</strong>元</span>
        </div>
        <div class="paymentBox">
          <div class="paytitle">
            {{paytitle}}支付
            <span class="cutnum">倒计时<b>{{showNum}}</b>结束后，请刷新二维码</span>
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
            <a @click="backlink">< 返回更换支付方式</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../store/weixinpayapi'
  export default {
    data () {
      return {
        codeImg: '',
        settlecode: '',
        flowfee: '',
        paytitle: '',
        showNum: 60,
        timer: null,
        refreshBtn: false
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.timer)
      next(true)
    },
    methods: {
      backlink () {
        history.go(-1)
      },
      queryresult (num, type) {
        let channel = ''
        let that = this
        channel = type === '4' ? 'WX_POLLING' : 'ALI_POLLING'
        clearInterval(that.timer)
        that.timer = setInterval(function () {
          if (Number(that.showNum) === 0) {
            clearInterval(that.timer)
          }
          api.gateway({
            channel: channel,
            out_trade_no: num
          }).then(result => {
            if (result.data.tradeStatus === 'SUCCESS') {
              that.$notify({
                type: 'success',
                message: '支付成功'
              })
              clearInterval(that.timer)
              history.go(-1)
            } else if (result.data.tradeStatus === 'FAILED') {
              that.$notify({
                type: 'error',
                message: result.data.tradeMsg
              })
              clearInterval(that.timer)
            } else if (result.data.tradeStatus !== 'NOTPAY') {
              that.$notify({
                type: 'error',
                message: result.data.tradeMsg
              })
              clearInterval(that.timer)
            }
          })
        }, 1000)
      },
      cutDownNumber (num) {
        let timer = null
        clearTimeout(timer)
        this.showNum = this.toDouble(num)
        if (num <= 0) {
          this.refreshBtn = true
          return false
        }
        let that = this
        num--
        timer = setTimeout(function () {
          that.cutDownNumber(num)
        }, 1000)
      },
      toDouble (n) {
        return n < 10 ? ('0' + n) : n.toString()
      },
      createCode () {
        this.refreshBtn = false
        api.createForThirdPay(this.$route.query).then(result => {
          let that = this
          this.settlecode = result.data.out_trade_no
          this.flowfee = this.$route.query.flowfee
          let queryparams = {}
          if (this.$route.query.paymethod === '4') {
            queryparams = {
              channel: 'WX_NATIVE',
              out_trade_no: result.data.out_trade_no,
              body: result.data.body,
              total_fee: that.$route.query.flowfee
            }
          } else {
            queryparams = {
              channel: 'ALI_QRCODE',
              out_trade_no: result.data.out_trade_no,
              body: result.data.body,
              total_fee: that.$route.query.flowfee
            }
          }
          api.gateway(queryparams).then(result => {
            if (result.data.tradeStatus === 'FAILED') {
              that.$notify({
                type: 'error',
                message: '获取二维码失败'
              })
            } else {
              this.codeImg = 'data:image/jpeg;base64,' + result.data.codeUrl
              this.cutDownNumber(60)
              this.queryresult(this.settlecode, this.$route.query.paymethod)
            }
          })
        })
      }
    },
    created () {
      this.paytitle = this.$route.query.paymethod === '4' ? '微信' : '支付宝'
      this.createCode()
    }
  }
</script>
<style type="text/css">
  .weixinpaybody {width: 990px; margin: 0 auto; position: relative;}
  .titlemessage {height:90px; width: 100%; line-height: 90px; clear: both; color: #000; font-size: 14px;}
  .billmessage {float: left;}
  .moneymessage {float: right;}
  .moneymessage strong { font-size: 18px; color: #e31613; padding: 0 3px;}
  .paymentBox { background: #fff; padding:12px 30px 0; box-shadow: 0 6px 32px rgba(0,0,0,.13); height: 541px;}
  .paytitle { margin-bottom: 20px; font-size: 18px; }
  .picBox {padding-left: 130px; margin-bottom: 30px; clear: both; position: relative; height: 440px; }
  .codeBox {float: left;width: 300px;}
  .codeImg { height: 298px; width: 298px; border: 1px solid #ccc; }
  .desmessage { height: 44px; padding: 8px 0 8px 125px; background: url(../../assets/icon-red.png) 50px 8px no-repeat #ff7674;}
  .desmessage p {margin:0; font-size: 14px; line-height: 22px; color: #fff; font-weight: 700;}
  .picsidebar { float: left; width: 379px; height: 440px; padding-left:50px; margin-top:-20px; }
  .weixinpic {background: url(../../assets/phone-bg.png) 50px 0 no-repeat;}
  .alipaypic {background: url(../../assets/alipay.png) 50px 0 no-repeat; background-size:auto 440px }
  .backlink { font-size: 14px; line-height: 20px; color: #4074e1;}
  .cutnum { font-size: 14px; padding-left: 20px;}
  .cutnum b { font-size: 18px; padding: 0 3px; color: red;}
</style>

