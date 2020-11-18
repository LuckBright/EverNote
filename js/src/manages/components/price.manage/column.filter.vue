<template>
  <el-select
  class="columnfilter"
    v-model="columns"
    multiple
    collapse-tags
    style="margin-left: 20px;"
    placeholder="请选择价格列"
    value-key="prop"
    v-bind="$attrs">
    <el-option
      v-for="item in options"
      :key="item.prop"
      :label="item.label"
      :value="item">
    </el-option>
  </el-select>
</template>
<script>
import { getPriceBaseColumns } from './price.info'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      options: [],
      columns: this.value
    }
  },
  created () {
    getPriceBaseColumns().then(res => {
      this.options = res
    })
  },
  watch: {
    value: {
      handler (val) {
        this.columns = val
      },
      deep: true
    },
    columns: {
      handler (val) {
        this.$emit('input', val)
        this.$emit('change', val)
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
.columnfilter{
  /deep/ .el-select__tags{
    max-width:max-content!important;
  }
}
</style>
