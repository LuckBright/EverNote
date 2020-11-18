<template>
  <div style="display: inline-block">
    <!-- hack 图片预览功能 -->
      <div class="pos_re cur"><span class="pos_ab blue" style="top: 0;left: 0">{{name}}</span></div>
      <el-image
        style="width: 30px; height: 16px;"
        :style="styleProps"
        class="imgPos"
        :src="$ever.fileUrl2 + url"
        :preview-src-list="[$ever.fileUrl2 + url]">
      </el-image>
  </div>
</template>

<script>
export default {
  name: 'previewImage',
  props: {
    name: {
      type: String,
      default: '查看'
    },
    url: {
      type: String
    },
    styleProps: {
      type: Object,
    }
  }
}
</script>


<style lang="scss" scoped>
.imgPos {
  z-index: 100;
  top: 5px;
  cursor: pointer;
  /deep/ .el-image__preview, /deep/ .el-image__error {
    opacity: 0;
  }
}

</style>
