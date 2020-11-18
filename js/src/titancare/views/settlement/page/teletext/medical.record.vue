<template>
  <div class="medicalBox">
    <p>
      <b class="theme">主诉：</b>
      <span class="value-info">{{values.chiefComplaint ? values.chiefComplaint : '--'}}</span>
    </p>
    <p>
      <b class="theme">现病史：</b>
      <span
        class="value-info"
      >{{values.presentMedicalHistory ? values.presentMedicalHistory : '--'}}</span>
    </p>
    <p>
      <b class="theme">过敏史：</b>
      <span class="value-info" v-for="(item, index) in values.arrergen" :key="index">{{item}}</span>
      <br />
    </p>
    <p>
      <b class="theme">既往史：</b>
      <span class="value-info">{{values.previousHistory ? values.previousHistory : '--'}}</span>
    </p>
    <p>
      <b class="theme">辅助检查：</b>
      <span class="value-info">{{values.auxiliary ? values.auxiliary : '--'}}</span>
    </p>
    <p>
      <b class="theme">初步诊断：</b>
      <span class="value-info" v-for="(item, index) in values.diagnose" :key="index">{{item}}</span>
      <br />
    </p>
  </div>
</template>
<script>
export default {
  props: ['values']
}
</script>
<style lang='less' scoped>
.medicalBox p {
  line-height: 20px;
}
.theme {
  display: inline-block;
  width: 100px;
  line-height: 14px;
  color: #666;
  text-align: right;
}
</style>
