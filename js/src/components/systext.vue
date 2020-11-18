<template>
  <div>
    <template v-if="controls">
      <el-input-number
        v-model.number="text"
        :disabled="disabled"
        :max="(field && !isNull(field.max)) ? field.max : 99999"
        :min="(field && !isNull(field.min)) ? field.min : 1"
        :step="(field && !isNull(field.step)) ? field.step : 1"
        :controls-position="controlsPosition"
      ></el-input-number>
    </template>
    <template v-else>
      <el-input
        ref="input"
        :placeholder="placeholder ? placeholder : label"
        v-model="text"
        :type="type"
        :autosize="{ minRows: 1.1 }"
        :size="size"
        :disabled="disabled || (field && field.disabled)"
        :clearable="clearable"
        :max="(field && !isNull(field.max)) ? field.max : 99999"
        :min="(field && !isNull(field.min)) ? field.min : 0"
        :step="(field && !isNull(field.step)) ? field.step : ''"
        :maxlength="maxlength ? maxlength : (field && !isNull(field.maxlength)) ? field.maxlength : 5000"
        @blur="handleBlur"
      >
        <template slot="append" v-if="append">
          <template v-if="typeof append === 'string'">{{$t(append)}}</template>
          <slot name="appendSelect"></slot>
        </template>
      </el-input>
      <icons style="margin-left: 10px;" :addOrDelette="addOrDelette"></icons>
    </template>
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
  props: ['placeholder', 'disabled', 'value', 'type', 'controls', 'clearable', 'label', 'addOrDelette', 'append', 'field', 'controlsPosition', 'size', 'maxlength'],
  computed: {
    text: {
      set (newVal) {
        // 解决输入零点几的小数时，输入0 不显示的问题
        let val = (this.type === 'number' && newVal && newVal.slice(0, 1) !== '0') ? Number(newVal) : newVal
        // 当限制不能输入小数时，将val转为整数
        if (this.type === 'number' && this.field && this.field.limitInteger) {
          val = parseInt(val)
        }
        this.$emit('input', val)
      },
      get () {
        // 解决输入零点几的小数时，输入0 不显示的问题
        let val = (this.type === 'number' && this.input && this.input.slice(0, 1) !== '0') ? Number(this.value) : this.value
        // 当限制不能输入小数时，将val转为整数
        if (this.type === 'number' && this.field && this.field.limitInteger) {
          val = parseInt(val)
        }
        return val
      }
    }
  },
  components: {
    icons
  },
  methods: {
    handleBlur () {
      // number类型最大值最小值处理
      if (this.type === 'number' && this.field) {
        let val = this.text
        // 当输入0 时，清空输入框， 当输入是零点几的小数时，转为数字
        if (typeof val === 'string') {
          val = Number(val)
        }
        if (!val) {
          val = ''
        }
        if (!isNull(val)) {
          if (!isNull(this.field.min) && this.text < this.field.min) {
            val = this.field.min
          }
          if (!isNull(this.field.max) && this.text > this.field.max) {
            val = this.field.max
          }
        }
        this.$emit('input', val)
        this.$nextTick(() => {
          let input = this.$refs.input.getInput()
          input.value = val
        })
      }
      this.$emit('blur')
    }
  }
}
</script>
