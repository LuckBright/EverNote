<!--  -->
<template>
  <el-popover placement="left" width="800" height="420" trigger="click">
    <div class="title">检查流程</div>
    <div class="content">
      <div class="mb30">
        <card-info title-text="医嘱下达" icon-name="yizhuxiada" :done="true"  :showData="aboutObj.advice"></card-info>
        <arrow-text :done="true"></arrow-text>
        <card-info title-text="收费" icon-name="shoufei" :done="false"></card-info>
        <arrow-text :done="false"></arrow-text>
        <card-info title-text="预约" icon-name="yuyue" :done="aboutObj.reportAppointment.time"  :showData="aboutObj.reportAppointment"></card-info>
        <arrow-text  direction="bottom" :done="aboutObj.reportAppointment.time"></arrow-text>
      </div>
      <div>
        <card-info title-text="报告已审核" :done="aboutObj.reportVerify.time" icon-name="baogaoshenhe" done-text="yi" :showData="aboutObj.reportVerify"></card-info>
        <arrow-text direction="left" :done="aboutObj.reportVerify.time"></arrow-text>
        <card-info title-text="检查完成" icon-name="wancheng" un-text="wei" :done="true"  :showData="aboutObj.reportEnd"></card-info>
        <arrow-text direction="left" :done="true"></arrow-text>
        <card-info title-text="检查到检" icon-name="jianchadaojian" :done="false"></card-info>
        <arrow-text direction="top" :done="false"></arrow-text>
      </div>
    </div>
    <el-button type="primary" size="medium" slot="reference">示踪</el-button>
  </el-popover>
</template>

<script>
import cardInfo from './card'
import arrowText from './arrow'

export default {
  props: {
    reportData: {
      type: [Object, String],
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  computed: {
    aboutObj () {
      return {
        advice: {
          user: this.reportData.examineApplyDoctorName,
          time: this.reportData.applicationDate,
          room: this.reportData.examineApplyTenantSubjectName,
        },
        reportEnd: {
          user: this.reportData.examineResult.examineExecuteDoctorName,
          time: this.reportData.examineResult.examineExecuteDatetime,
          room: this.reportData.examineExecuteTenantSubjectName,
        },
        reportAppointment: {
          user: this.reportData.appointmentOperatorName,
          time: this.reportData.appointmentDate,
          room: this.reportData.examineResult.examineReportTenantSubjectName,
        },
        reportVerify: {
          user: this.reportData.examineResult.reportReviewDoctorSignature,
          time: this.reportData.examineResult.reportCheckDate,
          room: this.reportData.examineResult.reportCheckDate ? this.reportData.examineResult.examineReportTenantSubjectName : '',
        },
      }
    }
  },
  components: {
    cardInfo,
    arrowText
  },
  mounted () { },

  methods: {}
}

</script>
<style lang='scss' scoped>
.btn-box {
  min-width: 836px;
  max-width: 1400px;
  margin: 0 auto 10px;
  text-align: right;
  button {
    margin-left: 10px;
  }
}
.content {
  margin-left: 58px;
}

.title {
  font-size: 16px;
  font-weight: 700;
}
.text {
  display: inline-block;
  width: 160px;
  height: 164px;
  position: relative;
  .dash {
    border-top: 1px dashed #b6b6b6;
    width: 154px;
    position: absolute;
    top: 81px;
  }
  .gery {
    color: #b6b6b6;
  }
  .arrow {
    position: absolute;
    top: -11px;
    right: -14px;
    font-size: 22px;
    color: #b6b6b6;
  }
}
.mb30 {
  margin-bottom: 30px;
}
</style>
