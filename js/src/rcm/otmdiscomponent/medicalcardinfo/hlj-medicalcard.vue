<!--
 * 吉林长春医保读卡组件
 -->
<template>
  <div class="conbox">
    <table v-if="scence==0" class="tableClass">
      <tr>
        <td class="label">个人编号</td>
        <td class="content">{{medicalObj.personalNo}}</td>
        <td class="label">姓名</td>
        <td class="content">{{medicalObj.name}}</td>
        <td class="label">性别</td>
        <td class="content">{{medicalObj.sex=='1'?'男':'女'}}</td>
      </tr>
      <tr>
        <td class="label">公民身份证号</td>
        <td class="content">{{medicalObj.idCard}}</td>
        <td class="label">医疗待遇类别</td>
        <td class="content">{{medicalObj.treatmentTypeName}}</td>
        <td class="label">IC卡号</td>
        <td class="content">{{medicalObj.icCard}}</td>
      </tr>
      <tr>
        <td class="label">单位名称</td>
        <td class="content">{{medicalObj.unitName}}</td>
        <td class="label"></td>
        <td class="content"></td>
        <td class="label"></td>
        <td class="content"></td>
      </tr>
    </table>
    <table v-if="scence==1" class="tableClass">
      <tr>
        <td class="label">姓名</td>
        <td class="content">{{medicalObj.name}}</td>
        <td class="label">性别</td>
        <td class="content">{{medicalObj.sex=='1'?'男':'女'}}</td>
        <td class="label">出生日期</td>
        <td class="content">{{medicalObj.birthday}}</td>
      </tr>
      <tr>
        <td class="label">个人编号</td>
        <td class="content">{{medicalObj.personalNo}}</td>
        <td class="label">单位编号</td>
        <td class="content">{{medicalObj.unitNo}}</td>
        <td class="label">单位名称</td>
        <td class="content">{{medicalObj.unitName}}</td>
      </tr>
      <tr>
        <td class="label">公民身份证号</td>
        <td class="content">{{medicalObj.idCard}}</td>
        <td class="label">IC卡号</td>
        <td class="content">{{medicalObj.icCard}}</td>
        <td class="label">当前个人帐户余额</td>
        <td class="content">{{medicalObj.currentPersonalAccountBalance | formatToFinacial}}</td>
      </tr>
      <tr>
        <td class="label">医疗待遇类别</td>
        <td class="content">{{medicalObj.treatmentTypeName}}</td>
        <td class="label">特殊人员定点医院</td>
        <td class="content">{{medicalObj.specialPersonalSelectedHospital}}</td>
        <td class="label">本年普通门诊医保内费用累计</td>
        <td class="content">{{medicalObj.thisYearOutpatientMedicareTotalFee}}</td>
      </tr>
      <tr>
        <td class="label">本年帐户支出累计</td>
        <td class="content">{{medicalObj.thisYearPersonalAccountTotalFee | formatToFinacial}}</td>
        <td class="label">本年慢性病统筹金累计支出</td>
        <td class="content">{{medicalObj.thisYearChronicDiseaseFundTotalFee | formatToFinacial}}</td>
        <td class="label">本年特殊疾病统筹金累计支出</td>
        <td class="content">{{medicalObj.thisYearSpecialDiseaseFundTotalFee | formatToFinacial}}</td>
      </tr>
      <tr>
        <td class="label">本年住院特治统筹金累计支出</td>
        <td
          class="content"
        >{{medicalObj.thisYearInpatientSpecialTreatFundTotalFee | formatToFinacial}}</td>
        <td class="label">本年普通住院统筹金累计支出</td>
        <td class="content">{{medicalObj.thisYearInpatientFundTotalFee | formatToFinacial}}</td>
        <td class="label">本年公补（民政二次救助）累计支出</td>
        <td class="content">{{medicalObj.thisYearSubsidyTotalFee | formatToFinacial}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import { personType, hosStatus, overallArea, medicalStatus } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
export default {
  props: ['medicalObj', 'scence'],
  filters: {
    personType (val) {
      return personType[val]
    },
    hosStatus (val) {
      return hosStatus[val]
    },
    overallArea (val) {
      return overallArea[val]
    },
    medicalStatus (val) {
      val = val && (val.length >= 2 ? val : '0' + val)
      return medicalStatus[val]
    }
  },
}
</script>
<style scoped>
.conbox {
  font-size: 14px;
  line-height: 22px;
}
.conbox .tableClass {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
}
.conbox .tableClass td {
  border: 1px solid #ddd;
  width: 16.67%;
}
.conbox .tableClass td.label {
  color: #000;
  background-color: #eee;
}
.conbox .tableClass td.content {
  text-align: center;
  color: #000;
}
</style>
