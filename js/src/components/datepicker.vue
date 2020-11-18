<!--
  组件中showformat和outformat格式跟moment有所不同 yyyy-MM-dd HH:mm:ss
  具体参考elementUI 2.4 日期格式：http://element-cn.eleme.io/2.4/#/zh-CN/component/date-picker#ri-qi-ge-shi
-->
<template>
  <el-date-picker
    ref="comp"
    v-model="input"
    :clearable="clearable == 'undefined' ? true : clearable"
    :type="type || 'date'"
    :placeholder="showformat ? '__年_月_日  _时_分' : '__年_月_日'"
    :size="size"
    :disabled="disabled"
    :picker-options="pickerOpts"
    :style="{width: autoWidth ? 'auto' : '100%'}"
    :format="showformat || (field && field.showformat) || ''"
    :value-format="outformat || (field && field.outformat) || ''"
    :range-separator="rangeSeparator"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    @change="change"
  ></el-date-picker>
</template>

<script>
export default {
  props: ['value', 'autoWidth', 'disabled', 'showformat', 'outformat', 'size', 'type', 'pickerOptions', 'placeholder', 'rangeSeparator', 'startPlaceholder', 'endPlaceholder', 'field', 'clearable'],
  data () {
    return {
      input: this.value || '',
      pickerOpts: this.pickerOptions || ''
    }
  },
  created () {
    if (this.field && this.field.minDate) {
      if (this.field.minDate === 'now') {
        this.pickerOpts.disabledDate = function (time) {
          return Date.now() > time.getTime() + 24 * 60 * 60 * 1000
        }
      }
    }
  },
  mounted () {
    let el = this.$el
    let compThis = this
    el.onkeydown = function (e) {
      let keyNum = window.event ? e.keyCode : e.which
      if (keyNum === 13) {
        if (compThis.$root.everBindEnterDom && compThis.$root.everBindEnterDom.length && compThis.$root.everBindEnterIndex) {
          // let nextIndex = compThis.$root.everBindEnterIndex + 1
          // compThis.$root.everBindEnterDom[nextIndex] && setTimeout(_ => { compThis.$root.everBindEnterDom[nextIndex].focus() }, 50)
          compThis.$root.everBindEnterIndex = compThis.$root.everBindEnterIndex + 1
          compThis.$root.everBindEnterDom[compThis.$root.everBindEnterIndex - 1].focus()
        }
        compThis.$refs.comp.pickerVisible = false
      }
    }
  },
  methods: {
    change (val) {
      this.$emit('change', val)
    }
  },
  watch: {
    'value': {
      handler (val) {
        this.input = val || ''
      },
      deep: true
    },
    'input': {
      handler (val) {
        val = val || ''
        this.$emit('input', val)
      },
      deep: true
    }
  }
}
</script>
