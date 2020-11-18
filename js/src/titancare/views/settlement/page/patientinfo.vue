<template>
  <div class="patient-info">
    <span class="label-info">姓名：</span>
    <span class="value-info">{{patientinfo.patientName||'--'}}</span>
    <span class="label-info">性别：</span>
    <span
      class="value-info"
    >{{patientinfo.patientSex=== 1?'男':patientinfo.patientSex=== 2?'女':'未知'}}</span>
    <span class="label-info">手机号：</span>
    <span class="value-info">{{patientinfo.patientMobile||'--'}}</span>
    <span class="label-info">结算机构/科室：</span>
    <span class="value-info">{{patientinfo.orgName+'/'+patientinfo.deptName}}</span>
    <span class="label-info">开单医生：</span>
    <span class="value-info">{{patientinfo.doctorName||'--'}}</span>
    <span class="label-info">结算单时间：</span>
    <span class="value-info">{{patientinfo.createTime||'--'}}</span>
    <span class="label-info">结算单号：</span>
    <span class="value-info">{{patientinfo.settleCode||'--'}}</span>
    <span class="label-info">结算单金额：</span>
    <span class="value-info">{{patientinfo.totalFee | formatToFinacial}}</span>
    <span class="label-info">支付时间：</span>
    <span
      class="value-info"
    >{{patientinfo.payTradeLog&&patientinfo.payTradeLog.filter(item => item.payState === 1)[0].payTime}}</span>
    <span class="label-info">支付方式：</span>
    <span
      class="value-info"
    >{{patientinfo.payTradeLog&&patientinfo.payTradeLog.filter(item => item.payState === 1)[0].payName}}</span>
  </div>
</template>
<script>
export default {
  props: ['patientinfo']
}
</script>
<style lang="less" scoped>
.patient-info {
  margin-top: 20px;
  padding: 15px;
  background: #f0f5fa;
  span {
    display: inline-block;
  }
  .label-info {
    padding-top: 10px;
    padding-bottom: 10px;
    color: #999;
  }
  .value-info {
    padding-top: 10px;
    padding-bottom: 10px;
    color: #333;
    margin-right: 20px;
  }
}
</style>
