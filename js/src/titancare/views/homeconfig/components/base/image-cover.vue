<template>
  <div class="imageCover" :style="styles">
    <div class="mask">
      <div class="icons-wrap">
        <i class="el-icon-circle-close" @click="close" style="margin-right: 10px;"></i>
        <i class="el-icon-zoom-in" @click="showPreviw"></i>
      </div>
    </div>
    <slot></slot>
    <image-viewer :z-index="zIndex" :initial-index="imageIndex" v-if="showViewer" :on-close="closeViewer" :url-list="previewSrcList"/>
  </div>
</template>

<script>
import ImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: 'image-cover',
  props: {
    previewSrcList: Array,
    src: String
  },
  components: {
    ImageViewer
  },
  data () {
    return {
      zIndex: 4000,
      showViewer: false,
      styles: ''
    }
  },
  computed: {
    imageIndex () {
      let previewIndex = 0
      const srcIndex = this.previewSrcList.indexOf(this.src)
      if (srcIndex >= 0) {
        previewIndex = srcIndex
      }
      return previewIndex
    }
  },
  mounted () {
    let slot = this.$slots.default[0].elm
    let width = getComputedStyle(slot).width
    let height = getComputedStyle(slot).height
    this.styles = `width: ${width};height:${height}`
  },
  methods: {
    showPreviw () {
      this.showViewer = true
    },
    closeViewer () {
      this.showViewer = false
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less">
  .imageCover .el-image-viewer__close{
    .el-icon-circle-close{
      color: #fff;
    }
  }
</style>
<style scoped lang="less">
  .imageCover{
    position: relative;
    display: inline-block;
    &:hover{
      cursor: default;
      .mask{
        display: block;
      }
    }
    .mask{
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 300;
      color: #fff;
      .icons-wrap{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 26px;
      }
    }
  }

</style>
