<template>
  <el-select :value="value[prop]" @change="change" placeholder="—" clearable>
    <el-option v-for="n in times" :label="n" :value="n" :key="n"></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    prop: String,
    value: Object,
    times: Number
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
.sex {
  width: 50px;
  margin-right: 2px;
}
.inline {
  display: inline-block;
}
</style>
