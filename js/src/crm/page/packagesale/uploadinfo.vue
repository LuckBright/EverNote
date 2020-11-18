<template>
  <div id="moreadd">
    <ever-bread-crumb :name="'人员导入'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card
      v-loading="loading"
      element-loading-text="拼命上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <h4>第一步：下载文件模版</h4>
      <el-row>
        <el-col :span="24">
          <p>请按文件模版中的格式整理数据，否则会上传失败。</p>
          <p>文件模版：<a :href="exportApi.turl + 'template.xlsx'">客户数据模版.xlsx <el-button>下载</el-button></a></p>
        </el-col>
      </el-row>
      <h4>第二步：按文件模版整理数据</h4>
      <el-row>
        <el-col :span="24">
          <p>请按文件模版中的格式整理数据，否则会上传失败。</p>
          <div>文件模版：
            <img :src="'' | fixImgSrc(4)" class="imgconatiner">
          </div>
        </el-col>
      </el-row>
      <h4>第三步：上传整理好的文件</h4>
      <el-row>
        <el-col :span="24">
          <p>请将整理好的文件上传到系统。</p>
          <div>
            <el-button type="primary" @click="triggerFile">点击上传</el-button>
            <input type="file" id="up-file" style="visibility:hidden;" @change="fileChange">
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import exportApi from '@/crm/store/memberapi.js'
import api from '../../store/packageapi.js'
export default {
  data () {
    return {
      api,
      exportApi,
      objId: this.$route.params.id,
      loading: false
    }
  },
  created () {
  },
  methods: {
    triggerFile () {
      document.querySelector('#up-file').click()
    },
    fileChange (file) {
      this.loading = true
      let params = new FormData()
      params.append('teamId', this.objId)
      params.append('file', file.target.files[0])
      api.importTeamDetail(params).then(rs => {
        this.loading = false
        if (rs.head.errCode === 0) {
          this.$confirm('导入成功, 导入数据' + rs.data.importMemberReqSum + '条, 导入成功' + rs.data.importPatientSuccess + '条, 导入失败' + rs.data.importMemberReqError + '条', {
            confirmButtonText: '下载导入报告',
            showCancelButton: false,
            type: 'success',
            center: true
          }).then(() => {
            api.downloadAllDetail({ successList: rs.data.successList, errorList: rs.data.errorList }).then(result => {
              window.open(`${this.$ever.fileUrl2}${rs.data.fileUrl}`, '_blank')
            })
          })
        }
      })
    },
    fileList () { }
  }
}
</script>
<style scoped>
.imgconatiner {
  width: 80%;
}
</style>
