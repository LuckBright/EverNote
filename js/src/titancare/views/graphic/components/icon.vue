<template>
  <el-dialog
    ref="everdialog"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="600px"
    :before-close="close"
  >
    <el-form ref="form" label-width="100px" class="form">
      <el-form-item label="活动名称">
        <span class="ml20">{{configdept}}</span>
      </el-form-item>
      <el-form-item label="选择图标">
        <el-switch v-model="type" active-text="使用本地上传" inactive-text="推荐中选择" class="lml20"></el-switch>
        <div class="imgbox" v-if="!type">
          <img
            :src="$ever.fileUrl2 + item"
            alt
            v-for="(item,index) in iconList"
            :key="index"
            :class="chooseone === index?'chooseborder':''"
            @click="choose(item,index)"
          />
        </div>
        <div class="upload ever-upload-box" v-show="type">
          <el-upload
            ref="upload"
            :action="`${this.$ever.apiIh}/titan-cms/base/fs/multiUpload`"
            :headers="headers"
            :class="cardClass"
            :on-change="handleChange"
            :on-remove="handleRemove"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm()" v-if="!type">确认</el-button>
      <el-button type="primary" @click="submitForm()" v-if="type" :disabled="ctrldisabled">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { DEPTICON } from '@/titancare/utils/depturllist'
import { debounce } from '@/titancare/utils/common'
import storage from '@/util/storage'

export default {
  props: ['api', 'baseurl'],
  data () {
    return {
      iconList: DEPTICON,
      cardClass: '',
      fileList: [],
      dialogVisible: false,
      type: false,
      configdept: '',
      configKey: '', // 科室id
      configValue: '', // 科室图标传图片地址1
      chooseone: '',
      ctrldisabled: true,
      actionurl: '',
      headers: {
        'x-access-token': storage.getLocalStorage('TOKEN'),
        'x-tenant-id': storage.getLocalStorage('TENANTID'),
        'x-channel': 'THC-PLATFORM-MANAGEMENT'
      }
    }
  },
  watch: {
    'fileList': {
      handler () {
        this.uploadLimit()
      },
      deep: true
    },
    'baseurl': {
      handler (val) {
        if (val) this.actionurl = val.substring(0, val.indexOf('/thc-platform-core'))
      },
      immediate: true
    },
    'type': {
      handler (val) {
        if (!val) this.clear()
      }
    }
  },
  methods: {
    choose (item, index) {
      this.configValue = item
      this.chooseone = index
    },
    handleRemove (file) {
      if (file) {
        this.cardClass = ''
        this.ctrldisabled = true
      }
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    uploadLimit: function () {
      if (this.fileList.length && this.fileList.length >= 1) {
        this.cardClass = 'card_only'
      } else {
        this.cardClass = ''
      }
    },
    handleChange: function (file) {
      // let lastlist = []
      // fileList.map(item => {
      //   if (item.response && item.response.data && item.response.data.fileUrl) lastlist.push(item.response.data.fileUrl)
      // })
      // console.log(lastlist, '如果上传多个图片可以在这里一次性拿到所有地址')
      this.fileList = [file]
      this.configValue = file.response && file.response.data && file.response.data.fileId
      if (this.configValue) {
        this.ctrldisabled = false
      } else {
        this.ctrldisabled = true
      }
    },
    open (v) {
      this.configdept = v.tenantSubjectName
      this.configKey = v.id
      this.dialogVisible = true
    },
    close () {
      if (this.type) this.clear()
      this.chooseone = ''
      this.type = false
      this.dialogVisible = false
    },
    clear () {
      this.cardClass = ''
      this.$refs.upload.clearFiles()
    },
    submitForm: debounce(function () {
      let params = {
        configKey: this.configKey,
        configValue: this.configValue,
        type: this.$route.query.tab === 'online' ? 3 : 2,
      }
      this.api.Updateicon(params).then(rs => {
        if (rs.errCode === 0) {
          this.$notify({
            title: '成功',
            message: '更换成功',
            type: 'success'
          })
          if (this.type) this.clear()
          this.type = false
          this.chooseone = ''
          this.dialogVisible = false
          this.ctrldisabled = true
          this.$emit('seachList', true)
        }
      })
    })
  }
}
</script>

<style scoped lang="less">
.form {
  /deep/ .el-form-item {
    margin-bottom: 0px !important;
  }
}
.lml20 {
  margin-left: 20px;
}
.imgbox {
  width: 350px;
  height: 200px;
  margin-top: 10px;
  border: 1px solid #aaaaaa;
  margin-left: 20px;
  overflow-y: auto;
  img {
    float: left;
    width: 55px;
    margin-left: 12px;
    margin-top: 7px;
  }
}
.upload {
  margin-left: 20px;
  margin-top: 10px;
  width: 350px;
  height: 200px;
  // border: 1px solid #999999;
}
.ever-upload-box {
  /deep/ .card_only {
    /deep/ .el-upload.el-upload--picture-card {
      display: none;
    }
  }
}
.chooseborder {
  // border: 0.5px solid greenyellow;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
