<template>
  <div class="follow-patient-baseinfo" v-if="patient">
    <span class="title">姓名：</span>
    <span>{{patient.name || '--'}}</span>
    <span class="title">性别：</span>
    <span>
      <sys-value type="GBT.2261.1" :code="patient && patient.sex ? patient.sex:''"></sys-value>
    </span>
    <span class="title">年龄：</span>
    <span>{{patient.ageShowText || '--'}}</span>
    <span class="title">生日：</span>
    <span>{{patient.birthday | formatDateByExp('YYYY-MM-DD') }}</span>
    <!-- <span>
      <sys-value
        type="GBT.2261.1"
        :code="patientObj.patient && patientObj.patient.sex ? patientObj.patient.sex:''"
      ></sys-value>
    </span>-->
    <span class="title">电话：</span>
    <span>{{patient.mobile || '--'}}</span>
    <span class="title">患者档案号：</span>
    <span>{{patient.patientNumber || '--'}}</span>
  </div>
</template>
<script>
export default {
  props: ['patient', 'isOpen'],
  data () {
    return {
    }
  },
  watch: {
    'isOpen' (val) {
      if (!val) {
        Object.assign(this.patient, {})
      }
    }
  }
}
</script>
<style lang="less" scoped>
.follow-patient-baseinfo {
  margin-bottom: 15px;
  background: #eeeeee;
  height: 46px;
  line-height: 46px;
  padding: 0 20px;
  span {
    font-size: 14px;
    margin-right: 5px;
  }
  .title {
    color: #666666;
    margin-right: 0px;
  }
}
</style>

