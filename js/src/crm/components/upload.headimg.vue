<template>
    <el-dialog title="上传图片" :visible.sync="dialog" @close="closeDialog"
        size="small"
        class="uploadImgWar ui_dialog_02 spe"
        :before-close="handleClose"
        :modal="uploadModal">
      <div class="ctrlBtns">
        <el-upload
          action="upload"
          :show-file-list="false"
          :http-request="postAvatar">
          <el-button @click="showUploadImg()"><i class="icon iconfont icon-PHR-Document"></i> 选择文件</el-button>
        </el-upload>
        <el-button @click="showWebCamWar()"><i class="icon iconfont icon-PHR-Camera"></i> 拍照上传</el-button>
      </div>
      <div style="overflow:hidden;">
        <div class="uploadImgView" v-if="webcamFlag">
          <webcam v-model="cropperOpt.img" :webcamFlag.sync="webcamFlag"></webcam>
        </div>
        <vueCropper
          v-if="!webcamFlag"
          ref="cropper"
          class="avatar_crop"
          :img="cropperOpt.img"
          :outputSize="cropperOpt.size"
          :outputType="cropperOpt.outputType"
          :info="cropperOpt.info"
          :canScale="cropperOpt.canScale"
          :autoCrop="cropperOpt.autoCrop"
          :fixed="cropperOpt.fixed"
          :autoCropWidth="cropperOpt.autoCropWidth"
          :autoCropHeight="cropperOpt.autoCropHeight"
          :fixedNumber="cropperOpt.fixedNumber"
          @realTime="realTime">
        </vueCropper>
        <div class="show-preview upload_crop_preview">
          <div class="preview-1">
            <img :src="previews">
          </div>
          <div class="preview-2">
            <img :src="previews">
          </div>
          <div class="preview-3">
            <img :src="previews">
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseUploadDialog()"><i class="icon iconfont icon-tijiao"></i>上传</el-button>
      </span>
    </el-dialog>
</template>
<script>
import api from '@/crm/store/memberapi'
import VueCropper from 'vue-cropper'
import webcam from '@/workspace/page/webcam'
export default {
  props: ['uploadImgType'],
  data () {
    return {
      api,
      dialog: false,
      webcamFlag: false,
      uploadModal: false,
      camURL: '',
      cropperOpt: {
        img: '',
        picValue: '',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        fixed: true,
        autoCropWidth: 210,
        autoCropHeight: 210,
        fixedNumber: [1, 1]
      },
      previews: '../../../static/assets/avtarbg.png'
    }
  },
  watch: {
    dialog (val) {
      // console.log('val:', val)
    }
  },
  methods: {
    postAvatar (file) {
      var _self = this
      var reader = new FileReader()
      reader.readAsDataURL(file.file)
      reader.onload = function () {
        _self.cropperOpt.img = reader.result
      }
    },
    showWebCamWar () {
      this.webcamFlag = true
    },
    showUploadImg (file) {
      this.webcamFlag = false
    },
    realTime (data) {
      this.$refs.cropper.getCropData((data) => {
        this.previews = data
      })
    },
    finish () {
      var _self = this
      return new Promise(resolve => {
        _self.$refs.cropper.getCropData((data) => {
          resolve(data)
        })
      })
    },
    async handleCloseUploadDialog () {
      var _self = this
      this.camURL = await _self.finish()
      api.uploadImg(this.camURL, this.uploadImgType).then(result => {
        if (result.head.errCode === 0) {
          if (this.uploadImgType === 'face') {
            if (result.data.photoId) {
              this.faceValue = result.data.photoUrl
              this.obj.facePic = this.faceValue
            } else {
              this.photoId = false
              if (!this.picValue) { // 没头像第一次人脸是头像
                this.picValue = result.data.photoUrl
              }
            }
          }
          if (this.uploadImgType === 'img') {
            this.picValue = result.data
          }
          this.dialog = false
          this.$emit('update', this.picValue)
        }
      })
    },
    beginUploadImg (imgdata, imgtype) {
      this.api.uploadImg(imgdata, imgtype).then(result => {
        if (result.head.errCode === 0) {
          if (imgtype === 'face') {
            if (result.data.photoId) {
              this.faceViewUrl = result.data.photoUrl
            } else {
              this.photoId = false
            }
            if (!this.picValue) { // 没头像第一次人脸是头像
              this.picValue = result.data.photoUrl
            }
          }
          if (imgtype === 'img') {
            this.picValue = result.data
          }
          this.dialog = false
          this.$emit('update', this.picValue)
        }
      })
    },
    closeDialog () {
      this.$emit('close', false)
    },
    handleClose () {
      this.dialog = false
    }
  },
  components: {
    VueCropper,
    webcam
  }
}
</script>
<style lang="scss" scoped>
  .uploadImgWar .uploadImgView{width: 70%; height: 300px;margin-top: 15px;float: left;background: #ddd;border: 1px solid #ddd;background: #f6f6f6;border-radius: 5px;overflow: hidden; position: relative;}
  .uploadImgWar .uploadImgView img{max-width: 100%;max-height: 100%}
  .ctrlBtns div:first-child{float: left; margin-right: 10px}
  .vue-cropper.avatar_crop{width: 70%!important; height: 300px!important;margin-top: 15px;float: left;background: #ddd!important;border: 1px solid #ddd;}
  .upload_crop_preview{float: left;margin:15px 0 0 50px!important;overflow: hidden;}
  .upload_crop_preview div{ width: 100%;height: 100%;border-radius: 50%;border: 1px solid #ddd;border-radius: 50%;margin: 0 auto 15px; }
  .upload_crop_preview div img{ width: 100%;height: 100%;border-radius: 50%; }
  .upload_crop_preview .preview-1{width: 100px;height: 100px;}
  .upload_crop_preview .preview-2{width: 80px;height: 80px;}
  .upload_crop_preview .preview-3{width: 60px;height: 60px;}
</style>

