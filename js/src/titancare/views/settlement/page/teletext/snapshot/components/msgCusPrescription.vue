<template>
  <div class="com-im-cus-prescription">
    <div class="content">
      <!-- <p class="title" v-if="msgData.payStatus == 0">待支付处方</p> -->
      <p class="title">处方清单</p>
      <p class="desc">开具了建议清单 共{{msgData.count}}种</p>
      <p class="detail">{{msgData.text}}</p>
    </div>
    <div class="status" :class="{'disable': msgData.payStatus == 1}">
      {{msgData.payStatus == 1 ? '已支付' : '查看'}}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msgData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-im-cus-prescription {
    background-color: #fff;
    border-radius: 4px;
    .content {
      width: 225px;
      padding: 12.5px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #000;
        margin-bottom: 12px;
        font-weight: 700;
      }
      .desc {
        margin-bottom: 6px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
      }
      .detail {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #999999;
      }
    }
    .status {
      padding: 12.5px;
      border-radius: 0 0 4px 4px;
      text-align: center;
      font-family: PingFangSC-Regular;
      border-top: 1px solid #DDDDDD;
      font-size: 12px;
      color: #333333;
    }
    .disable {
      background-color: rgba(28,123,239,0.50);
    }
  }
</style>
