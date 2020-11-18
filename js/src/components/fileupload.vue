<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action=""
      :show-file-list="false"
      :before-upload="before"
      :http-request="postAvatar">
      <div class="avatar" v-if="value">
        <img :src="this.$ever.imgurl + value">
      </div>
      <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
      <el-button v-else type="default">上传</el-button>
    </el-upload>
  </div>
</template>

<script>
  import {warehouse as axios} from '@/warehouse/store/api'

  export default {
    props: ['value', 'hire'],
    data () {
      return {
      }
    },
    methods: {
      before () {

      },
      postAvatar (file) {
        var _self = this
        var reader = new FileReader()
        reader.readAsDataURL(file.file)
        reader.onload = function () {
          _self.uploadImg(reader.result)
        }
      },
      uploadImg (file) {
        let path
        if (this.hire) {
          path = 'http://api.dev.everjiankang.com.cn/thc-tenantcenter/img/uploadImg'
        } else {
          path = this.$ever.api + '/c-union/doctor/img/uploadImg'
        }
        return axios.post(path, {
          photo: file
        }).then(result => {
          this.$emit('input', result)
        })
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  img {
    width: 100%;
  }
</style>
