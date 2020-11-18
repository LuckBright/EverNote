<template>
  <div class="com-im-sys-text">
    <div class="label" :style="{'text-align': msgData.align}">{{msgData.text}}</div>
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
  .com-im-sys-text {
    width: 100%;
    display: flex;
    justify-content: center;
    .label {
      width: 225px;
      padding: 12.5px;
      background-color: #d5d5d5;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  }
</style>
