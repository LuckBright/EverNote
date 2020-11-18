<template>
  <div class="ever-upload-box">
    <el-upload
      :class="cardClass + (type === 'square' ? 'square-box' : (previewInline ? ' preview_inline' : className || ''))"
      :action="action"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-error="handleError"
      :on-change="handleChange"
      :on-progress="handleProcess"
      :on-success="handleSuccess"
      :file-list="fileList"
      :list-type="listType"
      :multiple="Boolean(isMultiple)"
      :drag="Boolean(isDrag)"
      :show-file-list="type === 'square' ? false : !(Boolean(showFileList) ? true : false)"
      :name="fileName"
      :disabled="disabled"
      :limit="maxNum"
      :accept="accept || ''"
      ref="upload"
    >
      <!-- <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
      </div> -->
      <slot>
        <template v-if="listType !== 'picture-card'">
          <slot name="custom" v-if="type === 'custom'"></slot>
          <template v-else-if="type === 'square'">
            <img v-if="imageUrl" :src="imageUrl" class="square-box-img">
            <i v-else class="el-icon-plus square-box-icon"></i>
          </template>
          <template v-else>
            <el-button :size="btnSize" :type="btnType || 'primary'" v-if="!btnShow">{{btnTxt || '点击上传'}}</el-button>
          </template>
        </template>
        <template v-else>
          <i class="el-icon-plus"></i>
        </template>
      </slot>
      <div slot="tip" class="el-upload__tip" v-if="(uploadApiType !== 'ucloud') && tips">{{tipsTxt}}</div>
      <div slot="tip" class="alg_c" v-if="tipMsg">{{uploadApiType == 'ucloud' && tipMsg}}</div>
    </el-upload>
    <el-dialog
      :visible.sync="previewVisible"
      class="img-preview-dialog"
      :modal-append-to-body="false"
      :append-to-body="true"
      :modal="nomodal ? false : true"
    >
      <img width="100%" :src="previewImageUrl" alt :style="imgStyle">
    </el-dialog>
  </div>
</template>

<script>
import upconfig from '@/components/everuploadconfig'

