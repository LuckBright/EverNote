<template>
  <div class="com-im-cus-consult">
    <div class="name">
      <label>{{msgData.name}}</label>
      <span>{{msgData.tipName}}</span>
    </div>
    <div class="detail">
      <span>{{msgData.age}}岁</span>
      <span>{{msgData.mobile}}</span>
      <span>{{msgData.birthday}}</span>
    </div>
    <div class="content" v-if="msgData.question">
      <p class="title">病情描述</p>
      <p class="txt">{{msgData.question}}</p>
    </div>
    <div class="content" v-if="msgData.images && msgData.images.length">
      <p class="title">历史诊断资料</p>
      <div class="img">
        <img v-for="(item, index) in msgData.images" :key="index" :src="item.includes('http') ? URL + item : URL + item" :preview='index'>
      </div>
    </div>
  </div>
</template>

<script>
import { URL } from '../common/config'
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
      URL
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-im-cus-consult {
    width: 225px;
    padding: 12.5px;
    background-color: #fff;
    border-radius: 4px;
    .name {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      label {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333;
        margin-right: 6px;
      }
      span {
        padding: 1.5px 8px;
        font-family: PingFangSC-Regular;
        font-size: 11px;
        color: #FFF;
        letter-spacing: 0.125px;
        background: #1EC3C2;
        border-radius: 4px;
      }
    }
    .detail {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      span {
        margin-right: 10px;
      }
      span:last-child {
        margin-right: 0;
      }
    }
    .content {
      margin-top: 12px;
      .title {
        margin-bottom: 6px;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #333;
      }
      .txt {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666;
        line-height: 20px;
        text-align: justify;
      }
      .img {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        // /deep/ .com-image {
        //   width: 58px;
        //   height: 58px;
        //   margin-right: 12px;
        //   border-radius: 4px;
        // }
        img{
          width: 60px;
          height: 60px;
          margin: 0 10px 10px 0;
          border-radius: 4px;
        }
      }
    }
  }
</style>
