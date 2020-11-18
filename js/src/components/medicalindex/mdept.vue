<template>
  <div>
    <ever-subject-select
      type="select"
      fields="orgSubjectCode"
      :is-block="true"
      placeholder="—"
      :value="value[prop]"
      @change="change"
    ></ever-subject-select>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    prop: String
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
      this.$emit('change', this.prop, val)
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
</style>
