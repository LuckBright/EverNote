<template>
  <div>
    <template v-if="type === 'doc'">
      <el-upload
        multiple
        v-model="value"
        :action="action"
        :accept="tmpAccept"
        :limit="limit"
        :show-file-list="true"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-exceed="handleExceed"
        :file-list="fileList">
        <el-button size="small" type="primary">{{uploadTxt}}</el-button>
        <div slot="tip" v-if="tipsFlag" class="el-upload__tip">文件不能超过{{maxSize}}Kb</div>
      </el-upload>
    </template>
    <template v-else>
      <template v-if="limit === 1">
        <el-upload
          v-model="value"
          class="avatar-war"
          list-type="text"
          :action="action"
          :headers="headers"
          :accept="tmpAccept"
          :file-list="fileList"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :on-progress="handleProgress"
          :on-exceed="handleExceed">
          <template v-if="imageUrl">
            <el-image style="width: 100%; height: 100%;" :src="imageUrl" fit="fill"></el-image>
            <span class="handlers" @click="handlePictureCardPreviewSingle(imageUrl, fileList, $event)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span class="handlers ico1" @click="handleRemoveSingle(imageUrl, fileList, $event)">
              <i class="el-icon-delete"></i>
            </span>
          </template>
          <i v-else slot="default" class="el-icon-plus"></i>
          <div slot="tip" v-if="tipsFlag" class="el-upload__tip">只能上传{{accept}}文件，且不超过{{maxSize}}Kb</div>
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
          :on-exceed="handleExceed">
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <el-image style="width: 100%; height: 100%;" :src="file.url" fit="fill"></el-image>
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file, fileList)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file, fileList)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
          <div slot="tip" v-if="tipsFlag" class="el-upload__tip">只能上传{{accept}}文件，且不超过{{maxSize}}Kb，最多上传张{{limit}}图片</div>
        </el-upload>
      </template>
      <el-dialog
        :visible.sync="dialogVisible"
        :modal-append-to-body="false"
        :append-to-body="true"
        :modal="nomodal ? false : true"
      >
        <el-image
          style="width: 100%; height: 100%;"
          :src="dialogImageUrl"
          fit="scale-down"
        >
        </el-image>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import storage from '@/util/storage'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'
export default {
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
      default: 10
    },
    // 默认传图，传文件是为 ’doc‘
    'type': {
      type: String,
      default: 'img'
    },
    // 每个文件的最大M数
    'maxSize': {
      type: Number,
      default: 200
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
    nomodal: {
      type: Boolean,
      default: false
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
      headers: {
        'x-access-token': storage.getLocalStorage('TOKEN'),
        'x-tenant-id': storage.getLocalStorage('TENANTID'),
        'x-channel': 'THC-PLATFORM-MANAGEMENT'
      },
      action: `${diction.api}${prefix.cms}base/fs/multiUpload`
    }
  },
  created () {
    this.renderInitValue(this.value)
    if (this.type === 'img') {
      this.tmpAccept = '.jpg,jpeg,.png,.bmp'
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
      this.imageUrl = ''
      this.fileList = []
      if (value) {
        if (this.fileList.length === 0) {
          let _tmpArr = []
          value.split(this.split).forEach(item => {
            _tmpArr.push({
              url: item,
              name: item
            })
          })
          this.fileList = _tmpArr
          this.imageUrl = this.fileList[0].url
        }
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
      if (file.size / 1024 > this.maxSize) {
        this.$message.error('最大为' + this.maxSize + 'K，请检查上传内容的大小。')
        return false
      } else {
        if (this.tmpAccept) {
          if (!this.tmpAccept.includes(file.type.substring(file.type.indexOf('/') + 1))) {
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
      this.fileList = this.fileList.filter(item => {
        return item.name !== file.name
      })
      let resArr = []
      this.fileList.forEach(item => {
        if (item.response && item.response.data) {
          resArr.push(`${this.$ever.filePath}${item.response.data.fileId}`)
        } else {
          resArr.push(`${item.fileId}`)
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
    handlePictureCardPreview (file, filelist, e) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      e.stopPropagation()
    },
    // 预览文件，单图时候逻辑有变化
    handlePictureCardPreviewSingle (img, filelist, e) {
      this.dialogImageUrl = img
      this.dialogVisible = true
      e.stopPropagation()
    },
    // 上传成功的处理逻辑，单图和多图逻辑不同
    handleSuccess (response, file, fileList) {
      let imgArr = []
      let resArr = []
      fileList.forEach(item => {
        if (item.response && item.response.data) {
          let _tmp = {}
          _tmp.name = item.response.data.fileId
          _tmp.fileId = this.$ever.filePath + item.response.data.fileId
          _tmp.url = this.$ever.filePath + item.response.data.fileId
          imgArr.push(_tmp)
          resArr.push(_tmp.fileId)
        } else {
          imgArr.push({
            name: item.name,
            fileId: item.url,
            url: item.url
          })
          resArr.push(item.fileId)
        }
      })
      if (this.limit === 1) {
        this.imageUrl = resArr[0]
        this.fileList = [fileList.pop()]
        this.$emit('input', resArr.pop())
        this.$emit('success', [this.imageArr.pop()])
      } else {
        this.imageArr = imgArr
        this.fileList = fileList
        this.$emit('input', resArr.join(this.split))
        this.$emit('success', this.imageArr)
      }
    }
  }
}
</script>
<style scoped>
.avatar-war /deep/ .el-upload {
  vertical-align: top;
  width: 132px;
  height: 132px;
  line-height: 132px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

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
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
