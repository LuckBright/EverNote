<template>
  <section class="data-import layout_inner">
    <el-row>
      <el-col :span="6">
        <doc-download @downFile="downFile" :exportType="3" ref="childMethods" btnTxt="下载模板"></doc-download>
      </el-col>
      <!-- <el-col :span="6">
        <ever-upload1 v-model="templateUrl" type="doc" uploadTxt="上传模板" accept=".xls,.xlsx" @success="handleSuccess" :showFileList="false"></ever-upload1>
      </el-col> -->
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-upload
          class="upload-demo"
          v-model="value"
          :action="action"
          accept=".xlsx,.xls"
          :headers= "uploadHeader"
          name="filename"
          :file-list="fileList"
          :on-change="handleChange"
          >
          <div slot="tip" class="el-upload__tip">用于上传监管平台数据，最多上传1个excel文件</div>
          <el-button size="small" type="primary">导入数据</el-button>
        </el-upload>
      </el-col>
    </el-row>
  </section>

</template>

<script lang="js">
import diction from '@/store/common'
import { request } from '@/util/req'
export default {
  name: 'data-import',
  props: [],
  mounted () {
  },
  data () {
    return {
      value: '',
      excel: '',
      templateUrl: '',
      fileName: 'test.excel',
      action: diction.apiIh + '/titan-supervise/superviseController/excel',
      action_download: diction.apiIh + '/titan-supervise/superviseController/downloadTemplate',
      action_upload: diction.apiIh + '/titan-supervise/superviseController/uploadTemplate',
      uploadHeader: {
        'x-tenant-id': localStorage.getItem('TENANTID'),
        'x-access-token': localStorage.getItem('TOKEN')
      },
      fileList: []
    }
  },
  methods: {
    onConfirm() {
      console.log('del-')
    },
    uploadTemplate(fileId) {
      debugger
      request(this.action_upload, {
        fileId: fileId
      }).then(res => {
        if (res.head.errCode === 0) {
          this.$messageTips(this, 'success', '上传成功')
        }
      })
    },
    handleSuccess (data) {
      if (data[0] && data[0].fileId) {
        this.uploadTemplate(data[0].fileId)
      }
    },
    downFile () {
      request(this.action_download).then(res => {
        if (res.head.errCode === 0) {
          this.downUrl = this.$ever.fileUrl2 + res.data
          console.log(this.downUrl, 'downUrl')
          const tmpId = new Date().getTime()
          const a = document.createElement('a')
          a.setAttribute('id', tmpId)
          a.setAttribute('download', '')
          a.setAttribute('target', '_self')
          a.setAttribute('href', this.downUrl)
          document.body.appendChild(a)
          a.click()
          window.setTimeout(_ => {
            a.parentNode.removeChild(a)
          }, 1000)
        }
      })
    },
    handleChange(file, fileList) {
      if (fileList.length) {
        this.fileList.splice(0, 2, file)
      }
    }
  },
  computed: {

  }
}

</script>

<style scoped lang="scss">
  .data-import {
    height: 100%;
    .upload {
      display: inline-block;
    }
    .el-row {
      margin-bottom: 32px;
    }
  }
</style>
