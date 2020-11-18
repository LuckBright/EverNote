<template>
  <div class="main pay-box">
    <el-page-header
      @back="() => {
        $router.push({path: '/titanmall/setting/pay'})
      }"
      content="微信收款账户"></el-page-header>
    <div class="region pay-container">
      <p>
        <span class="title-span">设置微信公众号</span>
        <span
          class="Subheading"
        >支付设置仅对线上商城有效，设置后预计5-10秒生效</span
        >
      </p>
      <div v-if="showGzh">
        <p>
          当前已授权公众号
        </p>
        <p>
          <span class="label-span">公众微信号</span>
          <span>{{ gzhObj.appId || '--' }}</span>
          <el-button
            type="text"
            class="lf"
            @click="
              () => {
                $router.push('/titanmall/setting/pay/wxadd')
              }
            "
          >修改公众号
          </el-button
          >
          <el-button
            v-if="gzhObj.configStatus === 1 && (gzhObj.authorizationStatus === 0 || gzhObj.authorizationStatus === 2)"
            type="text"
            class="lf"
            @click="
              () => {
                $router.push('/titanmall/setting/pay/qr')
              }
            "
          >
            申请授权
          </el-button>
        </p>
        <p>
          <span class="label-span">公众号昵称</span>
          <span>{{ gzhObj.appName || '--' }}</span>
        </p>
        <!--<p>
          <span class="label-span">主体信息</span>
          <span>{{ gzhObj.subject }}</span>
        </p>
        <p>
          <span class="label-span">微信账号类型</span>
          <span>{{ serviceObj[gzhObj.service_type] }}</span>
        </p>-->
        <p>
          <span class="label-span">授权状态</span>
          <span>{{ statusObj[gzhObj.authorizationStatus] }}</span>
        </p>
        <p>
          <span class="label-span">配置状态</span>
          <span>{{ configStatus[gzhObj.configStatus] }}</span>
        </p>
      </div>
      <div v-else>
        <el-button
          class="setting-btn"
          @click="
            () => {
              $router.push('/titanmall/setting/pay/wxadd')
            }
          "
        >+ 添加公众号
        </el-button
        >
      </div>
      <el-divider></el-divider>
      <p>
        <span class="title-span">设置微信商户号</span>
      </p>
      <div v-if="showShh">
        <p>当前使用的商户号</p>
        <p>
          <span class="label-span">商户号ID：</span>
          <span>{{ shhObj.wxMchId }}</span>
          <el-button
            type="text" class="lf" @click="upDateShh"
          >修改商户号
          </el-button
          >
        </p>
      </div>
      <div v-else>
        <el-button
          class="setting-btn"
          @click="
            () => {
              $router.push('/titanmall/setting/pay/wxaccount')
            }
          "
        >+ 添加商户号
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
        showGzh: true,
        showShh: true,
        gzhObj: {
          appId: '',
          appName: '',
          authorizationStatus: '',
          configStatus: '',
        },
        statusObj: {
          0: '待授权',
          1: '已授权',
          2: '已取消授权',
        },
        serviceObj: {
          0: '订阅号',
          1: '历史老帐号升级后的订阅号',
          2: '服务号',
        },
        configStatus: {
          0: '未配置',
          1: '已配置',
        },
        shhObj: {
          wxMchId: '',
          wxRate: '',
          wxMchSecret: '',
          wxKeyPem: '',
          wxCertPem: '',
          wxCertP12: '',
        },
      }
    },
    created () {
      this.getInfo()
    },
    methods: {
      // 修改商户号
      upDateShh () {
        this.$router.push({ path: '/titanmall/setting/pay/wxaccount', query: this.shhObj })
      },
      // 获取信息
      getInfo () {
        this.api.payInfo().then(res => {
          if (res) {
            this.showShh = !!res.wxMchId
            this.showGzh = !!res.appId
            this.gzhObj.appId = res.appId
            this.gzhObj.appName = res.appName
            this.gzhObj.authorizationStatus = res.authorizationStatus
            this.gzhObj.configStatus = res.configStatus
            // if (res.appDetailInfo.authorizerInfoResponse) {
            //   this.gzhObj.service_type =
            //     res.appDetailInfo.authorizerInfoResponse.authorizer_info.service_type_info.id;
            //   this.gzhObj.nick_Name =
            //     res.appDetailInfo.authorizerInfoResponse.authorizer_info.user_name;
            //   this.gzhObj.subject =
            //     res.appDetailInfo.authorizerInfoResponse.authorizer_info.principal_name;
            // }

            this.shhObj.wxMchId = res.wxMchId
            this.shhObj.wxRate = res.wxRate
            this.shhObj.wxMchSecret = res.wxMchSecret
            this.shhObj.wxKeyPem = res.wxKeyPem
            this.shhObj.wxCertPem = res.wxCertPem
            this.shhObj.wxCertP12 = res.wxCertP12
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

      .lf {
        margin-left: 30px;
      }
    }
  }
</style>
