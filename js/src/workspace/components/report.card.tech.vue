<template>
<div>
  <div>
    <el-row class="er">
          <el-col class="ec4">执行人：</el-col>
          <el-col :span="20" class="ec20">{{report.executeName}}</el-col>
        </el-row>
        <el-row class="er">
          <el-col class="ec4">执行时间：</el-col>
          <el-col :span="20" class="ec20">{{report.completeTime | formatDateByExp("YYYY-MM-DD HH:mm")}}</el-col>
        </el-row>
        <el-row class="er">
          <el-col class="ec4">执行科室：</el-col>
          <el-col :span="20" class="ec20">{{report.actualExecuteProviderName}}</el-col>
        </el-row>
        <el-row class="er">
          <el-col class="ec4">执行机构：</el-col>
          <el-col :span="20" class="ec20">{{report.actualExecuteOrgName}}</el-col>
        </el-row>
        <!-- <el-row class="er">
          <el-col class="ec4">记录人：</el-col>
          <el-col :span="20" class="ec20">{{report.recorderName}}</el-col>
        </el-row>
        <el-row class="er">
          <el-col class="ec4">记录时间：</el-col>
          <el-col :span="20" class="ec20">{{report.recordTime}}</el-col>
        </el-row> -->
        <el-row class="er" v-if='report.remark'>
          <el-col class="ec4">结果：</el-col>
          <el-col :span="20" class="ec20">{{report.remark}}</el-col>
        </el-row>
        <el-button
          style="margin:10px 0;display:block;float:left;marginRight:10px"
          v-if="report && report.pdfReportUrl && report.pdfReportUrl.length === 1"
        >
          <a :href="$ever.fileUrl2 + report.pdfReportUrl[0].fileId" target="_blank">查看pdf</a>
        </el-button>
        <el-popover
          v-if="report && report.pdfReportUrl && report.pdfReportUrl.length > 1"
          style="margin-top:10px;display:block;;float:left;marginRight:10px"
          placement="bottom-start"
          width="400"
          trigger="hover"
        >
          <div v-for="item in report.pdfReportUrl" :key="item.url">
            <a :href="$ever.fileUrl2 + item.fileId" target="_blank">{{item.relName}}</a>
          </div>
          <el-button slot="reference">查看pdf</el-button>
        </el-popover>
         <el-button style="margin:10px 0;display:block;;float:left;marginRight:10px" v-if='report.formDataId' @click='ereport(report.formDataId,report.formTemplateId)'>报告预览</el-button>
  </div>
  <reporte ref='reporte'></reporte>
</div>
</template>
<script>
import reporte from '@/workspace/components/report.e.vue'
export default {
  props: ['report'],
  data () {
    return {

    }
  },
  created () {

  },
  components: {
    reporte
  },
  methods: {
    ereport (formDataId, formTemplateId) {
      this.$refs.reporte.open(formDataId, formTemplateId)
    }
  }
}
</script>

<style lang="scss" scoped>
.er {
  line-height: 25px;
  .ec4 {
    color: #000;
    font-weight: 600;
    width: auto;
  }
  .ec20 {
    color: #666;
    text-align: left;
  }
}
</style>

