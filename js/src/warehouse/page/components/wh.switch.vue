<template>
    <!-- active-icon-class="iconfont icon-chakan" -->
  <el-switch
    v-model="switchVal"
    @change="change"
    :class="{'custom-icon': showLock}"
    :disabled="disabled"
    :active-text="textList[0].name"
    :inactive-text="textList[1].name"
    :active-value="textList[0].id"
    :inactive-value="textList[1].id">
  </el-switch>
</template>

<script>
export default {
  props: ['value', 'textList', 'disabled', 'showLock'],
  methods: {
    change (v) {
      this.$emit('change', v)
    }
  },
  computed: {
    switchVal: {
      set (newVal) {
        this.$emit('input', newVal)
        this.$emit('change', newVal)
      },
      get () {
        return this.value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .custom-icon.el-switch.is-checked .el-switch__core::after {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  background: none;
  margin-top: -2px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  content: '\e790'
}
</style>
