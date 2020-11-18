<template>
<div class="treat_file_upload">
  <techOpeartTitle v-model='dialog' title='上传报告' :patient='patient' :showBtn='false' :showClose='false'>
    <el-row class='upload_area'>
        <el-col :span='24' class="uploadkongjian">
          <upload-file2
            :key='key'
            style="verticalAlign: top"
            @success="uploadSuccess"
            uploadApiType="ucloud"
            :beforeUploadCustomize="beforeUpload"
            :show-file-list='true'
            @process='process'
          >
              <span style="" class="upload_btn">
              <i class="icon iconfont icon-shouyetianjia"></i>
              报告上传
              </span>
              <span style="fontSize: 12px;color:#999;">（文件格式为PDF,并且不大于10M）</span>
          </upload-file2>
          <slot></slot>
        </el-col>
        <el-col :span='24' v-for='(file,index) in fileLists' :key='file.uid' class="filelist">
          <span  @click='fileopen(file.fileId)' class="fliespan">
            <span class="index">{{index + 1}}</span>
            <span  style='font-size: 14px;' class="fliename">{{file.relName}}</span>
              <el-popover
              placement="right"
              width="150"
              v-model="arr[index]">
              <p>确定要删除此文件？</p>
              <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click.stop="arr[index] = false,key++">取消</el-button>
                  <el-button type="primary" size="mini" @click="dropPDF(file,index)">确定</el-button>
              </div>
              <span slot="reference" @click.stop='arr[index] = true' style="padding: 6px 10px;">
                  <i class="icon iconfont icon-delete delicon"></i>
              </span>
              </el-popover>
          </span>
        </el-col>
      <el-col :span='24' class="filelist" v-if='percent !== 0'>
        <div style="width:400px">
          <el-progress :percentage="percent"></el-progress>
        </div>
        </el-col>
    </el-row>
    <el-row class="foot">
      <el-button @click='dialog = false' type="primary" width='80px'>关闭</el-button>
    </el-row>
  </techOpeartTitle>
</div>
</template>
<script>
import api from '@/infusion/store/infusion.js'
import techOpeartTitle from './tech.opeart.title'
import { isJsonString } from '@/util/common'
export default {
  components: {
    techOpeartTitle
  },
  props: ['executeId', 'adviceid', '', 'status', 'IsEncounterByTriageId'],
  data () {
    return {
      api,
      dialog: false,
      percent: 0,
      arr: [],
      key: 0,
      dis: [],
      patient: {},
      fileLists: []
    }
  },
  watch: {
    // fileLists: {
    //   handler (val) {
    //     val.forEach((ele, index) => {
    //       this.arr[index] = false
    //     })
    //   },
    //   immediate: true
    // }
  },
  computed: {

  },
  methods: {
    async open (patient, ids) {
      this.patient = patient
      this.ids = ids
      this.dialog = true
      this.fileLists = []
      let res = await this.api.getResultByExecuteId({
        executeId: ids.join('')
      })
      console.log(res.data.pdfReportUrl)
      if (res && res.data && isJsonString(res.data.pdfReportUrl)) {
        this.fileLists = JSON.parse(res.data.pdfReportUrl)
      }
    },
    process (event, file, fileList) {
      this.percent = parseInt(event.percent)
      if (this.percent === 100) this.percent = 0
    },
    fileopen (url) {
      window.open(this.$ever.fileUrl2 + url)
    },
    uploadSuccess (file) {
      this.fileLists.push(file)
      this.fileUpload({
        identification: 1,
        changeUrl: JSON.stringify(file),
        pdfReportUrl: JSON.stringify(this.fileLists)
      })
    },
    async fileUpload ({changeUrl, pdfReportUrl, identification}) {
       // changeUrl 新增或者删除的文件路径
      let res = await this.api.editPdfReport({
        executeId: this.ids.join(''),
        executeIds: this.ids,
        pdfReportUrl: pdfReportUrl,
        operateCode: identification === 0 ? 'DELETE_FILE' : 'UPLOAD_FILE'
      })

      if (res && res.head && res.head.errCode === 0) {
        this.$notify({
          title: '成功',
          message: identification === 0 ? '文件删除成功' : '文件上传成功', // '',
          type: 'success'
        })
      }
    },
    dropPDF (file, index) {
      this.arr[index] = false
      this.fileLists.forEach((fl, index) => {
        if (fl.url === file.url) {
          this.fileLists.splice(index, 1)
        }
      })
      this.fileUpload({
        identification: 0,
        changeUrl: JSON.stringify(file),
        pdfReportUrl: JSON.stringify(this.fileLists),
      })
    },
    beforeUpload (file) {
      const isJPG = (file.type === 'application/pdf')
      const isLt = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('不可上传此类格式的文件，请重新选择上传文件')
      }
      if (!isLt) {
        this.$message.error('不可上传超过10M以上的文件')
      }
      return isJPG && isLt
    },
  }
}
</script>
<style lang="scss" scoped>
.treat_file_upload {
  .foot{
    text-align: center;
    /deep/ .el-button{
      width: 80px;
    }
  }
  .upload_area{
    padding-top:20px;
  }
  .upload_btn{
    color: #409EFF;
    font-size: 14px;
    font-weight:900;
    &[disabled]{
      cursor: not-allowed;
      color: #c0c4cc;
    }
  }
  .uploadkongjian{
    margin-bottom: 10px;
  }
  .filelist{
    cursor: pointer;
    margin-bottom: 3px;
    color: #1C7BEF;
    line-height: 30px;
    .fliespan{
      float: left;
      border-radius: 2px;
      background: #F2F2F2;
      padding: 0 15px;
      .index{
        float: left;
        padding-right: 18px;
        color: #a3a3a3;
      }
      .fliename{
        float: left;
        display: block;
        width: 300px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }
    .delicon{
      font-size: 12px;
      font-weight: 900;
      color: #999;
      vertical-align: middle;
      margin-left: 5px;
    }
  }
}
</style>
