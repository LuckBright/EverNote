<template>
  <div class="container-box" v-if="patient">
    <div v-if="!next">
      <el-row>
        <patient-box :label="`姓名`" :content="patient.name"></patient-box>
        <patient-box :label="`出生日期`">{{patient.birthday | formatDateByExp('YYYY-MM-DD')}}</patient-box>
        <patient-box :label="`手机号`" :content="patient.mobile"></patient-box>
        <patient-box :label="`身份证`" :content="patient.idNo"></patient-box>
      </el-row>
      <el-row>
        <patient-box :label="`性别`">
          <sys-value type="GBT.2261.1" :code="patient.sex"></sys-value>
        </patient-box>
        <patient-box :label="`民族`">
          <sys-value type="GBT.3304" :code="patient.nation"></sys-value>
        </patient-box>
        <patient-box :label="`婚姻`">
          <sys-value type="GBT.2261.2" :code="patient.marry"></sys-value>
        </patient-box>
        <patient-box
          :label="`住址`"
          :content="patient.address ? JSON.parse(patient.address).addressDetail : ''"
        ></patient-box>
      </el-row>
      <el-row>
        <patient-box :label="`患者档案号`" :content="patient.patientNumber"></patient-box>
        <patient-box :label="`医保`">
          <sys-value type="THC_CRM_INSURE" :code="patient.medicalType"></sys-value>
        </patient-box>
      </el-row>
    </div>
    <div v-if="next">
      <el-row>
        <patient-box :label="`姓名`" :content="patient.name"></patient-box>
        <patient-box :label="`性别`">
          <sys-value type="GBT.2261.1" :code="patient.sex"></sys-value>
        </patient-box>
        <patient-box :label="`年龄`">
          <span>{{patient.ageShowText}}</span>
        </patient-box>
        <patient-box :label="`就诊时间`" :content="patient.comeTime || patient.treatmentTime|| patient.hospitalizedTime"></patient-box>
        <patient-box :label="`科室`" :content="patient.visitDeptName || patient.deptName || patient.visitTenantSubjectName"></patient-box>
        <patient-box :label="`诊断`" v-if="patient.allDiagnosis">
          <span
            :title="patient.allDiagnosis | formatContent"
          >{{patient.allDiagnosis | formatContent}}</span>
        </patient-box>
         <patient-box :label="`诊断`" v-else>
          <span
            :title="patient.allDiagResult | formatContent"
          >{{patient.allDiagResult | formatContent}}</span>
        </patient-box>
      </el-row>
    </div>
  </div>
</template>

<script>
import patientBox from './patientbox'
export default {
  components: {
    patientBox
  },
  props: ['obj', 'next'],
  data () {
    return {
      patient: this.obj
    }
  },
  watch: {
    obj (val) {
      this.patient = val
    }
  },
  filters: {
    formatContent (val) {
      const arr = []
      if (Array.isArray(val)) {
        val.forEach(item => {
          if (item.diseaseName) {
            arr.push(item.diseaseName)
          } else if (item.diagName) {
            arr.push(item.diagName)
          }
        })
      }
      return arr.join(',')
    }
  }
}
</script>
<style scoped lang="scss">
.container-box {
  padding: 8px;
  background-color: #f5f5f5;
  margin: 10px 0px;
  font-weight: 400;
}
</style>
