<template>
  <div class="report-container">
    <div class="report-title">
      {{reportData.doctorAdviceContent}}报告单
    </div>
    <div class="report-base-info">
      <el-row>
        <el-col :span="5"><div class="base-info-label">姓名：</div><div class="base-info-text" :title="patientData.patientName">{{patientData.patientName}}</div></el-col>
        <el-col :span="7"><div class="base-info-label">性别：</div><div class="base-info-text" :title="patientData.genderName">{{patientData.genderName}}</div></el-col>
        <el-col :span="6"><div class="base-info-label">年龄：</div><div class="base-info-text" :title="patientData.birthday">{{patientData.birthday | birthdayComputed}}</div></el-col>
        <el-col :span="6"><div class="base-info-label">病人ID：</div><div class="base-info-text" :title="$route.query.patientId">{{$route.query.patientId}}</div></el-col>
        <el-col :span="5"><div class="base-info-label">申请科室：</div><div class="base-info-text" :title="reportData.examineApplyTenantSubjectName">{{reportData.examineApplyTenantSubjectName}}</div></el-col>
        <el-col :span="7"><div class="base-info-label">检查项目：</div><div class="base-info-text" :title="reportData.doctorAdviceContent">{{reportData.doctorAdviceContent}}</div></el-col>
        <el-col :span="6"><div class="base-info-label">检查部位：</div><div class="base-info-text" :title="reportData.operationPositionName">{{reportData.operationPositionName}}</div></el-col>
        <el-col :span="6"><div class="base-info-label">检查ID：</div><div class="base-info-text" :title="reportData.examineResult.examineId">{{reportData.examineResult.examineId}}</div></el-col>
      </el-row>
    </div>
    <div class="report-main-info">
      <div class="report-main-item">
        <div class="report-main-label">
          检查所见：
        </div>
        <div class="report-main-text">
          {{reportData.examineResult.examineFinding}}
        </div>
      </div>
      <div class="report-main-item">
        <div class="report-main-label">
          检查印象：
        </div>
        <div class="report-main-text">
          {{reportData.examineResult.examineImpression}}
        </div>
      </div>
    </div>
    <div class="report-bottom-info">
      <el-row>
        <el-col :span="10"><div class="base-info-label">报告日期：</div><div class="base-info-text" :title="'张三'">{{$moment(reportData.examineResult.examineReportDate).format('YYYY-MM-DD')}}</div></el-col>
        <el-col :span="7"><div class="base-info-label">报告医生：</div><div class="base-info-text" :title="'张三'">{{reportData.examineResult.reportDoctorSignature	}}</div></el-col>
        <el-col :span="7"><div class="base-info-label">审核医生：</div><div class="base-info-text" :title="'张三'">{{reportData.examineResult.reportReviewDoctorSignature}}</div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {request} from '@/util/req'
import urls from '@/phr/api/urls'

export default {
  props: {
    reportData: {
      type: [Object, String],
      default: () => {}
    }
  },
  data () {
    return {
      patientData: {}
    }
  },
  created () {
    this.getPatientData()
  },
  methods: {
    getPatientData () {
      request(urls.archives, {
        patientId: this.$route.query.patientId
      }).then((res) => {
        console.log(res)
        if (res.head.errCode === 0) {
          this.patientData = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  @import  '../../../../assets/less/report-common.less';
</style>
