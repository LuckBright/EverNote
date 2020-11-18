<template>
  <el-cascader
    ref="cascader"
    :size="size"
    style="width: 100%"
    v-model="input"
    :placeholder="placeholder || '请选择'"
    :options="options"
    :disabled="disabled"
    :filterable="filterable"
    :clearable="(clearable || (field && (field.clearable || field.clearable === undefined))) ? true : false"
    :separator="separator || '/'"
    :props="props || {}"
    :valueObjectKey="valueObjectKey"
  ></el-cascader>
</template>

<script>
  import cascaderMixins from '@/util/cascader.mixins'
  export default {
    mixins: [cascaderMixins],
    props: ['value', 'options', 'placeholder', 'disabled', 'filterable', 'clearable', 'separator', 'field', 'props', 'valueObjectKey', 'firstDefault', 'size'],
    data () {
      return {
        input: this.value || []
      }
    },
    created () {
      // 默认选中第一项
      if (this.firstDefault && this.options && this.options.length && (!this.value || !this.value.length)) {
        let valueKey = (this.props && this.props.value) || 'value'
        this.input = [this.options[0][valueKey]]
        if (this.options[0].children && this.options[0].children[0] && this.options[0].children[0][valueKey]) this.input[1] = this.options[0].children[0][valueKey]
        this.$emit('input', this.input)
      }
    },
    watch: {
      value (val) {
        this.input = val || []
      },
      input: {
        handler (val) {
          val = val || []
          this.$emit('input', val)
        },
        deep: true
      }
    }
  }
</script>
