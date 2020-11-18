<template>
  <div class="com-im-cus-prescription">
    <div class="content">
      <p class="title">处方清单</p>
      <p class="desc">开具了建议清单 共{{msgData.count}}种</p>
      <p class="detail">{{msgData.text}}</p>
    </div>
    <div class="status" :class="{'disable': msgData.payStatus == 1}">
      {{msgData.payStatus == 1 ? '已支付' : '待支付'}}
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
      }
      .desc {
        color: #333;
        margin-bottom: 6px;
      }
      .detail {
        color: #999;
      }
    }
    .status {
      color: #fff;
      padding: 7px;
      background-color: #1C7BEF;
      text-align: center;
      border-radius: 0 0 4px 4px;
    }
    .disable {
      // background-color: rgba(28,123,239,0.50);
      background-color: #999;
    }
  }
</style>
