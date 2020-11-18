<template>
  <!-- 视频消息 -->
  <div class="text">
    <template v-if="msgData.opposite">
      <i class="iconfont iconshipin2 iconfont-rotate"></i>{{msgData.text}}
    </template>
    <template v-else>
      {{msgData.text}}<i class="iconfont iconshipin2"></i>
    </template>
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

<style lang="less" scoped>
  .text {
    display: flex;
    align-items: center;
    .iconfont {
      width: auto;
      height: auto;
      line-height: normal;
      color: #191919;
      font-size: 17px;
    }
    .iconfont-rotate {
      transform: rotate(180deg);
    }
  }
</style>
