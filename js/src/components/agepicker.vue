<template>
  <div :class="'age-picker ' + (border ? 'border-input ' : ' ') + (disabled ? 'is-disabled ' : ' ')">
    <ever-input-number :disabled="disabled" v-model="value.year" :min="0" :max="130" :empty="empty" :placeholder="placeholder"></ever-input-number>
    <span v-if="showMonth">{{yearText}}</span>
    <ever-input-number :disabled="disabled" v-if="showMonth" v-model="value.month" :min="0" :max="11"></ever-input-number>
    <span v-if="showMonth">月</span>
    <ever-input-number :disabled="disabled" v-if="showDay" v-model="value.day" :min="0" :max="30"></ever-input-number>
    <span v-if="showDay">天</span>
    <ever-input-number :disabled="disabled" v-if="showHour" v-model="value.hour" :min="0" :max="23"></ever-input-number>
    <span v-if="showHour">时</span>
  </div>
</template>

<script>
  /**
   * @Description: 选择年龄组件
   * @author fuyongbo@everjiankang.com
   * @date 2019-05-22
  */
  import everInputNumber from './everinputnumber'
  export default {
    components: {everInputNumber},
    props: {
      value: {
        type: Object,
        default: function () {
          return {
            year: 0,
            month: 0,
            day: 0,
            hour: 0
          }
        }
      },
      yearText: {
        type: String,
        default: '岁'
      },
      showMonth: {
        type: Boolean,
        default: true
      },
      showDay: {
        type: Boolean,
        default: false
      },
      showHour: {
        type: Boolean,
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      empty: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '',
      },
      disabled: Boolean,
    },
  }
</script>
<style lang="less" scoped>
.age-picker {
  background-color: #fff;
  display: flex;
  border: 1px solid #bbb;
  border-radius: 2px;
  padding: 0 6px;
  // width:108px;
  &.is-disabled {
    background-color: #eee;
  }
  .el-input--small {
    width: auto;
  }
  input.el-input__inner {
    border: none;
    padding: 0;
  }
  &.border-input {
    border: none;
    padding: 0;
    .el-input--small {
      margin-left: 10px;
      margin-right: 10px;
    }
    input.el-input__inner {
      border: 1px solid #bbb;
    }
  }
}
</style>
