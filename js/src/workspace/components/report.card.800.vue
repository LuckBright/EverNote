<template>
  <div>
      <div v-if="report.executeChannel == '1'">
        <!-- <el-row class="er">
          <el-col class="ec4">检查项目：</el-col>
          <el-col :span="20" class="ec20">{{report.examItem}}</el-col>
        </el-row> -->
        <el-row class="er">
          <el-col class="ec4">影像表现：</el-col>
          <el-col :span="20" class="ec20" v-html='formatEnter(report.findings)'></el-col>
          <!-- report.findings -->
        </el-row>
        <el-row class="er">
          <el-col class="ec4">诊断结果：</el-col>
          <el-col :span="20" class="ec20" v-html='formatEnter(report.impression)'></el-col>
        </el-row>
        <!-- <el-row class="er">
          <el-col :span='4' class="ec4">影像链接：</el-col>
          <el-col :span='20' class="ec20"><a :href='report.imageUrl' target="_blank">{{report.imageUrl}}</a></el-col>
        </el-row>-->
        <el-row class="er">
          <el-col class="ec4">报告医生：</el-col>
          <el-col :span="20" class="ec20">{{report.reporter}}</el-col>
        </el-row>
        <el-row class="er">
          <el-col class="ec4">审核医生：</el-col>
          <el-col :span="20" class="ec20">{{report.auditor}}</el-col>
        </el-row>
        <el-row class="er">
          <el-col class="ec4">报告日期：</el-col>
          <el-col :span="20" class="ec20">{{report.releaseReportTime | formatDateByExp("YYYY-MM-DD HH:mm")}}</el-col>
        </el-row>
        <el-row class="er look">
          <el-button v-if='report.pdfReportUrl'><a :href="report.pdfReportUrl" target="_blank" style="color:#1c7bef;">查看pdf</a></el-button>
          <el-button v-if="report.attachmentUrl" style="margin-left:0px">
            <a :href="report.attachmentUrl" target="_blank">进入PACS</a>
          </el-button>
          <el-button
            style="margin-top:10px;display:block;"
            v-if="report.imageUrl && report.imageUrl.length == 1"
          >
            <a :href="report.imageUrl" target="_blank">查看影像</a>
          </el-button>
          <el-popover
            v-if="report.imageUrl && report.imageUrl.length > 1"
            style="margin-top:10px;display:block;"
            placement="bottom-start"
            trigger="hover"
          >
            <div v-for="(item,index) in report.imageUrl" :key="item.index">
              <a :href="item" target="_blank">影像{{index + 1}}</a>
            </div>
            <el-button slot="reference">查看影像</el-button>
          </el-popover>
        </el-row>
      </div>
      <div v-else-if="report.executeChannel == '2'">
        <reportCardTech :report='report'></reportCardTech>
      </div>
      <div v-else style="padding-top: 180px; text-align: center">暂无数据</div>
  </div>
</template>
<script>
import { isJsonString } from '@/util/common'
import reportCardTech from '@/workspace/components/report.card.tech.vue'
import formatEnter from '@/infusion/page/treat/format.enter.js'
export default {
  mixins: [formatEnter],
  props: ['report'],
  data () {
    return {
      isJsonString
    }
  },
  watch: {
  },
  created () {

  },
  components: {
    reportCardTech
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.er {
    line-height: 20px;
    font-size: 14px;
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
  .look{
    margin-top:10px;
  }
</style>