export default {
  mixins: [upconfig],
  data () {
    return {
      input: '',
      fileList: [],
      imageUrl: '',
      previewVisible: false,
      previewImageUrl: '',
      cardClass: '',
      max: this.maxNum || 20,
      process: false,
      removeArr: [],
      axiosObj: {},
      isSuccess: false,
    }
  },
  /*
    coverPrev  覆盖上传
  */
  props: ['value', 'className', 'tips', 'type', 'btnSize', 'btnType', 'btnTxt', 'listType', 'isMultiple', 'isDrag', 'showFileList', 'fileName', 'uploadApiType', 'previewInline', 'only', 'cardOnly', 'maxNum', 'list', 'dataType', 'nomodal', 'disabled', 'beforeUploadCustomize', 'tipMsg', 'transfer', 'accept', 'btnDisabled', 'btnShow', 'showDialog', 'imgStyle', 'coverPrev'],
  computed: {
    tipsTxt () {
      if (this.tips || this.tips === '') {
        if (this.tips === 'true') {
          return `图片大小不能超过10M，只支持jpg、png和jpeg格式，图片数量限制在${this.max}张以内`
        } else {
          return this.tips
        }
      } else {
        if (this.uploadApiType !== 'ucloud') {
          return `图片大小不能超过10M，只支持jpg、png和jpeg格式，图片数量限制在${this.max}张以内`
        }
      }
    }
  },
  mounted () {
    if (this.list && this.list.length) {
      this.fileList = this.list
      this.mapFileList()
    } else {
      this.fileList = []
    }
  },
  methods: {
    clearFiles () {
      this.$refs.upload.clearFiles()
    },
    handleProcess (event, file, fileList) {
      if (event.total > 0) {
        event.percent = event.loaded / event.total * 100
      }
      this.isProcess(fileList)
      this.$emit('process', event, file, fileList)
    },
    handleSuccess (res, file, fileList) {
      this.imageUrl = res.data.fileUrl
      let fileObj = {
        'relName': file.name,
        'name': res.data.fileUrl,
        'url': res.data.fileUrl,
        'fileId': res.data.fileId
      }
      if (!this.uploadApiType === 'ucloud') {
        this.mapFileList(res.data, fileObj)
      }
      // 原来的逻辑有点看不懂，直接怼一个方法抛出去。
      let arr = []
      let _tmp = []
      _tmp = fileList.filter(item => {
        return item.response
      })
      _tmp.forEach(item => {
        arr.push({
          uid: item.uid,
          name: item.response.data.fileUrl,
          url: item.response.data.fileUrl
        })
      })
      this.$emit('change', arr)
      this.$emit('success', fileObj)
    },
    handlePreview: function (file) {
      if (this.listType === 'text') return // 上传文件列表为text时报错
      if (file.url) {
        this.previewImageUrl = file.url
      } else {
        this.previewImageUrl = file.upload.url
      }
      if (!this.showDialog) {
        this.previewVisible = true
      }
    },
    handleRemove: function (file, fileList) {
      // 取消上传进程
      if (file.uid && this.axiosObj[file.uid]) {
        this.removeArr.push(file.uid)
        this.axiosObj[file.uid]()
        // delete this.axiosObj[file.uid]
      }

      this.fileList = fileList
      this.returnFileList()
    },
    handleError: function (err, file, fileList) {
      this.$emit('error', err, file, fileList)
    },
    handleChange: function (file, fileList) {
      if (this.coverPrev && fileList.length > 1) fileList.splice(0, 1)
      this.imageUrl = file.url
      if (this.only !== 'true') {
        this.fileList = fileList
      } else {
        // 单文件上传
        this.fileList = [file]
      }
    },
    beforeUpload: function (file) {
      if (this.uploadApiType !== 'ucloud') {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'application/pdf' || file.type === 'image/bmp')
        const isLt10M = file.size / 1024 / 1024 < 10
        const isLen = this.fileList.length <= this.max
        if (!isJPG) {
          this.$message.error('上传图片只支持jpg、png和jpeg格式!')
        }
        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!')
        }
        if (!isLen) {
          this.$message.error(`上传图片请控制在${this.max}张以内!`)
        }
        return isJPG && isLt10M && isLen
      } else {
        if (this.beforeUploadCustomize) return this.beforeUploadCustomize(file)
        if (file.size > 1024 * 1024 * 10) {
          this.$message.error('上传文件大小不能超过 10MB!')
          return false
        }
      }
      this.$emit('before', file)
    },
    mapFileList: function (file, data) {
      this.fileList.map((item) => {
        if (file && data && item.uid === file.uid) {
          item.upload = data
          return item
        } else {
          if (!item.upload) {
            item.upload = {
              name: item.name,
              url: item.url
            }
          }
        }
      })
      this.returnFileList()
    },
    returnFileList () {
      let list = ''
      if (this.dataType === 1) {
        this.fileList.forEach((item, index) => {
          if (index > 0) {
            list += `,${item.upload.name}`
          } else {
            list = item.upload.name
          }
        })
      } else {
        list = this.fileList
      }
      this.isSuccess = true
      this.$emit('change', this.fileList)
      this.$emit('input', list)
    },
    uploadLimit: function () {
      if (this.fileList.length && (this.cardOnly === 'true' || this.fileList.length >= this.max)) {
        this.cardClass = 'card_only'
      } else {
        this.cardClass = ''
      }
    },
    isProcess (arr) {
      let res = []
      arr.forEach(item => {
        res.push(item.percentage < 100)
      })
      this.process = (res.indexOf(true) !== -1)
    },
    setList (list) {
      if (list && list.length) {
        this.fileList = list
        this.mapFileList()
      } else {
        this.fileList = []
      }
    }
  },
  watch: {
    maxNum (val) {
      this.max = val || 20
    },
    'list': {
      handler (val) {
        this.setList(val)
      },
      deep: true
    },
    'fileList': {
      handler (fileList) {
        this.uploadLimit()
      },
      deep: true
    },
    process (val) {
      if (!val) this.removeArr = []
    },
    'value' (val) {
      // 只用于回显
      if (val && !this.isSuccess) {
        if ((typeof val) === 'string') {
          let list = (val.indexOf(',') > -1) ? val.split(',') : [val]
          let listArr = []
          list.forEach(item => {
            listArr.push({
              name: item,
              url: item
            })
          })
          this.setList(listArr)
        } else if (Array.isArray(val)) {
          this.setList(val.map(v => {
            return {
              name: v.name,
              url: v.response.url
            }
          }))
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.square-box {
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    overflow: hidden;
    &:hover {
      border-color: #20a0ff;
    }
  }
}
.square-box-icon {
  font-size: 24px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.square-box-img {
  width: 130px;
  height: 130px;
  display: block;
}
.ever-upload-box {
  display: inline-block;
  /deep/ .el-upload-list--picture-card {
    /deep/ .el-upload-list__item {
      width: 130px;
      height: 130px;
      border: 1px dashed #c0ccda;
      text-align: center;
      margin: 0 15px 0 0;
      /deep/ .el-upload-list__item-thumbnail {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
      }
    }
  }
  /deep/ .el-upload--picture-card {
    width: 130px;
    height: 130px;
    line-height: 128px;
    i {
      font-size: 24px;
    }
  }
  /deep/ .card_only {
    /deep/ .el-upload.el-upload--picture-card {
      display: none;
    }
  }
  .el-upload__tip {
    padding-top: 10px;
  }
}
.el-dialog__wrapper.img-preview-dialog {
  /deep/ .el-dialog__header {
    /deep/ .el-dialog__title {
      border: none;
    }
  }
}
.preview_inline {
  /deep/ .el-upload {
    vertical-align: middle;
  }
  /deep/ .el-upload-list {
    display: inline-block;
    vertical-align: middle;
    /deep/ .el-upload-list__item {
      display: inline-block;
      width: auto;
      margin-left: 10px;
    }
  }
}
</style>
