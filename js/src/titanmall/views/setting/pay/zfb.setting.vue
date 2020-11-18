<template>
  <div class="main pay-box">
    <el-page-header
      @back="() => {
        $router.go(-1)
      }"
      content="支付宝收款账户"></el-page-header>
    <div class="region pay-container">
      <p>
        <span class="title-span">设置支付宝收款账户</span>
        <span
          class="Subheading"
        >支付设置仅对线上商城有效，设置后预计5-10秒生效</span
        >
      </p>
      <div v-if="show">
        <p>
          当前已设置的收款账户
        </p>
        <p>
          <span class="label-span">商户应用ID</span>
          <span>{{ infoObj.aliAppId }}</span>
          <el-button
            type="text" style="margin-left: 20px" @click="go(true)"
          >修改支付宝收款账户
          </el-button
          >
        </p>
        <p>
          <span class="label-span">商户私钥</span>
          <!--<span>{{ infoObj.aliMchPriSecret }}</span>-->
          <el-input
            disabled
            style="width: 50%"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="infoObj.aliMchPriSecret"
          >
          </el-input>
        </p>
        <p>
          <span class="label-span">主支付宝公钥</span>
          <el-input
            disabled
            style="width: 50%"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="infoObj.aliPubSecret"
          >
          </el-input>
        </p>
      </div>
      <div v-else>
        <el-button
          class="setting-btn" @click="go(false)"
        >+ 添加支付宝账户
        </el-button
        >
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
        infoObj: {
          aliAppId: '',
          aliMchPriSecret: '',
          aliPubSecret: '',
          aliRate: '',
        },
        show: '',
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      go (isTrue) {
        if (isTrue) {
          this.$router.push({
            path: '/titanmall/setting/pay/zfbaccount',
            query: this.infoObj,
          })
        } else {
          this.$router.push({
            path: '/titanmall/setting/pay/zfbaccount',
          })
        }
      },
      getInfo () {
        this.api.payInfo().then(res => {
          if (res) {
            this.show = !!res.aliAppId
            this.infoObj.aliAppId = res.aliAppId
            this.infoObj.aliMchPriSecret = res.aliMchPriSecret
            this.infoObj.aliPubSecret = res.aliPubSecret
            this.infoObj.aliRate = res.aliRate
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .pay-box {
    margin-top: 10px;
    .pay-container {
      p {
        margin: 15px 0;
      }

      & > p:first-child {
        margin-bottom: 30px;
      }

      .title-span {
        font-size: 20px;
        line-height: 20px;
        margin-right: 20px;
        font-width: 700;
      }

      .Subheading {
        font-size: 12px;
        color: #999;
      }

      .label-span {
        color: #999;
        display: inline-block;
        width: 100px;
        text-align: right;
        margin-right: 20px;
      }

      /deep/ .setting-btn {
        padding: 30px;
        font-size: 20px;
        margin-left: 30px;
      }
    }
  }
</style>
