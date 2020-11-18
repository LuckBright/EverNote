<!--
 * 吉林长春医保读卡组件
 -->
<template>
  <div class="conbox">
    <table class="tableClass">
      <tr>
        <td class="label">个人编号</td>
        <td class="content">{{medicalObj.personno}}</td>
        <td class="label">公务员标志</td>
        <td class="content">{{medicalObj.functionaryFlag == '1'?'是':'否'}}</td>
        <td class="label">本年大额支出累计</td>
        <td class="content">{{medicalObj.yearCashCumulative | formatToFinacial}}</td>
      </tr>
      <tr>
        <td class="label">单位编号</td>
        <td class="content">{{medicalObj.unitNo}}</td>
        <td class="label">保健对象标志</td>
        <td class="content">{{medicalObj.healthcareFlag == '1'?'是':'否'}}</td>
        <td class="label">本年公务员支出累计</td>
        <td class="content">{{medicalObj.functionarySubsidyCumulative | formatToFinacial}}</td>
      </tr>
      <tr>
        <td class="label">单位名称</td>
        <td class="content">{{medicalObj.unitName}}</td>
        <td class="label">特殊人员标志</td>
        <td class="content">{{medicalObj.specialPersonFlag?'是':'否'}}</td>
        <td class="label">本年甲乙类费用累计</td>
        <td class="content">{{medicalObj.aaa}}</td>
      </tr>
      <tr>
        <td class="label">姓名</td>
        <td class="content">{{medicalObj.personname}}</td>
        <td class="label">异地人员标志</td>
        <td class="content">{{medicalObj.aaa}}</td>
        <td class="label">本年门诊特病起付标准支付累计</td>
        <td class="content">{{medicalObj.seriousIllnessCumulative | formatToFinacial}}</td>
      </tr>
      <tr>
        <td class="label">性别</td>
        <td class="content">{{medicalObj.sex=='1'?'男':'女'}}</td>
        <td class="label">离休人员定点医院编码</td>
        <td class="content">{{medicalObj.retireHospital}}</td>
        <td class="label">本年公务员门诊可补助费用累计</td>
        <td class="content">{{medicalObj.functionarySubsidyCumulative | formatToFinacial}}</td>
      </tr>
      <tr>
        <td class="label">民族</td>
        <td class="content">{{medicalObj.aaa}}</td>
        <td class="label">险种信息</td>
        <td class="content">{{medicalObj.aaa}}</td>
        <td class="label">本年住院起付标准累计</td>
        <td class="content">{{medicalObj.aaa}}</td>
      </tr>
      <tr>
        <td class="label">年龄</td>
        <td class="content">{{medicalObj.aaa}}</td>
        <td class="label">年度</td>
        <td class="content">{{medicalObj.year}}</td>
        <td class="label">本年住院次数</td>
        <td class="content">{{medicalObj.yearHosTime}}</td>
      </tr>
      <tr>
        <td class="label">出生日期</td>
        <td class="content">{{medicalObj.birthday}}</td>
        <td class="label">在院状态</td>
        <td class="content">{{medicalObj.hosStatus | hosStatus}}</td>
        <td class="label">单位类型</td>
        <td class="content">{{medicalObj.aaa}}</td>
      </tr>
      <tr>
        <td class="label">社会保障卡卡号</td>
        <td class="content">{{medicalObj.medicalCardNo}}</td>
        <td class="label">账户余额</td>
        <td class="content">{{medicalObj.accountBalance | formatToFinacial}}</td>
        <td class="label">划卡次数</td>
        <td class="content">{{medicalObj.aaa}}</td>
      </tr>
      <tr>
        <td class="label">医疗待遇类别</td>
        <td class="content">{{medicalObj.aaa}}</td>
        <td class="label">本年医疗费累计</td>
        <td class="content">{{medicalObj.aaa}}</td>
        <td class="label">划卡金额</td>
        <td class="content">{{medicalObj.aaa}}</td>
      </tr>
      <tr>
        <td class="label">参保状态</td>
        <td class="content">{{medicalObj.personStatus | medicalStatus}}</td>
        <td class="label">本年帐户支出累计</td>
        <td class="content">{{medicalObj.accountPayCumulative | formatToFinacial}}</td>
        <td class="label">所属统筹区</td>
        <td class="content">{{medicalObj.overallArea | overallArea}}</td>
      </tr>
      <tr>
        <td class="label">医疗人员类别</td>
        <td class="content">{{medicalObj.treatType | personType}}</td>
        <td class="label">本年统筹支出累计</td>
        <td class="content">{{medicalObj.overallPayCumulative | formatToFinacial}}</td>
        <td class="label">工伤标志</td>
        <td class="content">{{medicalObj.aaa}}</td>
      </tr>
    </table>
  </div>
</template>
<script>
import { personType, hosStatus, overallArea, medicalStatus } from '@/rcm/otmdiscomponent/config-js/medical-regInfo-config.js'
export default {
  props: ['medicalObj'],
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
