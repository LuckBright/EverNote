<template>
  <span>
    <template v-if="type === 'doc'">
      <el-upload
        multiple
        v-model="value"
        :show-file-list="showFileList"
        :action="action"
        :headers="headers"
        :limit="limit"
        :accept="tmpAccept"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-progress="handleProgress"
        :on-remove="handleRemove"
        :on-exceed="handleExceed">
        <el-button size="small" type="primary">{{uploadTxt}}</el-button>
        <slot name="tip" v-if="tipsFlag">
          <div class="el-upload__tip">文件不能超过{{maxSize}}Mb</div>
        </slot>
      </el-upload>
    </template>
    <template v-else>
      <template v-if="limit === 1">
        <el-upload
          v-model="value"
          class="avatar-war"
          list-type="text"
          :action="action"
          :accept="tmpAccept"
          :file-list="fileList"
          :show-file-list="false"
          :headers="headers"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :on-progress="handleProgress"
          :on-exceed="handleExceed">
          <template v-if="imageUrl">
            <div class="imgWar">
              <img class="avatar" :src="imageUrl">
              <span class="handlers" v-if="handlerShow" @click="handlePictureCardPreviewSingle(imageUrl, fileList, $event)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="handlers ico1" v-if="handlerShow" @click="handleRemoveSingle(imageUrl, fileList, $event)">
                <i class="el-icon-delete"></i>
              </span>
            </div>
          </template>
          <i v-else slot="default" class="el-icon-plus"></i>
          <div slot="tip" v-if="tipsFlag" class="el-upload__tip">只能上传{{accept}}文件，且不超过{{maxSize}}Mb</div>
        </el-upload>
      </template>
      <template v-else>
        <el-upload
          multiple
          class="avatar-uploader"
          v-model="value"
          list-type="picture-card"
          :action="action"
          :headers="headers"
          :limit="limit"
          :accept="tmpAccept"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-progress="handleProgress"
          :on-remove="handleRemove"
          :on-preview="handlePictureCardPreview"
          :on-exceed="handleExceed">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="tip" v-if="tipsFlag" class="el-upload__tip">只能上传{{accept}}文件，且不超过{{maxSize}}Mb，最多上传张{{limit}}图片</div>
        </el-upload>
      </template>
      <el-dialog :visible.sync="dialogVisible" :append-to-body="appendToBody">
        <img width="100%" :src="dialogImageUrl">
      </el-dialog>
    </template>
  </span>
</template>
<script>
import upconfig from '@/components/everuploadconfig'

