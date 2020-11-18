<template>
  <div class="age-range-picker">
    <age-picker :disabled="disabled" v-model="value.start" :show-month="showMonth" :empty="empty" :placeholder="placeholderStart"></age-picker>
    <span class="pl10 pr10" v-show="showAll">至</span>
    <age-picker v-show="showAll" :disabled="disabled" v-model="value.end" :show-month="showMonth" :empty="empty" :placeholder="placeholderEnd"></age-picker>
  </div>
</template>

<script>
  /**
   * @Description: 选择年龄范围组件
   * @author fuyongbo@everjiankang.com
   * @date 2019-05-22
  */
  import agePicker from './agepicker'
  export default {
    props: {
      value: {
        type: Object,
        default: function () {
          return {}
        }
      },
      showMonth: {
        type: Boolean,
        default: true,
      },
      empty: {
        type: Boolean,
        default: false,
      },
      placeholderStart: String,
      placeholderEnd: String,
      disabled: Boolean,
      showAll: {
        type: Boolean,
        default: true
      }
    },
    components: {agePicker},
  }
</script>
<style lang="less" scoped>
  .pr10 {
    padding-right: 10px;
  }
  .age-range-picker {
    display: flex;
    // justify-content: space-between;
    /*background: #fff;*/
    width:280px;
  }
</style>
