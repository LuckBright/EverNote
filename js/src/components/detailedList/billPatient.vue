<template>
  <div class="patientMessage" :style="{fontFamily: 'Microsoft YaHei'}">
    <div :style="Object.assign(style.div, {fontSize: fontSize ? '12px' : '9px', height: fontSize ? '20px' : '14px', marginTop: fontSize ? '2px' : '0px'})" style="margin-top: 2px">
      <!-- <span style="padding-left: 5px">{{birthday | formatDateByExp('YYYY-MM-DD')}}</span> -->
      <strong style="min-width: 45px;display: inline-block;" :style="{fontSize: fontSize ? '16px' : '12px'}">{{name}}</strong>
      <!-- （{{birthday | birthdayComputed}}） -->
      <span>（{{sex | formatSex}}）{{birthday | formatDateByExp('YYYY-MM-DD')}}</span>
    </div>
    <div v-if="patientNumber && isPatientNumber != 'off'" :style="{fontSize: fontSize ? '12px' : '9px', lineHeight: fontSize ? '14px' : '12px'}">患者档案号：{{patientNumber}}
    </div>
    <!-- <div v-else :style="style.p.all">病案号：
      <span v-if="patientOrg">{{patientOrg.patientNumber}}</span>
      <span v-else-if="visitSn">{{visitSn}}</span>
      <span v-else>{{patientNumber}}</span>
    </div> -->
  </div>
</template>
<script>
import { billPatient } from './style'
export default {
  props: ['name', 'sex', 'birthday', 'patientNumber', 'patientOrg', 'visitSn', 'isPatientNumber', 'fontSize'],
  data () {
    return {
      printModel: this.$ever.getClinicConfig().printModel,
      style: {
        ...billPatient
      }
    }
  }
}
</script>
