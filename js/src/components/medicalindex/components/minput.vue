<template>
  <el-input v-if="!readonly" class="small_font" clearable v-bind="$attrs" :value="value[prop]" @input="change" placeholder="—"></el-input>
  <span class="el-input spe" v-else :style="!value[prop] ? 'color: #ccc;' : 'color: #000;'">{{value[prop] || '—'}}</span>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    },
    readonly: {
      type: Boolean
    },
    prop: String,
    index: [String, Number]
  },
  methods: {
    change (val) {
      this.$emit('change', this.prop, val, this.index)
    }
  }
}
</script>
<style scoped lang="scss">
.small_font {
  font-size: 12px;
}
.el-input{
  &.spe{
    font-size: 10px !important;
    border-bottom: 1px solid #000;
    line-height: 12px;
  }
}
</style>
