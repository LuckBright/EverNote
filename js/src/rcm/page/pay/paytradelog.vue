<template>
  <el-dialog
    :visible.sync="v"
    title="渠道支付"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
    :modal-append-to-body="true"
    :append-to-body="true"
  >
    <div class="payCode">
      <div class="code" @click="preventAccidentClick">
        <qrcode :value="payUrl" :options="payOptions"></qrcode>
      </div>
      <div class="authCode">
        <el-input key="authoCode" id="paylogAuthCode" v-model="auth_code" @change="handleScanCode"></el-input>
      </div>
      <div>
        金额：
        <span class="cRed">{{obj.flowFee}}</span>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import settleapi from '@/rcm/store/settlepaymentapi'
import storage from '@/util/storage'

export default {
  props: ['obj', 'tradelogpayshow'],
  data () {
    return {
      auth_code: '',
      payUrl: '未能请求到二维码参数，暂时无法使用主扫支付',
      payOptions: {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        rendererOpts: {
          quality: 0.3
        },
        width: 200
      },
      payCodeLoading: null,
      timer: null // 微信支付宝支付中轮询计时器
    }
  },
  computed: {
    v: {
      get () {
        return this.tradelogpayshow
      },
      set (val) {
        this.$emit('update:tradelogpayshow', val)
      }
    },
  },
  watch: {
    v: {
      handler: function (val) {
        if (val) {
          this.$nextTick(_ => {
            this.elementFocus()
            this.payUrl = this.obj.qrcode
            this.polling(this.obj.flowNumber, undefined, 5000, (isFinish) => {
              this.$emit('getData', isFinish)
            })
          })
        }
      }
    }
  },
  methods: {
    handleClose (done) {
      this.resetPayContext()
      done()
    },
    resetPayContext () {
      this.timer && clearInterval(this.timer)
      this.payCodeLoading && this.payCodeLoading.close()
      this.auth_code = ''
    },
    // 打开支付遮罩
    openPayLoading () {
      this.payCodeLoading = this.$loading({
        lock: true,
        text: '支付中请稍后。。。',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    },
    // 扫授权码
    handleScanCode () {
      if (this.auth_code !== '') {
        let params = {
          patientId: this.obj.patientId,
          settlementId: this.obj.settlementId,
          settlementNo: this.obj.settlementNo,
          type: this.obj.type,
          feeList: [
            {
              payMethod: Number(this.obj.payMethod),
              flowFee: this.obj.flowFee,
              remark: this.obj.remark
            }
          ],
          source: 'MICROPAY',
          authCode: this.auth_code,
          clinicId: storage.getLocalStorage('CLINICID'),
          host: window.location.origin,
          // host: 'http://api.dev2.everjiankang.com.cn', // 测试阶段使用
          // 为了保证不浪费流水号，请求时将流水号带入
          flowNumber: this.obj.flowNumber,
          channel: 'unified_trade_micropay',
        }
        this.openPayLoading() // 扫码成功，打开loading
        settleapi.tradeCreate(params).then(res => {
          // 根据返回结果进一步处理
          this.handlePayResult(res)
        }).catch(err => {
          this.$messageTips(this, 'error', err)
          this.resetPayContext()
        })
      }
    },
    elementFocus () {
      this.auth_code = ''
      let ele = document.getElementById('paylogAuthCode')
      ele.focus()
    },
    polling (flowNumber, num, delay, callback) {
      if (this.timer) { // 如果有先清掉，然后再轮询
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        if (num !== undefined) {
          num--
          if (num <= 0) { // 轮询结束依然没有结果
            this.$messageTips(this, 'error', '未支付成功')
            this.resetPayContext()
            return
          }
        }
        this.payLoading = true
        settleapi.query({ flowNumber }).then(v => {
          // tradeStatus:1成功，-1异常，0支付中
          if (v && v.data && v.data.tradeStatus === 1) {
            this.$messageTips(this, 'success', '支付成功')
            callback()
            this.resetPayContext()
          } else if (v && v.data && v.data.tradeStatus === -1) {
            this.$messageTips(this, 'error', v.data.tradeMsg)
            this.resetPayContext()
          }
        }).catch(err => {
          this.$messageTips(this, 'error', '未支付成功')
          this.resetPayContext()
          console.log(err)
        })
      }, delay)
    },
    // 微信支付宝支付结果处理
    handlePayResult (res) {
      if (res.head && res.head.errCode === 0) {
        if (res.data && res.data.tradeSuccess) {
          if (res.data && res.data.tradeStatus === 1) { // 支付成功
            this.obj.loading = false
            if (this.timer) {
              this.resetPayContext()
            }
            this.$emit('getData')
          } else { // 支付中
            this.polling(res.data.code, undefined, 5000, () => {
              this.$emit('getData')
            })
          }
        } else { // 交易失败
          this.$messageTips(this, 'error', res.data.tradeMsg)
          this.resetPayContext()
        }
      } else {
        this.$messageTips(this, 'error', '接口调用出现错误，请稍后再试')
        this.resetPayContext()
      }
    },
    // 防止意外点击
    preventAccidentClick (e) {
      this.auth_code = ''
      let ele = document.getElementById('paylogAuthCode')
      ele.focus()
    }
  }
}
</script>
<style scoped>
.payCode {
  text-align: center;
}
.authCode {
  position: relative;
  top: -100px;
  z-index: -1;
}
</style>
