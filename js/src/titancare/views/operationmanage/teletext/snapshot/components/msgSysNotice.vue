<template>
  <div class="com-im-sys-notice">
    <div class="subject">
      <div class="left">
        <i class="iconfont icongonggaotongzhi"></i>
        <span>{{msgData.subject}}</span>
      </div>
    </div>
    <div class="label">
      <div class="title">{{msgData.title}}</div>
      <div class="content">{{msgData.content}}</div>
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
  }
}
</script>

<style lang="scss" scoped>
  .com-im-sys-notice {
    width: 100%;
    background: #FFF;
    border-radius: 4px;
    padding: 0 12px;
    .subject {
      display: flex;
      align-items: center;
      padding: 15px 0 12px;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      .left {
        display: flex;
        align-items: center;
        span {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #000;
          margin-left: 10px;
        }
      }
      .iconfont {
        width: auto;
        height: auto;
        line-height: 15px;
        font-size: 15px;
      }
      .icongonggaotongzhi {
        color: #1C7BEF;
      }
    }
    .label {
      padding: 15px 0;
      font-family: PingFangSC-Medium;
      line-height: 24px;
      .title {
        font-size: 16px;
        color: #333;
        margin-bottom: 10px;
      }
      .content {
        font-size: 14px;
        color: #999;
        text-align: justify;
      }
    }
  }
</style>
