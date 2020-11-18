<template>
  <sys-type
    clearable
    placeholder="—"
    size="mini"
    v-bind="$attrs"
    :value="value[prop]"
    @input="change"
    :use-value="true"
  ></sys-type>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    },
    prop: String,
  },
  methods: {
    change (val) {
      this.$emit('change', this.prop, val)
    }
  },
  computed: {},
  created () {},
  mounted () {},
  watch: {},
  components: {}
}
</script>
<style scoped lang="scss">
</style>
