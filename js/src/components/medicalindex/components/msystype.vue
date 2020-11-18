<template>
  <el-popover placement="bottom" width="400" trigger="click">
    <sys-type
      v-if="show"
      clearable
      placeholder="—"
      size="mini"
      v-bind="$attrs"
      :value="value[valueProp]"
      @input="change"
      :use-object="true"
    ></sys-type>
    <el-input
      @focus="show = true"
      slot="reference"
      placeholder="—"
      :value="value[valueProp]"
    ></el-input>
  </el-popover>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      valueProp: ''
    }
  },
  props: {
    value: {
      type: Object
    },
    prop: String
  },
  methods: {
    change (val) {
      const { name, code } = val
      this.$emit('change', this.prop, code)
      this.$emit('change', this.valueProp, name)
    }
  },
  computed: {},
  created () {
    this.valueProp = this.prop.substr(0, 13) + '_value'
  },
  mounted () {},
  watch: {},
  components: {}
}
</script>
<style scoped lang="scss"></style>
