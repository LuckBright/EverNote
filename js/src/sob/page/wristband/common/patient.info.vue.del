<template>
  <div class="patient_info_wrap" v-if="inpatientInfo && inpatientInfo">
    <el-row class="c_item">
      <el-col :span="5"><label>姓名</label>：<el-tooltip popper-class="task_tips spe" effect="light" :content="inpatientInfo.patientName" placement="top-end">
        <span class="ellipsis">{{inpatientInfo.patientName}}</span></el-tooltip></el-col>
      <el-col :span="5"><label>性别</label>：<span><sys-value type="GBT.2261.1" :code="inpatientInfo.patientSex"></sys-value></span></el-col>
      <el-col :span="5"><label>年龄</label>：<span>{{inpatientInfo.patientAge}}岁</span></el-col>
      <el-col :span="9"><label>住院号</label>：<el-tooltip popper-class="task_tips spe" effect="light" :content="patient.hospitalizedNumber" placement="top-end">
                <span class="ellipsis">{{patient.hospitalizedNumber}}</span></el-tooltip></el-col>
    </el-row>
    <el-row class="c_item">
      <el-col :span="5"><label>诊断</label>：<el-tooltip popper-class="task_tips spe" effect="light" placement="top-end" v-if="inpatientInfo.hosRecDiagnosis">
        <template slot="content">
          {{inpatientInfo.hosRecDiagnosis}}
          <!--<template v-for="item,index in JSON.parse(inpatientInfo.hosRecDiagnosis)">-->
            <!--{{item.diseaseName}} {{item.position}}-->
            <!--<template v-if="JSON.parse(inpatientInfo.hosRecDiagnosis).length !== (index + 1)">，</template>-->
          <!--</template>-->
        </template>
        <span class="ellipsis">
          {{inpatientInfo.hosRecDiagnosis}}
          <!--<template v-for="item,index in JSON.parse(inpatientInfo.hosRecDiagnosis)">-->
            <!--{{item.diseaseName}} {{item.position}}-->
            <!--<template v-if="JSON.parse(inpatientInfo.hosRecDiagnosis).length !== (index + 1)">，</template>-->
          <!--</template>-->
        </span></el-tooltip></el-col>
      <el-col :span="5"><label>入院科室</label>：<span>{{inpatientInfo.providerName}}</span></el-col>
      <el-col :span="5"><label>医保</label>：<span>{{inpatientInfo.isSocialInsur === '1' ? '有' : '无'}}</span></el-col>
      <el-col :span="9"><label>门诊医生</label>：<span>{{inpatientInfo.outDoctorName}}</span></el-col>
    </el-row>
  </div>
</template>

<script>
  import api from '@/sob/store/wristband'
  export default {
    data () {
      return {
        inpatientInfo: null
      }
    },
    props: ['patient'],
    mounted () {
      this.hospitalizedSupport()
    },
    methods: {
      async hospitalizedSupport () {
        if (this.patient.hospitalizedNumber) {
          let params = {
            hospitalizedNumber: this.patient.hospitalizedNumber
          }
          const res = await api.patchPrint(params)
          if (res && res.data) {
            this.inpatientInfo = res.data
          }
        }
      }
    },
    watch: {
      'patient': {
        handler () {
          this.hospitalizedSupport()
        },
        deep: true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .patient_info_wrap{
    padding: 10px 20px;
    .c_item{
      .el-col{
        line-height: 30px;
        label{
          display: inline-block;
          width: 60px;
          color: #666;
          vertical-align: middle;
        }
        span{
          display: inline-block;
          max-width: 60%;
          color: #000;
          vertical-align: middle;
        }
        &.el-col-5{
           span{
             max-width: 40%;
           }
         }
      }
    }
  }
</style>
