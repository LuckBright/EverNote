<template>
  <div class="layout_inner">
    <div>
      <span class="strong">患者创建档案协议</span>
      <span>说明：本设置用于患者在小程序创建文档时同意的协议，最多支持2个（格式为pdf文档）</span>
      <p v-for="(item, i) in memberAgreements" :key="i">
        <el-input v-model.trim="item.name" style="width: 150px" :minlength="2" :maxlength="20"></el-input>
        <span class="go-span" @click="open(item.url)">{{item.sourceName}}</span>
        <el-button type="text" @click="deleteClick(1, i)">删除</el-button>
      </p>
      <el-upload
        class="upload-demo"
        accept="application/pdf"
        list-type="text"
        :action="action"
        :headers="headers"
        :disabled="flag || loading"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary" plain :disabled="flag">{{btnText}}</el-button>
      </el-upload>
    </div>
    <el-divider></el-divider>
    <div>
      <span class="strong">医生注册账号协议</span>
      <span>说明：本设置用于医生APP在医生注册、医生登录、医生申请认证时同意的协议，最多支持2个（格式为pdf文档）</span>
      <p v-for="(item, i) in doctorAgreements" :key="i">
        <el-input v-model.trim="item.name" style="width: 150px" :minlength="2" :maxlength="20"></el-input>
        <span class="go-span" @click="open(item.url)">{{item.sourceName}}</span>
        <el-button type="text" @click="deleteClick(0, i)">删除</el-button>
      </p>
      <el-upload
        class="upload-demo"
        accept="application/pdf"
        list-type="text"
        :action="action"
        :headers="headers"
        :disabled="flag1 || loading"
        :on-success="handleDoctorSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary" plain :disabled="flag1">{{btnText}}</el-button>
      </el-upload>
    </div>
    <el-divider></el-divider>
    <div>
      <span class="strong">患者线上预约服务协议</span>
      <span>说明：本设置用于患者在小程序预约服务时同意的协议，最多支持2个（格式为pdf文档）</span>
      <p v-for="(item, i) in apptAgreements" :key="i">
        <el-input v-model.trim="item.name" style="width: 150px" :minlength="2" :maxlength="20"></el-input>
        <span class="go-span" @click="open(item.url)">{{item.sourceName}}</span>
        <el-button type="text" @click="deleteClick(2, i)">删除</el-button>
      </p>
      <el-upload
        class="upload-demo"
        accept="application/pdf"
        list-type="text"
        :action="action"
        :headers="headers"
        :disabled="flag2 || loading"
        :on-success="handleApptSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary" plain :disabled="flag2">{{btnText}}</el-button>
      </el-upload>
    </div>
    <el-divider></el-divider>
    <div>
      <span class="strong">患者在线咨询服务协议</span>
      <span>说明：本设置用于患者预约在线咨询时同意的协议，最多支持2个（格式为pdf文档）</span>
      <p v-for="(item, i) in consultAgreements" :key="i">
        <el-input v-model.trim="item.name" style="width: 150px" :minlength="2" :maxlength="20"></el-input>
        <span class="go-span" @click="open(item.url)">{{item.sourceName}}</span>
        <el-button type="text" @click="deleteClick(3, i)">删除</el-button>
      </p>
      <el-upload
        class="upload-demo"
        accept="application/pdf"
        list-type="text"
        :action="action"
        :headers="headers"
        :disabled="flag3 || loading"
        :on-success="handleOnlineSuccess"
        :before-upload="beforeUpload">
        <el-button size="small" type="primary" plain :disabled="flag3">{{btnText}}</el-button>
      </el-upload>
    </div>
    <p>
      <el-button type="primary" @click="sendBtn">保存</el-button>
    </p>
  </div>
</template>
<script>
import api from '@/titancare/api/business'
import storage from '@/util/storage'
import { diction } from '@/store/common'
import { prefix } from '@/titancare/utils/urls'

