<template>
  <div class="main pay-box">
    <el-page-header
      @back="() => {
        $router.push({ path: '/titanmall/setting/pay/wx' })
      }"
      content="微信收款账户"></el-page-header>
    <div class="region pay-container qr-box">
      <div class="qr">
        <div>
          <h2>公众平台账号授权</h2>
          <div class="qr">
            <vue-qr :text="qrUrl" :size="200" :callback="test"></vue-qr>
            <p>使用公众平台绑定的管理员个人微信扫描</p>
          </div>
        </div>
        <p>
          <el-button @click="getQrCode">刷新二维码</el-button>
          <el-button @click="changeOk">已完成授权</el-button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api'

  export default {
    data () {
      return {
        api,
        qrUrl: '',
      }
    },
    created () {
      this.getQrCode()
    },
    methods: {
      getQrCode () {
        this.api.getAuthUrl().then(res => {
          if (res) {
            this.qrUrl = res
          } else {
            this.$message.success('当前公众微信号已授权')
            this.$router.push({path: '/titanmall/setting/pay/wx'})
          }
        })
      },

      changeOk () {
        this.api.payInfo().then(res => {
          if (res.authorizationStatus === 1) {
            this.$message({
              message: '授权成功',
              type: 'success',
            })
            this.$router.push({path: '/titanmall/setting/pay/wx'})
          } else {
            this.$message({
              message: '授权失败，请重新授权',
              type: 'error',
            })
          }
        })
      },

      test (dataUrl, id) {
      },
    },
  }
</script>
<style lang="less" scoped>
  .pay-box {
    margin-top: 10px;
  }
  .qr-box {
    .qr {
      width: 500px;
      height: 500px;
      margin: 20px auto;
      text-align: center;

      div {
        width: 100%;
        height: 80%;
        background: #e4e7ed;
        padding: 20px 10px;
        margin-bottom: 20px;
        text-align: center;

        .qr {
          width: 80%;
          height: 70%;
          background: #fff;
          border: 1px solid #eee;
        }
      }
    }
  }
</style>
