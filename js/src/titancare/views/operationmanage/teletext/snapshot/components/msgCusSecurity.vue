<template>
  <!-- ocr-->
  <div class="pre-security">
    <div class="security-title">
      <p>{{msgData.setMealName || '--'}}</p>
      <p><span>服务价格：</span>{{msgData.totalPriceDiss || '--'}}<span class="Cgary" v-if="msgData && msgData.totalPriceDiss">元</span></p>
      <p><span>服务周期：</span>{{msgData.validPeriodStr || '--'}}</p>
    </div>
    <div class="security-btn">查看详情</div>
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
    return {}
  },
  created () {
  }
}
</script>
<style lang="less" scoped>
.pre-security{
  font-size: 14px;
  color: #333333;
  background-color: #fff;
  border-radius: 4px;
  .security-title{
    padding: 12.5px;
    width: 225px;
    p {
      font-size: 14px;
      color: #999999;
      span{
        color: #333333
      }
      .Cgary {
        color: #999999;
      }
    }
    p:first-child{
      color: #000000;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 12px;
    }
    p:nth-child(2){
      margin-bottom: 6px;
    }
  }
  .security-btn {
    padding: 12.5px 0;
    font-size: 12px;
    text-align: center;
    border-top:1rpx solid #DDDDDD;
  }
}
</style>
