<template>
  <div v-loading="loading" class="oa fanruan">
    <p class="p20">帆软报表已经停止服务，请尽快切换</p>
    <!-- <iframe
      :src="src"
      style="width: 100%; height: 100%"
      frameborder="0"
    ></iframe> -->
  </div>
</template>
<script>

export default {
  props: {
    src: [String],
  },
  data () {
    return {
      defaultStyle: '',
      loading: false
    }
  },
}
</script>
<style lang="scss" scoped>
// iframe {
//   background: #f1f1f1;
// }
// .fanruan {
//   height: calc(100vh - 114px);
//   /deep/ .layout_inner {
//     height: 100%;
//     display: flex;
//     flex-direction: column;
//     .main-head {
//       height: 40px;
//     }
//     .box-iframe {
//       flex: 1;
//       overflow: auto;
//       & > iframe {
//         height: 99% !important;
//       }
//     }
//   }
// }
</style>
