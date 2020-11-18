<template>
  <component 
    :is="view"
    v-model="myvalue"
    :width="width"
    :number-type="numberType"
    :to-fixed-len="toFixedLen"
    :disabled="disabled"
    :placeholder="placeholder"
    :max="max"
    :min="min">
  </component>
</template>

<script>
import numberComp from './number.vue'
import integerComp from './integer.vue'
export default {
  props: {
    // 传进来的值
    'value': {
      type: [String, Number],
      default: ''
    },
    'numberType': {
      type: String,
      default: 'number'
    },
    // 组件宽度
    'width': {
      type: String,
      default: '100%'
    },
    // 输入最大值，超过了之后会清空，（请像正常人一样理解）
    'max': {
      type: Number,
      default: 99999999
    },
    // 输入最小值，超过了之后会清空，（请像正常人一样理解）
    'min': {
      type: Number,
      default: -99999999
    },
    // 保留小数点位数
    'toFixedLen': {
      type: Number,
      default: 0
    },
    'disabled': {
      type: Boolean,
      default: false
    },
    'placeholder': {
      type: String,
      default: '请输入'
    }
  },
  data () {
    return {
      view: (this.numberType === 'integer' || this.numberType === 'posinteger') ? integerComp : numberComp
    }
  },
  created () {
  },
  computed: {
    'myvalue': {
      set (newVal) {
        this.$emit('input', newVal)
        this.$emit('change', newVal)
      },
      get () {
        return this.value
      }
    }
  },
  components: {
    numberComp,
    integerComp
  }
}
</script>
