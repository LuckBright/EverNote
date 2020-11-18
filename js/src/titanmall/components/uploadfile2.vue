<!--
  组件功能：
    上传文件或者图片
  具体描述：
    支持多张图片（最多20张），如有特殊需要可传maxNum值自定义，可以灵活选择传到zimg或者ucloud，（图片目前都传zimg，文件都ucloud）；||||||||||提交后端数据可从change事件传回数组对象upload对象里面获得|||||||
  auth:
    lixiongxiong@everjiankang.com
  demo：
    <upload-file @success="uploadSuccess" @change="fileList" listType="picture-card" only="true"  cardOnly="true"></upload-file>
  props :
    'value': 可传回显数据，直接传'509a7cab863eb25cbf551a21b1834a5f,509a7cab863eb25cbf551a21b1834a5f,509a7cab863eb25cbf551a21b1834a5f'这种格式即可,
    'className': 自定义el-upload 样式,
    'tips': 上传提示文字,
    'type': 上传样式控制，值有square（默认正方形样式）；custom（自定样上传dom）；默认是按钮,
    'btnSize': 按钮大小,
    'btnType': 按钮样式,
    'btnTxt': 按钮文字,
    'listType': text/picture/picture-card  默认为text,
    'isMultiple': 一次性可多选文件,
    'isDrag': 是否支持拖动上传,
    'showFileList': 是否显示文件列表，默认显示,
    'fileName': 制定上传文件的名称,
    'uploadApiType': 上传服务接口类型，默认为内部ever, UCloud传 uploadApiType="ucloud"
    'previewInline': 预览列表行内显示,
    'only': 单个文件
    'maxNum': 限制上传几张
    'nomodal': 预览是否需要遮罩层
    'dataType': api需要的数据类型，1：为string，主要应用于form提交，具体看demo
    'list': 回显图片数组对象，格式为[{name: '图片名称', url: '图片回显地址'}] ，回显会默认执行一次change事件，返回有upload对象的数组
    '@success': 上传成功后触发事件
    '@success1': 上传成功后触发事件,返回未被处理的data数据
    '@before': 上传前触发事件
    'tipMsg'  uploadApiType = ucloud下使用slot=tips 自定义提示消息内容
    'beforeUploadCustomize': 在uploadApiType="ucloud"时候自定义上传拦截事件

    可以通过$refs访问组件process字段，判断是否有上传中进程，true：有；false：没有

    ###############处理上传数据直接从change返回的list中数据对象的upload对象中获取####################
    [
      // 这个是回显的数据结构
      {
        "name": "509a7cab863eb25cbf551a21b1834a5f",
        "url": "http://img.demoxht.everjiankang.com.cn/509a7cab863eb25cbf551a21b1834a5f",
        "upload": {
          "name": "509a7cab863eb25cbf551a21b1834a5f",
          "url": "http://img.demoxht.everjiankang.com.cn/509a7cab863eb25cbf551a21b1834a5f"
        },
        "uid": 1517797032859,
        "status": "success"
      },
      // 这个是新上传的数据结构
      {
        "status": "success",
        "name": "bk3.jpg",
        "size": 158454,
        "percentage": 100,
        "uid": 1517797059295,
        "raw": {
          "uid": 1517797059295
        },
        "url": "blob:http://localhost:8080/06bf0056-4396-4c4a-a91b-843852f46e5b",
        "response": "cd74bfc0c54edd541b82ae920e3f1cb0",
        "upload": {
          "name": "cd74bfc0c54edd541b82ae920e3f1cb0",
          "url": "http://img.demoxht.everjiankang.com.cn/cd74bfc0c54edd541b82ae920e3f1cb0"
        }
      }
    ]
