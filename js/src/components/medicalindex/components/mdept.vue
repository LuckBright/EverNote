<template>
  <div>
    <ever-subject-select
      ref='dept'
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
      if (this.$refs.dept && Array.isArray(this.$refs.dept.viewList)) {
        const arr = this.$refs.dept.viewList
        arr.map(item => {
          if (item.id === val) {
            val = {
              name: item.orgSubjectName,
              code: item.orgSubjectCode
            }
          }
        })
      }
      this.$emit('change', this.prop, val)
    }
  },
  components: {}
}
</script>
<style scoped lang="scss">
</style>
