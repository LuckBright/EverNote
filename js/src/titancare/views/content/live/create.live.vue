<template>
  <div class="create-live">
    <p>
      <span class="span-label"
        ><span style="color: red">*</span>开播标题：</span
      >
      <el-input
        v-model="liveObj.liveTitle"
        placeholder="请输入直播标题"
        style="width: 58%"
        :maxlength="30"
        oninput="value=value.replace(/^\s*/, '')"
      ></el-input>
    </p>
    <p>
      <span class="span-label"
        ><span style="color: red">*</span>开播时间：</span
      >
      <el-date-picker
        v-model="liveObj.startTime"
        type="datetime"
        style="width: 58%"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        placeholder="选择日期时间"
      >
      </el-date-picker>
    </p>
    <p>
      <span class="span-label">直播模式：</span>
      <el-radio v-model="liveObj.liveModel" label="0">横屏</el-radio>
      <el-radio v-model="liveObj.liveModel" label="1">竖屏</el-radio>
    </p>
    <p>
      <span class="span-label">主管医院：</span>
      <span>{{ liveObj.orgName ? liveObj.orgName : '暂无' }}</span>
    </p>
    <p>
      <span class="span-label"
        ><span style="color: red">*</span>直播医生：</span
      >
      <el-tag v-if="liveObj.doctorName" style="margin-right: 20px">
        {{ liveObj.doctorName }}
      </el-tag>
      <el-button @click="doctorDialog = true">选择医生</el-button>
    </p>
    <p>
      <span class="span-label">内容简介：</span>
      <el-input
        v-model="liveObj.description"
        class="textarea"
        placeholder="请输入内容简介"
        type="textarea"
        :rows="4"
        :maxlength="500"
        oninput="value=value.replace(/^\s*/, '')"
      ></el-input>
    </p>
    <el-row>
      <el-col :span="24">
        <p class="videoImg">
          <span class="span-label fl"><span style="color: red">*</span>首页健康直播封面：</span>
          <span class="img-box">
            <el-upload
              :class="{ 'upload-img': true, 'show-upload': fileList.length }"
              :action="action"
              :headers="headers"
              list-type="picture-card"
              :limit="1"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              accept=".jpg,.png,.jpeg,.gif"
              :file-list="fileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <p class="tip cGray">建议尺寸比例702*286</p>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img width="100%" :src="liveObj.videoFaceUrl" alt="" />
            </el-dialog>
          </span>
        </p>
        <p class="videoImg">
          <span class="span-label fl" style="width:80px"><span style="color: red">*</span>直播封面：</span>
          <span class="img-box">
            <el-upload
              :class="{ 'upload-img': true, 'show-upload': fileList2.length }"
              :action="action"
              :headers="headers"
              list-type="picture-card"
              :limit="1"
              :on-success="handleAvatarSuccess2"
              :on-preview="handlePictureCardPreview2"
              :on-remove="handleRemove2"
              accept=".jpg,.png,.jpeg,.gif"
              :file-list="fileList2"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <p class="tip cGray">建议尺寸比例702*394(16:9)</p>
            <el-dialog :visible.sync="dialogVisible2" append-to-body>
              <img width="100%" :src="liveObj.livePicUrl" alt="" />
            </el-dialog>
          </span>
        </p>
      </el-col>
    </el-row>
    <el-dialog
      title="医生选择"
      width="60%"
      class="doctor-dialog"
      :visible.sync="doctorDialog"
      append-to-body
    >
      <doctor-comp ref="doctorRef"></doctor-comp>
      <p>
        <el-button type="primary" @click="getDoctorInfo">确定</el-button>
        <el-button @click="doctorDialog = false">取消</el-button>
      </p>
    </el-dialog>
  </div>
