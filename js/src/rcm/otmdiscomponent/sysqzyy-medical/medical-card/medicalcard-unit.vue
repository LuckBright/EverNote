<!--
 * 吉林省保读卡组件
 -->
<template>
  <ever-form2
    class="sysqzyy"
    :schema="schema"
    v-model="medicalObj"
    label-width="180px"
    :span="8"
    :nosubmit="true"
    labelPosition="left"
  >
    <template slot="nation">
      <sys-value :type="'GBT.3304'" :code="medicalObj.nation"></sys-value>
    </template>
  </ever-form2>
</template>
<script>
import { schema } from './sysqzyy-cardinfo.js'
export default {
  data () {
    return {
      schema
    }
  },
  props: ['medicalObj']
}
</script>
<style scoped>
.sysqzyy.el-form /deep/ .el-col .el-form-item {
  margin-bottom: 0;
}
.sysqzyy /deep/ .el-col .el-form-item__label {
  height: 33px;
  line-height: 16px;
  background-color: #eee;
}
.sysqzyy /deep/ .el-col {
  border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
.sysqzyy /deep/ .el-col.firstRow {
  border-top: 1px solid #ddd;
}
.sysqzyy /deep/ .el-form-item__content {
  text-align: center;
}
</style>
