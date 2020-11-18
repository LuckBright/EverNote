
<template>
  <el-select
    v-model="select"
    :placeholder="placeholder"
    :size="size"
    :clearable="clearable ? true : false"
    :style="{width: width ? width:'100%'}"
    :disabled="disabled"
    :no-data-text="nodatatext"
    :filterable="filterableFlag"
    :default-first-option="true"
    :needObjFlag="false"
    :allow-create="allowCreate"
    @visible-change="visibleChange"
    @change="change"
    @clear="clear"
    @blur="blur"
    :value-key="needObjFlag ? 'id' : 'value'"
    v-bind="{'multiple': multiple ? true : false}"
  >
    <el-option
      v-for="option in computeOptions"
      :key="needObjFlag ? option.id : customValue ? option[customValue] : option.id"
      :label="customValue ? option[customValue] : option.name"
      :disabled="option.disabled"
      :value="needObjFlag ? option : customValue ? option[customValue] : option.id"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['options', 'value', 'size', 'disabled', 'placeholder', 'multiple', 'filterable', 'needObjFlag', 'clearable', 'nodatatext', 'width', 'allowCreate', 'disabledOptions', 'customValue', 'index'],
  data () {
    return {
      innerOptions: null,
      filterableFlag: true
    }
  },
  created () {
    if (this.filterable === undefined) {
      this.filterableFlag = true
    } else {
      this.filterableFlag = this.filterable
    }
  },
  methods: {
    change (v) {
      if (!v) return
      this.$emit('change', v, this.index)
    },
    visibleChange (v) {
      this.$emit('visibleChange', v, this.index, this.select)
    },
    blur (v) {
      this.$emit('blur', v, this.index)
    },
    clear (v) {
      this.$emit('clear', v, this.index)
    }
  },
  computed: {
    select: {
      set (newVal) {
        this.$emit('input', newVal)
        // this.$emit('change', newVal)
      },
      get () {
        return this.value || this.value === '' ? this.value : ''
      }
    },
    computeOptions () {
      let options = this.innerOptions || this.options
      if (!options) {
        return []
      }
      return options.map(option => {
        if (!this.disabledOptions) {
          return option
        }
        let disabled = this.disabledOptions.filter(v => {
          return v.id === option.id
        })
        if (disabled.length) {
          option.disabled = true
        }
        return option
      })
    }
  }
}
</script>