-->
<template>
  <div class="ever-upload-box">
    <el-upload
      :class="
        cardClass +
          (type === 'square'
            ? 'square-box'
            : previewInline
            ? ' preview_inline'
            : className || '')
      "
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
      :show-file-list="
        type === 'square' ? false : !(Boolean(showFileList) ? true : false)
      "
      :name="fileName"
      :disabled="disabled"
      :limit="maxNum"
      ref="upload"
      :http-request="handleUploadImageDoc"
    >
      <slot>
        <template v-if="listType !== 'picture-card'">
          <slot name="custom" v-if="type === 'custom'"></slot>
          <template v-else-if="type === 'square'">
            <img v-if="imageUrl" :src="imageUrl" class="square-box-img"/>
            <i v-else class="el-icon-plus square-box-icon"></i>
          </template>
          <template v-else>
            <el-button :size="btnSize" :type="btnType || 'primary'">{{
              btnTxt || '点击上传'
              }}
            </el-button>
          </template>
        </template>
        <template v-else>
          <i class="el-icon-plus"></i>
        </template>
      </slot>
      <div
        slot="tip"
        class="el-upload__tip"
        v-if="uploadApiType !== 'ucloud' && tips"
      >
        {{ tipsTxt }}
      </div>
      <div slot="tip" class="alg_c" v-if="tipMsg">
        {{ uploadApiType == 'ucloud' && tipMsg }}
      </div>
    </el-upload>
    <el-dialog
      :visible.sync="previewVisible"
      class="img-preview-dialog"
      :modal="nomodal ? false : true"
      append-to-body
    >
      <img width="100%" :src="previewImageUrl" alt/>
    </el-dialog>
  </div>
</template>

