<template>
  <div class="phr-container">
    <dataswitch></dataswitch>
  </div>
</template>

<script>
import dataswitch from '@/systemset/page/dataswitch/dataswitch.vue'
export default {
  name: 'index',
  components: {
    dataswitch
  }
}
</script>

<style  lang="less" scoped>
  .phr-container {
    padding: 10px;
    overflow: hidden;
    background: #fff;
    height: 100%;
    box-sizing: border-box;
  }
  .phr-container /deep/ .ever-table-wrap{
    height: calc(~"100vh - 200px");
  }
</style>
