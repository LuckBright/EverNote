<template>
  <span class="ever-image">
    <el-image
      v-bind="$attrs"
      :fit="fit"
      :src="localSrc"
      @error="loadError"
    ></el-image>
  </span>
</template>

<script>
const placeholder = require('../../assets/img/avatardoctor.png')
const errorImg = ''
const path = require('path')

export default {
  props: {
    fit: {
      type: String,
      default: 'cover'
    },
    placeholder: {
      type: String,
      default: placeholder
    },
    errorImg: {
      type: String,
      default: errorImg
    },
    src: String
  },
  name: 'ever-image',
  data () {
    return {
      localSrc: this._normalizeFilePath(this.src || this.placeholder)
    }
  },
  watch: {
    src (newVal) {
      if (newVal) {
        this.localSrc = newVal ? this._normalizeFilePath(newVal) : ''
      }
    }
  },
  created () {
  },
  methods: {
    loadError () {
      this.localSrc = this._normalizeFilePath(this.errorImg || this.placeholder)
    },
    _normalizeFilePath (source) {
      if (!source) return ''
      let httpReg = /^http/
      let baseReg = /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\\/?%\s]*?)\s*$/i
      if (httpReg.test(source)) { // 网络图片
        return source
      } else if (baseReg.test(source)) { // base64图片
        return source
      } else if (path.isAbsolute(source)) { // 本地图片
        return source
      } else { // 文件id
        return this.$ever.fileUrl2 + source
      }
    }
  }
}
</script>

<style scoped lang="less">
  .ever-image{
    display: inline-block;
    height: 100%;
    .el-image{
      height: 100%;
      img{
        width: 100%;
      }
    }
  }
</style>
