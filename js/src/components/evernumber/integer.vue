<template>
  <el-input
    ref="input"
    v-model="mynumber"
    :placeholder="placeholder"
    :style="{width: width}"
    :disabled="disabled"
    type="number"
    @blur="handleBlur"
    :readonly="readonly">
    <template slot="prepend" v-if="prepend">{{ prepend }}</template>
    <template slot="append" v-if="append">{{ append }}</template>
  </el-input>
</template>

<script>
export default {
  props: {
    // 传进来的值
    'value': {
      type: [String, Number],
      default: ''
    },
    // 默认提示语
    'placeholder': {
      type: String,
      default: '请输入'
    },
    // 组件宽度
    'width': {
      type: String,
      default: '100%'
    },
    'disabled': {
      type: Boolean,
      default: false
    },
    'readonly': {
      type: Boolean,
      default: false
    },
    'prepend': {
      type: String,
      default: ''
    },
    'append': {
      type: String,
      default: ''
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
    'numberType': {
      ype: String,
      default: 'integer'
    }
  },
  methods: {
    handleBlur (e) {
      setTimeout(() => {
        e.target.value = this.fixNumberPatch(e.target.value)
      }, 5)
    },
    fixNumberPatch (value) {
      if (this.numberType === 'posinteger') {
        if (Number.parseInt(value) > 0) {
          return Number.parseInt(value)
        } else {
          return ''
        }
      } else {
        if (Number.parseInt(value) || Number.parseInt(value) === 0) {
          return Number.parseInt(value)
        } else {
          return ''
        }
      }
    }
  },
  computed: {
    mynumber: {
      set (newVal) {
        newVal = this.fixNumberPatch(newVal)
        this.$emit('input', newVal)
        this.$emit('change', newVal)
      },
      get () {
        return this.value
      }
    }
  },
}
</script>
