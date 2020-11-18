<template>
  <div class="com-im-time">
    <span v-if="parseTime">{{parseTime}}</span>
  </div>
</template>

<script>
export default {
  props: {
    preTime: { // 上条消息时间
      type: Number,
      default: 0
    },
    currTime: { // 本条消息时间
      type: Number,
      default: 0
    },
    nextTime: { // 下条消息时间
      type: Number,
      default: 0
    },
    formatTime: { // 当前格式化的时间
      type: String,
      default: ''
    }
  },
  computed: {
    parseTime () {
      if (this.currTime - this.preTime > 600 || this.preTime === 0) {
        return this.formatTime
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .com-im-time {
    text-align: center;
    span {
      font-family: PingFang-SC-Regular;
      font-size: 12px;
      color: #999;
      display: inline-block;
      margin-bottom: 10px;
    }
  }
</style>
