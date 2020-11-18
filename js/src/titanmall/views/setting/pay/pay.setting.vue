<template>
  <div class="main pay-box">
    <div class="region">
      <p>
        <span class="title-span">支付方式设置</span>
        <span
          class="span-color"
        >支付设置仅对线上商城有效，设置后预计5-10秒生效</span
        >
      </p>
      <div class="box">
        <div class="img-box"><img src=""/></div>
        <div class="label-box">
          <p>微信支付</p>
          <p>资金结算到商家的微信收款账户（支付宝内无法使用微信支付）</p>
        </div>
        <div class="btn-box">
          <el-button
            type="text" class="rg" @click="go('wx')"
          >设置收款账户
          </el-button
          >
          <el-switch
            v-model="wxPaySwitch"
            @change="openSwitch('wxPaySwitch')"
          ></el-switch>
        </div>
      </div>
      <div class="box">
        <div class="img-box"><img src=""/></div>
        <div class="label-box">
          <p>支付宝设置</p>
          <p>资金结算到商家的支付宝收款账户（微信内无法使用支付宝支付）</p>
        </div>
        <div class="btn-box">
          <el-button
            type="text" class="rg" @click="go('zfb')"
          >设置收款账户
          </el-button
          >
          <el-switch
            v-model="aliPaySwitch"
            @change="openSwitch('aliPaySwitch')"
          ></el-switch>
        </div>
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
        wxPaySwitch: false,
        aliPaySwitch: false,
      }
    },
    created () {
      this.getPayInfo()
    },
    methods: {
      go (url) {
        this.$router.push({ path: '/titanmall/setting/pay/' + url })
      },
      /**
       开关
       */
      openSwitch (key) {
        let params = {
          wxPaySwitch: this.wxPaySwitch ? 1 : 0,
          aliPaySwitch: this.aliPaySwitch ? 1 : 0,
        }
        let text = params[key] === 1 ? '开通成功' : '关闭成功'
        this.api.paySwitch(params).then(res => {
          this.$message({
            message: text,
            type: 'success',
          })
        })
      },
      getPayInfo () {
        this.api.payInfo().then(res => {
          if (res) {
            this.wxPaySwitch = res.wxPaySwitch === 1
            this.aliPaySwitch = res.aliPaySwitch === 1
          }
        })
      },
    },
  }
</script>
<style lang="less" scoped>
  .pay-box {

    .title-span {
      font-size: 16px;
      line-height: 16px;
      margin-right: 20px;
    }

    .box {
      height: 102px;
      background: #ecf5ff;
      border: 1px solid #b3d8ff;
      border-radius: 2px;
      margin: 20px 0;
      display: flex;
      justify-content: flex-start;

      .img-box {
        width: 80px;
      }

      .label-box {
        flex-grow: 1;

        p:first-child {
          line-height: 60px;
        }

        p:last-child {
          font-size: 14px;
          color: #666;
        }
      }

      .btn-box {
        width: 200px;
        line-height: 100px;
      }

      .rg {
        margin-right: 10px;
      }
    }
  }
</style>
