<template>
  <div class="com-im-cus-goods">
    <div class="im-goods-title">
      <div class="img">
        <el-image style="width: 58px;height: 58px;" :src="msgData.icon" alt="图片"/>
      </div>
      <div class="im-goods-name">{{msgData.goodsName}}</div>
    </div>
    <div class="im-goods-btn">查看详情</div>
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
  },
  created () {
  }
}
</script>
<style  lang="scss" scoped>
.com-im-cus-goods{
  background-color: #fff;
  border-radius: 4px;
  .im-goods-title{
    width: 225px;
    padding: 12.5px;
    display: flex;
    align-items: center;
  .img {
    margin-right: 8px;
      /deep/ .com-image {
        width: 58px;
        height: 58px;
      }
    }
    .im-goods-name{
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
    }
  }
  .im-goods-btn{
    padding: 12.5px 0;
    font-size: 12px;
    text-align: center;
    border-top:1px solid #DDDDDD;
  }
}
</style>

