<template>
  <div @keyup.up="keyup($event)" @keyup.down="keydown($event)">
      <el-input
        ref="input"
        :placeholder="placeholder ? placeholder : label"
        :disabled="disabled"
        :controls="controls"
        :clearable="clearable"
        :size="size"
        v-model="text"
        @blur="handleBlur"
      >
        <template slot="append" v-if="append">
          <template v-if="typeof append === 'string'">{{$t(append)}}</template>
          <slot name="appendSelect"></slot>
        </template>
      </el-input>
      <icons style="margin-left: 10px;" :addOrDelette="addOrDelette"></icons>
  </div>
</template>
<script>
import { isNull } from '@/util/common'
import icons from './icons'
export default {
  data () {
    return {
      isNull
    }
  },
  props: ['placeholder', 'disabled', 'value', 'type', 'controls', 'clearable', 'label', 'addOrDelette', 'append', 'field', 'controlsPosition', 'size', 'maxlength', 'toFixed'],
  computed: {
    text: {
      set (newVal) {
        newVal = newVal.replace('。', '.')
        if (newVal.split('.').length > 2) {
          return
        }
        let reg = /^\d+$|^\d*\.\d+$/g
        let max = this.field.max || 0
        let min = this.field.min || 0
        if (+newVal > max || (+newVal < min && newVal)) {
          return
        }
        // if (reg.test(newVal) || /\.$/.test(newVal) || newVal === '') {
        if (reg.test(newVal) || /\.$/.test(newVal) || newVal === '') {
          this.$emit('input', newVal)
        }
      },
      get () {
        return this.value
      }
    }
  },
  components: {
    icons
  },
  methods: {
    keyup () {
      if (this.disabled) {
        return false
      }
      let max = this.field.max || 0
      if (+this.text > max) {
        return
      }
      let num = this.text.toString().split('.')
      num[0] = (+num[0] || 0) + 1
      this.text = num.join('.')
    },
    keydown () {
      if (this.disabled) {
        return false
      }
      let min = this.field.min || 0
      if (+this.text < min) {
        return
      }
      let num = this.text.toString().split('.')
      num[0] = (+num[0] || 0) - 1
      this.text = num.join('.')
    },
    handleBlur () {
      if (!(+this.text)) {
        this.$emit('input', '')
      } else {
        let text = this.text.toString()
        let num
        num = text.replace(/\.$/, '.0')
        if (text.indexOf('.') !== -1) {
          num = +num && (+num).toFixed(2).toString() || ''
          this.$emit('input', num)
        }
        this.$emit('input', +num && num || '')
      }
    }
  },
}
</script>