export default {
  mixins: [upconfig],
  props: {
    'value': {
      type: String,
      default: ''
    },
    // 多图时候图片用什么分割，只有添加反馈用#分割
    'split': {
      type: String,
      default: ','
    },
    // 多图时候的最大张数，单图时候传1
    'limit': {
      type: Number,
      default: 12
    },
    // 是否显示放大和删除操作图标
    'handlerShow': {
      type: Boolean,
      default: true
    },
    // 默认传图，传文件是为 ‘doc’
    'type': {
      type: String,
      default: 'img'
    },
    // 每个文件的最大M数
    'maxSize': {
      type: Number,
      default: 10
    },
    // 是否显示提示信息，提示信息暂不支持自定义，如果有需求，可以再扩展
    'tipsFlag': {
      type: Boolean,
      default: false
    },
    // 上传文件时候的文案
    'uploadTxt': {
      type: String,
      default: '上传'
    },
    // 可以上传的文件类型，检验报告可以支持 pngjpgpdf 等
    'accept': {
      type: String,
      default: ''
    },
    // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
    'appendToBody': {
      type: Boolean,
      default: false
    },
    // 是否显示上传文件列表
    'showFileList': {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      imageUrl: '',
      imageArr: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      process: false,
      tmpAccept: this.accept,
      unSafeFile: this.$ever.getClinicConfig().FILE_SAFE_CHECK
    }
  },
  created () {
    this.renderInitValue(this.value)
    if (this.type === 'img') {
      this.tmpAccept = '.jpg,.jpeg,.png,.bmp'
    }
  },
  watch: {
    'value' (val) {
      this.renderInitValue(val)
    }
  },
  methods: {
    // 初始化显示内容，根据后端返回的图片的字符串（单图或者多图都是一个字符串）把对应的图片显示的组件上
    renderInitValue (value) {
      if (value) {
        if (value.startsWith('data:image/')) {
          this.imageUrl = value
        } else {
          if (this.fileList.length === 0) {
            let _tmpArr = []
            value.split(this.split).forEach(item => {
              _tmpArr.push({
                url: this.$ever.fileUrl2 + item,
                name: this.$ever.fileUrl2 + item,
              })
            })
            this.fileList = _tmpArr
            this.imageUrl = this.fileList[0].url
          }
        }
      } else {
        this.imageUrl = ''
        this.fileList = []
      }
    },
    isProcess (arr) {
      let res = []
      arr.forEach(item => {
        res.push(item.percentage < 100)
      })
      this.process = (res.indexOf(true) !== -1)
    },
    handleProgress (event, file, fileList) {
      if (event.total > 0) {
        event.percent = event.loaded / event.total * 100
      }
      this.isProcess(fileList)
      this.$emit('process', event, file, fileList)
    },
    // 上传前校验，先校验文件大小，如果传了accept，文件type匹配accept格式
    beforeUpload (file) {
      // 校验文件扩展名，如果为.bat等的脚本文件无法上传 文件格式与accept内的匹配，不匹配的不允许上传
      let fileExt = ''
      if (file.name.indexOf('.') > 0) {
        fileExt = file.name.substring(file.name.indexOf('.') + 1).toLocaleLowerCase()
        if (this.unSafeFile && fileExt && this.unSafeFile.includes(fileExt)) {
          this.$message.error('存在不安全文件，请核实，文件名为: ' + file.name)
          return false
        }
      }
      if (file.size / 1024 / 1024 > this.maxSize) {
        this.$message.error('最大为' + this.maxSize + 'M，请检查上传内容的大小。')
        return false
      } else {
        if (this.tmpAccept) {
          if (!this.tmpAccept.includes(fileExt)) {
            let _msg = '图片'
            if (this.type !== 'img') {
              _msg = '文件'
            }
            this.$message.error('上传' + _msg + '的格式有问题，只能上传' + this.tmpAccept + '的格式的' + _msg + '。')
            return false
          }
        } else {
          return true
        }
      }
    },
    // 上传数量超过limit之后的提示方法
    handleExceed (file, fileList) {
      let _msg = '图片'
      if (this.type !== 'img') {
        _msg = '文件'
      }
      this.$messageTips(this, 'warning', '最多上传' + this.limit + '个' + _msg + '，请删除一些已经上传的' + _msg + '后重新上传。')
    },
    // 删除文件
    handleRemove (file, fileList) {
      let resArr = []
      fileList.forEach(item => {
        if (item.response && item.response.data) {
          resArr.push(item.response.data.fileId)
        } else {
          resArr.push(item.name)
        }
      })
      this.$emit('input', resArr.join(this.split))
    },
    // 删除文件 单图时候逻辑有变化
    handleRemoveSingle (file, fileList, e) {
      this.$emit('input', '')
      this.imageUrl = ''
      this.dialogImageUrl = ''
      this.filelist = []
      e.stopPropagation()
    },
    // 预览文件
    handlePictureCardPreview (file, filelist) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 预览文件，单图时候逻辑有变化
    handlePictureCardPreviewSingle (img, filelist, e) {
      this.dialogImageUrl = img
      this.dialogVisible = true
      e.stopPropagation()
    },
    // 上传成功的处理逻辑，单图和多图逻辑不同
    handleSuccess (response, file, fileList) {
      if (response.head.errCode !== 0) {
        this.$message.error(response.head.errMsg)
        return false
      }
      let imgArr = []
      let resArr = []
      fileList.forEach(item => {
        if (item.response && item.response.data) {
          let _tmp = {}
          _tmp.name = item.response.data.fileId
          _tmp.fileId = item.response.data.fileId
          _tmp.url = this.$ever.fileUrl + item.response.data.fileUrl
          imgArr.push(_tmp)
          resArr.push(item.response.data.fileId)
        } else {
          imgArr.push({
            name: item.name,
            fileId: item.name,
            url: item.url
          })
          resArr.push(item.name)
        }
      })
      if (this.limit === 1) {
        this.imageUrl = this.$ever.fileUrl2 + file.response.data.fileId
        this.fileList = [fileList.pop()]
        this.$emit('input', response.data.fileId)
        this.$emit('success', response.data)
      } else {
        this.imageArr = imgArr
        this.fileList = fileList
        this.$emit('input', resArr.join(this.split))
        this.$emit('success', this.imageArr)
      }
    },
  }
}
</script>
<style scoped>
.imgWar{ height: 100%;vertical-align: top}
.el-form .el-form-item .avatar-war .el-upload i {
  position: static;
  background: transparent;
  font-size: 18px;
}
.avatar-war {
  width: 100%;
  height: 100%;
}
.avatar-war /deep/ .el-upload {
  vertical-align: top;
  width: 132px;
  height: 132px;
  line-height: 132px;
  text-align: center;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}
/* .avatar-war .el-icon-plus {
  position: absolute;
  top: 50%;
  margin: -8px 0 0 -8px;
} */
.avatar-war .handlers {
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px;
  position: absolute;
  right: 3px;
  top: 3px;
}
.avatar-war .handlers.ico1 {
  top: 32px;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.isRadius .avatar-war /deep/ .el-upload {
  width: 60px;
  height: 60px;
  line-height: 60px;
  border-radius: 50%;
}
</style>