export default {
  data () {
    return {
      headers: {
        'x-access-token': storage.getLocalStorage('TOKEN'),
        'x-tenant-id': storage.getLocalStorage('TENANTID'),
        'x-channel': 'THC-PLATFORM-MANAGEMENT'
      },
      action: `${diction.apiIh}${prefix.cms}base/fs/multiUpload`,
      memberAgreements: [],
      doctorAgreements: [],
      apptAgreements: [],
      consultAgreements: [],
      loading: false,
      btnText: '上传文档协议',
    }
  },
  computed: {
    // btnText () {
    //   return this.loading ? '上传中...' : '上传文档协议'
    // },
    flag () {
      return this.memberAgreements.length >= 2
    },
    flag1 () {
      return this.doctorAgreements.length >= 2
    },
    flag2 () {
      return this.apptAgreements.length >= 2
    },
    flag3 () {
      return this.consultAgreements.length >= 2
    },
  },
  created () {
    this.getInfo()
  },
  methods: {
    // 获取数据
    getInfo () {
      api.getAppAgreementConfig().then(rs => {
        if (!rs.errCode) {
          this.doctorAgreements = rs.data.doctorAgreements || []
          this.memberAgreements = rs.data.memberAgreements || []
          this.apptAgreements = rs.data.appointmentAgreements || []
          this.consultAgreements = rs.data.consultAgreements || []
        }
      })
    },
    // 上传之前
    beforeUpload (file) {
      let isPdf = file.type === 'application/pdf'
      if (!isPdf) {
        this.$message.error('上传协议文档只能是 pdf 格式!')
      }
      this.loading = true
      return isPdf
    },
    // 患者上传
    handleAvatarSuccess (res, file) {
      let text = file.name.split('.')[0]
      let obj = {
        name: text,
        url: res.data.fileId,
        sourceName: text
      }
      this.memberAgreements.push(obj)
      this.loading = false
    },

    // 医生上传
    handleDoctorSuccess (res, file) {
      let text = file.name.split('.')[0]
      let obj = {
        name: text,
        url: res.data.fileId,
        sourceName: text
      }
      this.doctorAgreements.push(obj)
      this.loading = false
    },
    handleApptSuccess (res, file) {
      let text = file.name.split('.')[0]
      let obj = {
        name: text,
        url: res.data.fileId,
        sourceName: text
      }
      this.apptAgreements.push(obj)
      this.loading = false
    },
    handleOnlineSuccess (res, file) {
      let text = file.name.split('.')[0]
      let obj = {
        name: text,
        url: res.data.fileId,
        sourceName: text
      }
      this.consultAgreements.push(obj)
      this.loading = false
    },

    /**
     * 删除
     * type 判断是患者还是医生 1/0
     * index 下标
     * */
    deleteClick (type, index) {
      if (type === 1) {
        this.memberAgreements.splice(index, 1)
      } else if (type === 0) {
        this.doctorAgreements.splice(index, 1)
      } else if (type === 2) {
        this.apptAgreements.splice(index, 1)
      } else if (type === 3) {
        this.consultAgreements.splice(index, 1)
      }
    },
    // 保存
    sendBtn () {
      let params = {
        doctorAgreements: this.doctorAgreements,
        memberAgreements: this.memberAgreements,
        appointmentAgreements: this.apptAgreements,
        consultAgreements: this.consultAgreements,
      }
      api.createOrUpdateAppAgreementConfig(params).then(rs => {
        if (!rs.errCode) {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
        }
      })
    },
    // 打开
    open (url) {
      window.open(this.$ever.fileUrl2 + url)
    }
  }
}
</script>
<style lang="less" scoped>
  .upload-demo {
    width: 360px;
    margin: 10px 0;
    /deep/ .el-upload-list.el-upload-list--text {
      display: none;
    }
  }
  .go-span {
    display: inline-block;
    margin: 0 10px;
    cursor: pointer;
  }
  .strong {
    font-weight: bold;
  }
</style>
