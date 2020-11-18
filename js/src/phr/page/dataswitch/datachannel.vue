<template>
  <div class="phr-container">
    <datachannel></datachannel>
  </div>
</template>

<script>
import datachannel from '@/systemset/page/dataswitch/datachannel.vue'
export default {
  name: 'index',
  components: {
    datachannel
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
