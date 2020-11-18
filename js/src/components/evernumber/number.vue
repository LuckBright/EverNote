<template>
  <el-input
    v-model="price"
    :placeholder="placeholder"
    :style="{width: width}"
    :disabled="disabled"
    :readonly="readonly"
    @blur="handleBlur">
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
    // 保留小数点位数
    'toFixedLen': {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  methods: {
    // 清除 除-数字和.以外的其他字段
    handleBlur (e) {
      setTimeout(() => {
        let tmp = this.fixNumberPatch(e.target.value)
        if (this.toFixedLen > 0) {
          tmp = Number(tmp).toFixed(this.toFixedLen)
        } else if (this.toFixedLen === 0) {
          tmp = tmp !== '' ? Math.floor(Number(tmp)) : ''
        }
        e.target.value = tmp
        this.$emit('input', tmp)
      }, 5)
    },
    fixNumberPatch (value) {
      let res
      if (this.min >= 0 || this.max < 0) {
        res = value.replace(/[^\d.]/g, '')
        .replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      } else {
        res = value.replace(/[^-\d.]/g, '')
        .replace(/^\./g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        .replace(/-{2,}/g, '-').replace('-', '$#$').replace(/-/g, '').replace('$#$', '-')
      }
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
        if (this.toFixedLen > 0) {
          if (newVal.indexOf('.') > -1) {
            newVal = newVal.substring(0, newVal.indexOf('.') + (this.toFixedLen + 1))
          }
        }
        this.$emit('input', newVal)
      },
      get () {
        return this.value
      }
    }
  },
}
</script>
