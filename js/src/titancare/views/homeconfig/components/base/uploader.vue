<template>
<div>
  <el-upload
      v-model="value"
      class="avatar-war"
      :show-file-list="false"
      :action="action"
      :headers="headers"
      :accept="tmpAccept"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-progress="handleProgress"
      :on-exceed="handleExceed">
    <slot></slot>
    <div slot="tip" v-if="tipsFlag" class="el-upload__tip">只能上传{{accept}}文件，且不超过{{maxSize}}Kb</div>
  </el-upload>
</div>
</template>

<script>
import storage from '@/util/storage'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'
export default {
  name: 'uploader',
  props: {
    value: {
      type: String,
      default: ''
    },
    // 每个文件的最大kb数
    maxSize: {
      type: Number,
      default: 200
    },
    // 是否显示提示信息，提示信息暂不支持自定义，如果有需求，可以再扩展
    tipsFlag: {
      type: Boolean,
      default: false
    },
    // 可以上传的文件类型，检验报告可以支持 pngjpgpdf 等
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
  },
  data () {
    return {
      imageArr: [],
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
  methods: {
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
    handleRemove (file, fileList) {
      this.fileList = this.fileList.filter(item => {
        return item.name !== file.name
      })
      let resArr = []
      this.fileList.forEach(item => {
        if (item.response && item.response.data) {
          resArr.push(`${diction.filePath}${item.response.data.fileId}`)
        } else {
          resArr.push(`${item.fileId}`)
        }
      })
      this.$emit('input', resArr.join(this.split))
    },
    handleSuccess (response, file, fileList) {
      let imgArr = []
      let resArr = []
      fileList.forEach(item => {
        if (item.response && item.response.data) {
          let _tmp = {}
          _tmp.name = item.response.data.fileId
          _tmp.fileId = item.response.data.fileId
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
    },
    isProcess (arr) {
      let res = []
      arr.forEach(item => {
        res.push(item.percentage < 100)
      })
      this.process = (res.indexOf(true) !== -1)
    },
  }
}
</script>
