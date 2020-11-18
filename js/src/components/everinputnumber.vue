<template>
  <el-input :disabled="disabled" :key="key" :value="displayInput" @input="inputChange" @blur="inputBlur($event.target.value)" :min="min" :max="max" class="tac" :placeholder="placeholder"></el-input>
</template>

<script>
  /**
   * @Description: 整数输入框
   * @author fuyongbo@everjiankang.com
   * @date 2019-06-04
  */
  import {GENERATE_UUID as U} from '@/bi/util/reportsetuuid'
  export default {
    props: {
      value: {
        type: [Number, String],
        default: 0
      },
      max: {
        type: Number,
        default: Infinity
      },
      min: {
        type: Number,
        default: -Infinity
      },
      empty: {
        type: Boolean,
        default: false,
      },
      placeholder: {
        type: String,
      },
      disabled: Boolean,
    },
    data: function () {
      return {
        crt: this.value,
        key: U()
      }
    },
    watch: {
      value (val) {
        this.crt = val
      },
    },
    computed: {
      displayInput () {
        return getNumber.bind(this)(this.crt)
      }
    },
    methods: {
      inputChange (val) {
        this.crt = getNumber.bind(this)(val)
        this.$emit('input', this.crt)
        this.$emit('change', this.crt)
      },
      inputBlur (val) {
        this.resetKey()
        if (val === '') {
          if (!this.empty) {
            this.crt = 0
          }
          this.$emit('input', this.crt)
          this.$emit('change', this.crt)
        }
      },
      resetKey () {
        this.key = U()
      },
    }
  }
  function getNumber (val) {
    if (val === '') {
      return ''
    }
    let temp = parseInt(val)
    if (temp >= this.max) {
      temp = this.max
    }
    if (temp <= this.min) {
      temp = this.min
    }
    if (isNaN(temp)) {
      temp = 0
    }
    return temp
  }
</script>
<style scoped lang="less">
  .tac /deep/ input {
    text-align: center!important;
  }
</style>
