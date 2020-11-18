<template>
  <el-date-picker
    :value-format="format"
    :format="format"
    :prefix-icon="`ss`"
    clearable
    placeholder="—"
    :value="value[prop]"
    @input="change"
    v-bind="$attrs"
    :style="{width: 'auto'}"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    prop: String,
    value: Object,
    format: String,
    index: [String, Number]
  },
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  methods: {
    change (val) {
      this.$emit('change', this.prop, val, this.index)
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
</style>
