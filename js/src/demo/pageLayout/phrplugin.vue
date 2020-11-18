<!-- 患者phr数据聚合页面 by lvwenjun@everjiankang.com.cn -->
<template>
  <div class="layout_inner phrplugin">
    <el-autocomplete
      v-model="patientName"
      :fetch-suggestions="querySearchAsync"
      placeholder="请选择患者"
      clearable
      @select="handleSelect"
      @clear="reset"
    >
      <template slot-scope="{ item }">
        <el-row class="popperitem">
          <el-col :span="12">
            <label>{{item.patientName}}</label>
          </el-col>
        </el-row>
      </template>
    </el-autocomplete>
    <div class="layout_inner">
      <el-tabs v-model="activeName" @tab-click="handleClick" :key="patientId">
        <el-tab-pane label="综合视图详情" name="phr_total_detail">
          <phr-total-detail
            v-if="activeName==='phr_total_detail'"
            :patientId="patientId"
            :key="patientId"
          ></phr-total-detail>
        </el-tab-pane>
        <el-tab-pane label="诊断" name="phr_diagnosis">
          <phr-diagnosis
            v-if="activeName==='phr_diagnosis'"
            :patientId="patientId"
            :key="patientId"
          ></phr-diagnosis>
        </el-tab-pane>
        <el-tab-pane label="病历" name="phr_medical_record">
          <phr-medical-record
            v-if="activeName==='phr_medical_record'"
            :patientId="patientId"
            :key="patientId"
          ></phr-medical-record>
        </el-tab-pane>
        <el-tab-pane label="医嘱" name="phr_advice">
          <phr-advice v-if="activeName==='phr_advice'" :patientId="patientId" :key="patientId"></phr-advice>
        </el-tab-pane>
        <el-tab-pane label="检查" name="phr_jiancha">
          <jiancha v-if="activeName==='phr_jiancha'" :patientId="patientId" :key="patientId"></jiancha>
        </el-tab-pane>
        <el-tab-pane label="检验" name="phr_jianyan">
          <jianyan v-if="activeName==='phr_jianyan'" :patientId="patientId" :key="patientId"></jianyan>
        </el-tab-pane>
        <el-tab-pane label="预约" name="phr_appointment">
          <phr-appoint
            v-if="activeName==='phr_appointment'"
            :patientId="patientId"
            :key="patientId"
          ></phr-appoint>
        </el-tab-pane>
        <el-tab-pane label="病案首页" name="medical_record_home_page">
          <medical-record-index visit-id="sdsdsd" dpt-id="sss" patient-id="222"></medical-record-index>
        </el-tab-pane>
         <el-button @click="back = !back">反转</el-button>
         <el-tab-pane label="phr病案首页" name="phr_page">
          <phr-index :back="back" visit-id="IPIP2020021996JG" dpt-id="sss" patient-id="222"></phr-index>
        </el-tab-pane>
        <el-tab-pane label="体温单" name="tiwendan">
          <body-temperature></body-temperature>
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
</template>
<script>
// phr
import phrTotalDetail from '@/components/phr/phrtotaldetail'
import phrDiagnosis from '@/components/phr/phrdiagnosis'
import phrMedicalRecord from '@/components/phr/phrmedicalrecord'
import phrAdvice from '@/components/phr/phradvice'
import jiancha from '@/components/phr/jiancha'
import jianyan from '@/components/phr/jianyan'
import phrAppoint from '@/components/phr/appointment'
import phrTotalApi from '@/workspace/store/phrtotal'
import bodyTemperature from '@/demo/pageLayout/body.temperature'
// 电子病历
import medicalRecordIndex from '@/components/medicalindex/index'
import phrIndex from '@/components/medicalindex/phrindex'

export default {
  components: {
    phrTotalDetail,
    phrDiagnosis,
    phrMedicalRecord,
    phrAdvice,
    jiancha,
    jianyan,
    phrAppoint,
    medicalRecordIndex,
    phrIndex,
    bodyTemperature
  },
  data () {
    return {
      random: '',
      patientName: '',
      activeName: 'phr_page',
      patientId: '',
      patientList: [],
      back: false
    }
  },
  created () {},
  methods: {
    reset () {
      this.patientId = ''
    },
    querySearchAsync (val, cb) {
      phrTotalApi
        .getPatient({
          patientName: val,
          offset: 0,
          pagesize: 20
        })
        .then(res => {
          this.patientList = res.resultList
          cb(this.patientList)
        })
    },
    handleSelect (obj) {
      this.patientId = obj.patientId
      this.patientName = obj.patientName
    },
    getActiveName (name) {
      this.activeName = name
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>
<style lang="scss">
.phrplugin {
  padding-bottom: 0;
  .el-tabs__content {
     overflow: auto;
  }
}
</style>
<style lang="scss" scoped>
.layout_inner {
  padding-bottom: 0;
  /deep/ .el-tabs__content {
     overflow: auto;
  }
}

</style>

