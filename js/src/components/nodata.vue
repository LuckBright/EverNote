<template>
  <div class="com_no_data">
    <img src="../assets/img/zanwushoushu.png" :height="Number(height)" />
    <slot name="custom">
      <div class="c">{{ $t(msg) }}</div>
    </slot>
  </div>
</template>
<script>
let msgArr = [
  '暂无数据',
  '暂无任务',
  '暂无缺货任务'
]
export default {
  props: {
    tipTxt: {
      type: String,
      default: '暂无数据'
    },
    msgType: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    height: {
      type: [String, Number],
      default: '80'
    }
  },
  computed: {
    msg () {
      if (this.msgType) {
        let tmpIndex = this.msgType
        if (!Number(this.msgType) || Number(this.msgType) > msgArr.length) {
          tmpIndex = 0
        }
        return msgArr[tmpIndex]
      } else {
        return this.tipTxt
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.com_no_data {
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 14px;
  color: #666;
}
.com_no_data .c{padding-top:10px}
</style>
