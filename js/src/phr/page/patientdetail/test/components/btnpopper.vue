<!--  -->
<template>
  <el-popover placement="left" width="800" height="420" trigger="click">
    <div class="title">检验流程</div>
    <div class="content">
      <div class="mb30">
        <card-info title-text="医嘱下达" icon-name="yizhuxiada" :done="true" :showData="aboutObj.advice"  ></card-info>
        <arrow-text :small="true" :done="true"></arrow-text>
        <card-info title-text="收费" icon-name="shoufei" :done="false"></card-info>
        <arrow-text :small="true" :done="false"></arrow-text>
        <card-info title-text="预约" :done="false" icon-name="yuyue"></card-info>
        <arrow-text :small="true" :done="false"></arrow-text>
        <card-info title-text="标本已采集" :done="false" icon-name="biaobencaijiqianshou"></card-info>
        <arrow-text :small="true" direction="bottom" :done="false"></arrow-text>
      </div>
      <div>
        <card-info title-text="报告已审核" :done="false" icon-name="baogaoshenhe" done-text="yi"></card-info>
        <arrow-text direction="left" :done="false"></arrow-text>
        <card-info title-text="检验完成" icon-name="wancheng" un-text="wei" :done="true"  :showData="aboutObj.reportEnd"></card-info>
        <arrow-text direction="left" :done="true"></arrow-text>
        <card-info title-text="标本已签收" icon-name="biaobencaijiqianshou" :done="false"  ></card-info>
        <arrow-text direction="top" :done="false"></arrow-text>
      </div>
    </div>
    <el-button type="primary" size="medium" slot="reference">示踪</el-button>
  </el-popover>
</template>

<script>
import cardInfo from '@/phr/page/patientdetail/inspect/components/card'
import arrowText from '@/phr/page/patientdetail/inspect/components/arrow'

export default {
  props: {
    reportData: {
      type: [Object, String],
      default: () => {
        return {
          doctorAdvice: {},
          report: {}
        }
      }
    }
  },
  computed: {
    aboutObj () {
      return {
        advice: {
          user: this.reportData.doctorAdvice ? this.reportData.doctorAdvice.optUserName : '',
          time: this.reportData.doctorAdvice ? this.reportData.doctorAdvice.optTime : '',
          room: this.reportData.doctorAdvice ? this.reportData.doctorAdvice.optSubjectName : '',
        },
        reportEnd: {
          user: this.reportData.doctorAdvice ? this.reportData.report.optUserName : '',
          time: this.reportData.doctorAdvice ? this.reportData.report.optTime : '',
          room: this.reportData.doctorAdvice ? this.reportData.report.optSubjectName : '',
        },
      }
    }
  },
  data () {
    return {
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
