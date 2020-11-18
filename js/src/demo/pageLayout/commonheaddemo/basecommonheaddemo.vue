<template>
  <div class="bg">
    <el-select v-model="pi">
      <el-option value="OfQFuxdFzeNEtVLN8nh" label="患者1"></el-option>
      <el-option value="JNtyKu9eCcRlKN7dnvS" label="患者2"></el-option>
    </el-select>
    <!--    测试phr 会员-->
<!--        <common-head code="001" visitNumber="BJOP202008055JT" patientId="JNtyKu9eCcRlKN7dnvS"></common-head>-->
<!--        <common-head code="001" visitNumber="BJOP202008057JT" patientId="cDNt0BnWBgtN3hhcq98"></common-head>-->
        <common-head code="001" visitNumber="IP20200603000054" patientId="DYysFbfFBHwP0grvmJ9"></common-head>
<!--        <common-head code="017" visitNumber="123" patientId="NpwjovMY4oOSCnThKdf"></common-head>-->
<!--        <common-head code="001" visitNumber="BJZOP202011894JT" patientId="2MoBpmNhfso9QGyBdPW"></common-head>-->
<!--    <hr>-->
    <!--    测试workbench-->
    <!--    <common-head code="003" visitNumber="AIP2019112100000022" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
<!--    <hr>-->
    <!--    测试adt-->
    <!--    <common-head code="002" visitNumber="AIP2019112100000022" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
    <!--    测试arrange-->
<!--    <common-head code="004" visitNumber="AIP2019112100000022" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
    <!--    测试medical-record-->
<!--        <common-head code="005" visitNumber="IP20200000003462" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
<!--        <common-head code="005" visitNumber="BJOP202008009JT" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
<!--    孕妇-->
<!--        <common-head code="005" visitNumber="BJOP202008055JT" patientId="JNtyKu9eCcRlKN7dnvS"></common-head>-->
<!--    儿童-->
<!--    <common-head code="005" visitNumber="BJOP202008057JT" patientId="cDNt0BnWBgtN3hhcq98"></common-head>-->
<!--    血氧异常-->
<!--    <common-head code="005" visitNumber="BJOP202008009JT" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
<!--    全属性-->
<!--    <common-head code="008" :visitNumber="vn" :patientId="pi"></common-head>-->
    <!--    测试rcm-->
<!--        <common-head code="006" visitNumber="AZIP2020022500054" patientId="5bbqm38wUKLwJliVXFj"></common-head>-->
    <!--    测试保险-->
<!--        <common-head code="007" visitNumber="AIP2019112100000022" patientId="OfQFuxdFzeNEtVLN8nh"></common-head>-->
  </div>
</template>
<script>
  import CommonHead from '@/inpatient/components/common.head.js'

  export default {
    components: {
      CommonHead
    },
    data () {
      return {
        pi: 'JNtyKu9eCcRlKN7dnvS',
        vn: 'BJOP202008055JT',
        // vn: '',
      }
    },
    watch: {
      pi: {
        handler () {
          if (this.pi === 'JNtyKu9eCcRlKN7dnvS') {
            this.vn = 'BJOP202008055JT'
          } else if (this.pi === 'OfQFuxdFzeNEtVLN8nh') {
            this.vn = 'BJOP202007985JT'
          }
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .bg {
    background-color: #ccc;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
</style>

