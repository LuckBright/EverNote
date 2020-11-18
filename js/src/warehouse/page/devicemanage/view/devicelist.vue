<template>
  <div>
    <!-- <ever-bread-crumb name="终端管理" path="/warehouse/devicelist"></ever-bread-crumb> -->
    <el-tabs v-model="tpltype" @tab-click="changeTag" class="layout_inner">
      <el-tab-pane label="自助机" name="101">
        <pretemplate :visit-type="tpltype"></pretemplate>
      </el-tab-pane>
      <el-tab-pane label="大屏" name="102">
        <dpttemplate :visit-type="tpltype"></dpttemplate>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import pretemplate from './pretemplate.vue'
  import dpttemplate from './dpttemplate.vue'
  export default {
    data () {
      return {
        tpltype: this.$store.state.deviceType
      }
    },
    watch: {
    },
    methods: {
      changeTag () {
        return false
      }
    },
    components: {
      pretemplate,
      dpttemplate
    }
  }
</script>
<style lang="scss" scoped>
  .layout_inner{
    padding: 0 15px 15px;
  }
</style>

