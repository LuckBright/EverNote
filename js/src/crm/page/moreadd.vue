<template>
  <div id="moreadd">
    <ever-bread-crumb :name="'批量添加客户'" show-edit-fnt="false" :have-return="true"></ever-bread-crumb>
    <el-card
      v-loading="loading2"
      element-loading-text="拼命上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <h4>第一步：下载文件模版</h4>
      <el-row>
        <el-col :span="24">
          <p>请按文件模版中的格式整理数据，否则会上传失败。</p>
          <p>文件模版：<a :href="api.turl + 'template.xlsx'">客户数据模版.xlsx <el-button>下载</el-button></a></p>
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
            <upload-file2
              ref="upload"
              @success="postAvatar"
              @change="fileList"
              only="true"
              accept=".xls,.xlsx"
              previewInline="true"
              uploadApiType="ucloud"
              btnTxt="点击上传"
              :beforeUploadCustomize="_beforeUploadCustomize"
            ></upload-file2>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import api from '../store/memberapi'
  export default {
    data () {
      return {
        api: api,
        loading2: false
      }
    },
    created () {
    },
    methods: {
      postAvatar (file) {
        this.loading2 = true
        this.api.importMember({'fileUrl': `${this.$ever.fileUrl}${file.url}`}).then(rs => {
          this.loading2 = false
          if (rs.head.errCode === 0) {
            this.$confirm('导入成功, 导入数据' + rs.data.totalNum + '条, 导入成功' + rs.data.successNum + '条, 信息补充' + rs.data.appendNum + '条, 导入失败' + rs.data.errorNum + '条', {
              confirmButtonText: '下载导入报告',
              showCancelButton: false,
              type: 'success',
              center: true
            }).then(() => {
              window.open(`${this.$ever.fileUrl2}${rs.data.resultPath}`, '_blank')
            })
          }
          this.$refs.upload.$refs.upload.clearFiles()
        })
      },
      fileList () {
      },
      _beforeUploadCustomize (file) {
        let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        if (!extension && !extension2) this.$message.error('上传文件只能是 xls、xlsx格式!')
      }
    }
  }
</script>
<style scoped>
.imgconatiner{width:80%;}
</style>
