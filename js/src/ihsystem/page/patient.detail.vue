<template>
  <div class="patient-detail">
    <!-- 患者头部 -->
    <patient-header
      class="layout_wrap_01"
      :patientId="$route.query.patientId"
      :visitNumber="$route.query.visitNumber"
      :dptId='$route.query.providerId'
      code="019"
    ></patient-header>
    <!-- tab 写病历 开处方  -->
    <el-tabs v-model="activeName" class="patient-nav" v-if="+visitType !== 7">
      <el-tab-pane label="写病历" name="medicalRecord">
        <medicalRecord></medicalRecord>
      </el-tab-pane>
      <el-tab-pane label="开处方" name="advice">
        <advice ref="advice"></advice>
      </el-tab-pane>
    </el-tabs>
    <div v-else class="no-show">
      当前服务暂不支持写病历和开处方
    </div>
  </div>
</template>
<script>
import patientHeader from '@/inpatient/components/common.head.js'
import medicalRecord from '@/ihsystem/page/medical.record.vue'
import advice from '@/ihsystem/page/advice.ihsystem.vue'

export default {
  components: {
    patientHeader,
    medicalRecord,
    advice
  },
  data () {
    return {
      activeName: 'medicalRecord',
      visitType: this.$route.query.visitType
    }
  },
  watch: {
    activeName (val) {
      if (val === 'advice') {
        this.$refs.advice.refresh && this.$refs.advice.refresh()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .patient-detail {
    background-color: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .operate {
      flex: 1;
      overflow: auto;
    }
    .no-show {
      flex: 1;
      background-color: #f5f6f7;
      display: flex;
      align-items: center;
      justify-content: center

    }
    .patient-nav {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      /deep/ .el-tabs__nav-wrap {
        padding: 0px 10px;
        background-color: #ebedf0;
      }
      /deep/ .is-top {
        margin-bottom: 0;
      }
      /deep/ .el-tabs__content {
        flex: 1;
      }
      /deep/ .el-tab-pane {
        height: 100%;
      }
    }
  }
</style>
