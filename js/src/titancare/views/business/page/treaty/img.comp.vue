<template>
  <div>
    <p>
      <span>医生APP登录页面logo</span>
      <span>说明：本设置用于医生APP登录页面logo展示。格式为：png、jpg、jpeg</span>
      <el-upload
        :action="action"
        :headers="headers"
        :class="{'isShowUpload': doctorFileList.length}"
        list-type="picture-card"
        :limit="1"
        :before-upload="beforeAvatarUpload"
        :on-success="handleDoctorSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleDoctorRemove"
        :file-list="doctorFileList">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </p>
    <p>
      <span>小程序首页logo</span>
      <span>说明：本设置用于小程序首页logo展示。格式为：png、jpg、jpeg</span>
      <el-upload
        :action="action"
        :headers="headers"
        :class="{'isShowUpload': fileList.length}"
        list-type="picture-card"
        :limit="1"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :file-list="fileList">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </p>
    <p>
      <el-button type="primary" @click="sendBtn">保存</el-button>
    </p>
  </div>
</template>
<script>
import api from '@/titancare/api/business/index'
import storage from '@/util/storage'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'

export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      headers: {
        'x-access-token': storage.getLocalStorage('TOKEN'),
        'x-tenant-id': storage.getLocalStorage('TENANTID'),
        'x-channel': 'THC-PLATFORM-MANAGEMENT'
      },
      action: `${diction.api}${prefix.cms}base/fs/multiUpload`,
      doctorLogo: '',
      memberLogo: '',
      fileList: [],
      doctorFileList: []
    }
  },
  created () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      api.getAppLogoConfig().then(rs => {
        if (!rs.errCode) {
          // 小程序
          rs.data.memberLogo ? this.fileList.push({ url: `${this.$ever.fileUrl2}${rs.data.memberLogo}`, fileId: rs.data.memberLogo }) : this.fileList = []
          this.memberLogo = rs.data.memberLogo || ''

          // 医生
          rs.data.doctorLogo ? this.doctorFileList.push({ url: `${this.$ever.fileUrl2}${rs.data.doctorLogo}`, fileId: rs.data.doctorLogo }) : this.doctorFileList = []
          this.doctorLogo = rs.data.doctorLogo || ''
        }
      })
    },
    sendBtn () {
      let params = { doctorLogo: this.doctorLogo, memberLogo: this.memberLogo }
      api.createOrUpdateAppLogoConfig(params).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 医生
    handleDoctorSuccess (res) {
      this.doctorLogo = res.data.fileId
      this.doctorFileList = [{ url: `${this.$ever.fileUrl2}${res.data.fileId}`, fileId: res.data.fileId }]
    },
    handleDoctorRemove () {
      this.doctorLogo = ''
      this.doctorFileList = []
    },

    // 小程序
    handleAvatarSuccess (res) {
      this.memberLogo = res.data.fileId
      this.fileList = [{ url: `${this.$ever.fileUrl2}${res.data.fileId}`, fileId: res.data.fileId }]
    },

    handleRemove () {
      this.memberLogo = ''
      this.fileList = []
    },

    // 公用
    beforeAvatarUpload (file) {
      const isTrue = (file.type === 'image/jpeg') || (file.type === 'image/png')
      if (!isTrue) {
        this.$message.error('上传图片只支持 JPG、PNG、JPEG 格式!')
      }
      return isTrue
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
  .isShowUpload {
    margin-top: 10px;
    /deep/ .el-upload.el-upload--picture-card {
      display: none;
    }
  }
</style>