<script>
  import COS from 'cos-js-sdk-v5'

  export default {
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
        headers: {
          'x-tenant-id': localStorage.getItem('TENANTID'),
          // "x-tenant-id": 5000,
          'x-access-token': localStorage.getItem('TOKEN'),
          'x-channel': 'THC-PLATFORM-MANAGEMENT',
        },
        action: '',
      }
    },
    props: [
      'userAction',
      'value',
      'className',
      'tips',
      'type',
      'btnSize',
      'btnType',
      'btnTxt',
      'listType',
      'isMultiple',
      'isDrag',
      'showFileList',
      'fileName',
      'uploadApiType',
      'previewInline',
      'only',
      'cardOnly',
      'maxNum',
      'list',
      'dataType',
      'nomodal',
      'disabled',
      'beforeUploadCustomize',
      'tipMsg',
    ],
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      tipsTxt () {
        if (this.tips || this.tips === '') {
          if (this.tips === 'true') {
            return `图片大小不能超过10M，只支持jpg、png和jpeg格式，图片数量限制在${ this.max }张以内`
          } else {
            return this.tips
          }
        } else {
          if (this.uploadApiType !== 'ucloud') {
            return `图片大小不能超过10M，只支持jpg、png和jpeg格式，图片数量限制在${ this.max }张以内`
          }
        }
      },
    },
    created () {
      this.actionUrl()
      if (this.list && this.list.length) {
        this.fileList = this.list
        this.mapFileList()
      } else {
        this.fileList = []
      }
    },
    methods: {
      actionUrl () {
        if (location.hostname.indexOf('localhost') > -1) {
          this.action =
            'https://dev4a.everjiankang.com.cn/api-ih/titan-cms/base/tencent/upload?path=mall'
        } else {
          this.action = `${ location.origin }/api-ih/titan-cms/base/tencent/upload?path=mall`
        }
      },
      handleProcess (event, file, fileList) {
        if (event.total > 0) {
          event.percent = (event.loaded / event.total) * 100
        }
        this.isProcess(fileList)
        this.$emit('process', event, file, fileList)
      },
      handleSuccess (res, file) {
        this.imageUrl = '/' + file + '/' + res.data.fileId
        let fileObj = {
          name: '/' + file + '/' + res.data.fileId,
          url: '/' + file + '/' + res.data.fileId,
        }
        if (!this.uploadApiType === 'ucloud') {
          this.mapFileList(res.data, fileObj)
        }
        this.$emit('success', fileObj)
        this.$emit('success1', res.data)
      },
      handlePreview: function (file) {
        // if (file.url) {
        //   this.previewImageUrl = file.url;
        // } else {
        //   this.previewImageUrl = file.upload.url;
        // }
        // this.previewVisible = true;
        this.$emit('preview', file)
      },
      handleRemove: function (file, fileList) {
        // 取消上传进程
        if (file.uid && this.axiosObj[file.uid]) {
          this.removeArr.push(file.uid)
          this.axiosObj[file.uid]()
          delete this.axiosObj[file.uid]
        }

        this.fileList = fileList
        this.returnFileList()
      },
      handleError: function (err, file, fileList) {
        this.$emit('error', err, file, fileList)
      },
      handleChange: function (file, fileList) {
        this.imageUrl = file.url
        if (this.only !== 'true') {
          this.fileList = fileList
          console.log('file', this.fileList)
        } else {
          // 单文件上传
          this.fileList = [ file ]
        }
      },
      beforeUpload: function (file) {
        if (this.uploadApiType !== 'ucloud') {
          const isJPG =
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png'
          const isLt10M = file.size / 1024 / 1024 < 10
          const isLen = this.fileList.length <= this.max
          if (!isJPG) {
            this.$message.error('上传图片只支持jpg、png和jpeg格式!')
          }
          if (!isLt10M) {
            this.$message.error('上传图片大小不能超过 10MB!')
          }
          if (!isLen) {
            this.$message.error(`上传图片请控制在${ this.max }张以内!`)
          }
          return isJPG && isLt10M && isLen
        } else {
          if (this.beforeUploadCustomize) return this.beforeUploadCustomize(file)
        }
        this.$emit('before', file)
      },
      mapFileList: function (file, data) {
        this.fileList.map(item => {
          if (file && data && item.uid === file.uid) {
            item.upload = data
            return item
          } else {
            if (!item.upload) {
              item.upload = {
                name: item.name,
                url: item.url,
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
              list += `,${ item.upload.name }`
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
        if (
          this.fileList.length &&
          (this.cardOnly === 'true' || this.fileList.length >= this.max)
        ) {
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
        this.process = res.indexOf(true) !== -1
      },
      setList (list) {
        if (list && list.length) {
          this.fileList = list
          this.mapFileList()
        } else {
          this.fileList = []
        }
      },

      // 自动上传
      handleUploadImageDoc (rs) {
        const _this = this
        const sdkObj = JSON.parse(localStorage.getItem('SDKOBJ'))
        const cos = new COS({
          getAuthorization: function (options, callback) {
            callback({
              TmpSecretId: sdkObj.credentials.tmpSecretId,
              TmpSecretKey: sdkObj.credentials.tmpSecretKey,
              XCosSecurityToken: sdkObj.credentials.sessionToken,
              StartTime: sdkObj.startTime,
              ExpiredTime: sdkObj.expiredTime,
            })
          },
          Domain: 'https://' + sdkObj.cdn,
        })
        let time = +new Date()
        let newTime = time.toString().slice(-3)
        let params = {
          Bucket: sdkObj.bucket,
          Region: sdkObj.region,
          Key: localStorage.getItem('TENANTID') + '/mall/' + newTime + rs.file.name,
          Body: rs.file,
          ProgressInterval: 10,
          onProgress: function (progressData) {
            let percentage = parseInt(progressData.percent * 100)
            rs.onProgress({ percent: percentage })
          },
        }
        cos.putObject(params, function (err, data) {
          if (err) {
            console.log('err', err)
          } else {
            console.log('111', data)
            _this.$emit('success1', data)
          }
        })
      },
    },
    watch: {
      maxNum (val) {
        this.max = val || 20
      },
      list: {
        handler (val) {
          this.setList(val)
        },
        deep: true,
      },
      fileList: {
        handler () {
          this.uploadLimit()
        },
        deep: true,
      },
      process (val) {
        if (!val) this.removeArr = []
      },
      value (val) {
        // 只用于回显
        if (val && !this.isSuccess) {
          if (typeof val === 'string') {
            let list = val.indexOf(',') > -1 ? val.split(',') : [ val ]
            let listArr = []
            list.forEach(item => {
              listArr.push({
                name: item,
                url:
                  this.uploadApiType !== 'ucloud'
                    ? `${ this.$ever.imgurl }${ item }`
                    : item,
              })
            })
            this.setList(listArr)
          } else if (Array.isArray(val)) {
            this.setList(
              val.map(v => {
                return {
                  name: v.name,
                  url: v.response.url,
                }
              }),
            )
          }
        }
      },
    },
  }
</script>
<style lang="less" scoped>
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

        /deep/ .el-upload-list__item-thumbnail {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }

    /deep/ .el-upload--picture-card {
      width: 147px !important;
      height: 80px !important;
      line-height: 85px;

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
      vertical-align: top;
    }

    /deep/ .el-upload-list {
      display: inline-block;
      vertical-align: middle;

      /deep/ .el-upload-list__item {
        display: inline-block;
        transition: none !important;
        width: 147px !important;
        height: 80px !important;
      }
    }
  }
</style>
