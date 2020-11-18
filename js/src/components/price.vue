<template>
  <span>
    <!-- onkeypress="return (event.keyCode === 190 || event.keyCode === 110)" -->
    <el-input
      v-model="price"
      :placeholder="placeholder ? placeholder : defaultPlaceholder"
      :style="{width: width ? width:'100%'}"
      :disabled="disabled"
      :type="type"
      @blur="handleBlur"
      @focus="handleFocus"
      :readonly="readonly ? true : false">
      <template slot="prepend" v-if="prepend">{{ prepend }}</template>
      <template slot="append" v-if="append">{{ append }}</template>
    </el-input>
  </span>
</template>
<script>
export default {
  props: {
    'placeholder': {
      type: String,
      default: ''
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
      type: String, // 存疑
      default: ''
    },
    'append': {
      type: String, // 存疑
      default: ''
    },
    'value': {
      type: [String, Number],
      default: ''
    },
    'type': {
      type: String,
      default: 'number'
    },
    'width': {
      type: [String, Number],
      default: ''
    },
    'maxlength': {
      type: Number,
      default: 20
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
    'negativeNum': { // 是否可输入负数
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      defaultPlaceholder: '请输入数字'
    }
  },
  methods: {
    handleFocus (e) {
      this.$emit('focus-num', e.target.value)
    },
    // 清除 除-数字和.以外的其他字段
    handleBlur (e) {
      setTimeout(() => {
        let tmp = this.fixNumberPatch(e.target.value)
        if (this.toFixedLen > 0) {
          tmp = Number(tmp).toFixed(this.toFixedLen)
        }
        e.target.value = tmp
        this.$emit('input', tmp)
        this.$emit('blur-num', tmp)
      }, 5)
    },
    fixNumberPatch (value) {
      let res = value.replace(/[^-\d.]/g, '')
      .replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      .replace(/-{2,}/g, '-').replace('-', '$#$').replace(/-/g, '').replace('$#$', '-')
      return res
    }
  },
  computed: {
    price: {
      set (newVal) {
        newVal = (this.fixNumberPatch(newVal))
        // 判断输入值的大小
        if (newVal > this.max) {
          newVal = ''
        }
        if (newVal < this.min) {
          newVal = ''
        }
        if (newVal.indexOf('.') > -1) {
          newVal = newVal.substring(0, newVal.indexOf('.') + (this.toFixedLen + 1))
        }
        if (newVal.indexOf('-') > -1) {
          if (!this.negativeNum) newVal = newVal.substring(1)
        }
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    }
  }
}
</script>