</template>
<script>
import api from '@/titancare/api/content/live'
import storage from '@/util/storage'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'
import doctorComp from './doctor.comp'
export default {
  components: {
    doctorComp
  },
  props: {
    // 直播调整传入数据
    liveInfo: Object
  },
  data () {
    return {
      liveObj: {
        streamName: '',
        startTime: '',
        orgName: '',
        doctorName: '',
        description: '',
        videoFaceUrl: '',
        tenantId: localStorage.getItem('TENANTID'),
        orgId: localStorage.getItem('CLINICID'),
        liveModel: '0'
      },
      dialogVisible: false,
      dialogVisible2: false,
      headers: {
        'x-access-token': storage.getLocalStorage('TOKEN'),
        'x-tenant-id': storage.getLocalStorage('TENANTID'),
        'x-channel': 'THC-PLATFORM-MANAGEMENT'
      },
      action: `${diction.api}${prefix.cms}base/fs/multiUpload`,
      fileList: [],
      fileList2: [],
      doctorDialog: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      }
    }
  },
  created () {
    this.getOrgInfo()
    this.liveObj = { ...this.liveObj, ...this.liveInfo }
    if (this.liveObj.videoFaceUrl) {
      this.fileList = [{ url: this.liveObj.videoFaceUrl, fileId: this.liveObj.videoFaceUrl }]
    } else {
      this.fileList = []
    }
    if (this.liveObj.livePicUrl) {
      this.fileList2 = [{ url: this.liveObj.livePicUrl, fileId: this.liveObj.livePicUrl }]
    } else {
      this.fileList2 = []
    }
  },
  methods: {
    getOrgInfo () {
      let params = {
        idList: [localStorage.getItem('CLINICID')]
      }
      api.getOrgListByConditio(params).then(rs => {
        if (!rs.errCode) {
          if (rs.data.length) {
            this.liveObj.orgName = rs.data.resultList[0].name
          } else {
            this.liveObj.orgName = ''
          }
        }
      })
    },
    handleRemove (key) {
      this.$set(this.liveObj, 'videoFaceUrl', '')
      this.fileList = []
    },
    handlePictureCardPreview (file) {
      this.$set(this.liveObj, 'videoFaceUrl', this.$ever.fileUrl2 + file.fileId)
      this.dialogVisible = true
    },
    handleAvatarSuccess (res) {
      this.$set(this.liveObj, 'videoFaceUrl', this.$ever.fileUrl2 + res.data.fileId)
      this.fileList = [{ url: this.$ever.fileUrl2 + res.data.fileId, fileId: res.data.fileId }]
    },
    handleRemove2 () {
      this.$set(this.liveObj, 'livePicUrl', '')
      this.fileList2 = []
    },
    handlePictureCardPreview2 (file) {
      this.$set(this.liveObj, 'livePicUrl', this.$ever.fileUrl2 + file.fileId)
      this.dialogVisible2 = true
    },
    handleAvatarSuccess2 (res) {
      this.$set(this.liveObj, 'livePicUrl', this.$ever.fileUrl2 + res.data.fileId)
      this.fileList2 = [{ url: this.$ever.fileUrl2 + res.data.fileId, fileId: res.data.fileId }]
    },
    /**
     * 获取医生信息
     * */
    getDoctorInfo () {
      let rowInfo = this.$refs.doctorRef.rowInfo
      this.liveObj = { ...this.liveObj, ...rowInfo }
      this.doctorDialog = false
    }
  }
}
</script>
<style lang="less" scoped>
.create-live {
  .span-label {
    display: inline-block;
    width: 175px;
    text-align: right;
    font-size: 14px;
    color: #999;
  }
  .textarea {
    width: 58%;
    vertical-align: text-top;
  }
  .img-box {
    display: inline-block;
    .upload-img {
      display: inline-block;
      margin-right: 10px;
    }
    .show-upload /deep/ .el-upload.el-upload--picture-card {
      display: none;
    }
  }
}
.doctor-dialog {
  /deep/ .el-dialog__body {
    padding: 0 20px 20px;
  }
}
.videoImg{float: left;padding-right: 40px;}
</style>
