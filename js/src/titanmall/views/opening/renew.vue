<template>
  <div class="main hg">
    <div class="region renew-box">
      <div class="qr-box">
        <p>
          <span class="label">商城服务费</span>
          <span>￥{{ price }}/年</span>
        </p>
        <div class="qr">
          <p>
            <vue-qr :text="qrUrl" :size="200"></vue-qr>
          </p>
          <el-button @click="getPriceUrl">刷新二维码</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from './api'

  export default {
    data () {
      return {
        api,
        price: '',
        qrUrl: '',
        timer: '',
      }
    },
    created () {
      this.getPriceUrl()
    },
    methods: {
      getPriceUrl () {
        this.api.shopRenewOrderPrice().then(res => {
          if (res) {
            this.price = this.$_narrowPrice(res, 100)
            let params = {
              price: res,
            }
            this.api.shopRenewOrderCreate(params).then(res => {
              if (res) {
                this.qrUrl = res.charge.credential.pay_info.qr
                if (this.timer) {
                  clearInterval(this.timer)
                }
                this.getPayStatus(res.statementId)
              }
            })
          }
        })
      },
      // 获取订单状态
      getPayStatus (statementId) {
        let params = {
          orderNo: statementId,
        }
        this.timer = setInterval(() => {
          this.api.shopRenewOrderStatus(params).then(res => {
            if (res) {
              clearInterval(this.timer)
              this.$message({
                message: '缴费成功',
                type: 'success',
              })
              this.$router.go(-1)
            }
          })
        }, 3000)
      },
    },
    destroyed () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
  }
</script>
<style lang="less" scoped>
  .hg {
    height: 90vh;
  }

  .renew-box {
    height: 80vh;

    .qr-box {
      width: 50%;
      margin: 20px auto;
      text-align: center;
      padding: 20px;

      .qr {
        display: inline-block;
        padding: 20px;
        margin: 20px;
        border: 1px solid #e5e5e5;
      }
    }
  }
</style>
