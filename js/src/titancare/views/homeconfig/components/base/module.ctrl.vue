<template>
  <div class="form-list" style="margin-top: -1px;">
    <div class="form-item">
      <div class="form-item-left">
        <span>在小程序显示当前模块</span>
        <el-switch
          v-model="mp"
          @change="mpChange"
        >
        </el-switch>
      </div>
      <div class="form-item-right">
        <span>在H5显示当前模块</span>
        <el-switch
          v-model="H5"
          @change="h5Change"
        >
        </el-switch>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'module.ctrl',
    props: {
      showMp: Boolean,
      showH5: Boolean
    },
    data () {
      return {
        mp: this.showMp,
        H5: this.showH5
      }
    },
    methods: {
      mpChange (val) {
        this.$emit('showMpChange', val)
      },
      h5Change (val) {
        this.$emit('showH5Change', val)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/css/form-list";

</style>
