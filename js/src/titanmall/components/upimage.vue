<template>
  <div class="imgs-container">
    <div
      v-if="isMany || !url"
      class="add-img"
      @click="
        () => {
          pictureDialog = true;
        }
      "
    >
      +
    </div>
    <div v-else class="img-box">
      <i
        class="img-close iconfont close-icon" @click="deletedBtn"
      >&#xe696;</i
      >
      <el-image
        class="img-container" :src="url.includes('http') ? url : imgCdn + url" :preview-src-list="imgList" fit="cover">
      </el-image>
    </div>
    <el-dialog
      class="group-img"
      title="我的图片"
      :visible.sync="pictureDialog"
      width="80%"
      append-to-body
      :lock-scroll="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <picture-group
        v-if="pictureDialog"
        ref="pictureRef"
        @choose="chooseBtn"
        :isMany="isMany"
        @close="closeDialogBtn"
      ></picture-group>
    </el-dialog>
  </div>
</template>
<script>
  import pictureGroup from './picture.group'

  export default {
    components: {
      pictureGroup,
    },
    props: {
      index: Number, // 首页上传图片的下标
      imgUrl: String, // 编辑展示数据
      isMany: Boolean, // 是否多选  是true/否false
      value: Object, // 商品发布规格值数据
    },
    data () {
      return {
        pictureDialog: false,
        url: '',
        imgList: [],
        imgCdn: localStorage.getItem('IMGCDN'),
      }
    },
    created () {
      this.url = this.imgUrl
      this.setImgCdn(this.url)
    },
    methods: {
      // 选中图片
      chooseBtn (info) {
        if (info.length) {
          this.url = [ ...info ][0]
          this.setImgCdn(this.url)
          if (!this.isMany) {
            if (this.index > -1) {
              this.$emit('addImg', this.index, this.url)
            } else {
              this.$emit('addImg', this.value, this.url)
            }
          } else {
            this.$emit('addImg', [ ...info ])
          }
        }
        this.pictureDialog = false
      },

      // 关闭弹框
      closeDialogBtn () {
        this.pictureDialog = false
      },

      // 删除图片
      deletedBtn () {
        this.url = ''
        this.imgList = []
        if (this.index > -1) {
          this.$emit('addImg', this.index, this.url)
        } else {
          this.$emit('addImg', this.value, this.url)
        }
      },

      // 设置图片Cdn
      setImgCdn (url) {
        if (!url) return
        let showImg = url.includes('http') ? url : this.imgCdn + url
        this.imgList = [ showImg ]
      },
    },
    watch: {
      imgUrl: function (n, o) {
        this.url = n
      },
    },
  }
</script>
<style lang="less" scoped>
  .imgs-container {
    .add-img {
      width: 74px;
      height: 74px;
      line-height: 74px;
      text-align: center;
      font-size: 40px;
      color: #8c939d;
      border: 1px dashed #c0ccda;
      border-radius: 10px;
      cursor: pointer;
      background: #fbfdff;

      &:hover {
        border-color: #409eff;
      }
    }

    .img-box {
      position: relative;
      border: 1px dashed #c0ccda;
      border-radius: 5px;

      .img-close {
        position: absolute;
        top: -9px;
        right: -6px;
        z-index: 1;
        cursor: pointer;
        display: none;
      }

      &:hover .img-close {
        display: block;
      }
    }

    .btn-p {
      line-height: 30px;
      padding-left: 17%;
      margin: 10px 0;
    }
  }

  .group-img /deep/ .el-dialog .el-dialog__header {
    border-bottom: 1px solid #f4f4f4;
  }

  .group-img /deep/ .el-dialog .el-dialog__body {
    padding: 0 !important;
  }
</style>
