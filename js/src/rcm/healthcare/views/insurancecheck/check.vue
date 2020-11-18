<template>
  <el-tabs v-model="activeName" class="flex_column_full_hidden layout_inner flex_none" type="card">
    <el-tab-pane v-for="pane in panes" :key="pane.name" :label="pane.label" :name="pane.name">
      <component :is="pane.component" :key="pane.name" v-if="activeName == pane.name"></component>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import MedicalCostYear from './medical.cost.year.vue'
import MedicalCostYearSettlement from './medical.cost.year.settlement'
import MedicalCostYearReport from './medical.cost.year.report'
import MedicalCostMouthDifPlaces from './medical.cost.mouth.dif.places'
import MedicalCostMouthDifPlacesOrg from './medical.cost.mouth.dif.places.org'
import MedicalCostMouthDifPlacesPreSettlement from './medical.cost.mouth.dif.places.pre.settlement.vue'
import MedicalCostRefusePay from './medical.cost.refuse.pay'
import MedicalFeeDeclaration from '@/rcm/healthcare/views/insurancecheck/medical.fee.declaration.vue'
import resumeDetail from '@/rcm/healthcare/views/insurancecheck/resumedetail.vue'

const reports = [{
  label: '医保年度结算对账表',
  component: MedicalCostYear
},
{
  label: '医疗费用年度汇总表',
  component: MedicalCostYearReport
},
// {
//   label: '特殊人员统筹申报表',
//   name: '3',
//   // component: Default
// },
// {
//   label: '特殊人员专科转诊统筹申报表',
//   name: '4',
//   // component: Default
// },
// {
//   label: '特殊人员统筹金年度对账表',
//   name: '5',
//   // component: Default
// },
{
  label: '省内异地就医费用月申报表',
  component: MedicalCostMouthDifPlaces
},
{
  label: '省内异地就医费用预结算表',
  component: MedicalCostMouthDifPlacesPreSettlement
},
{
  label: '省内异地就医费用年结算对账表（年度）',
  component: MedicalCostYearSettlement
},
{
  label: '拒付（扣款）明细信息查询',
  component: MedicalCostRefusePay,
},
{
  label: '省内异地就医发生费用参保地机构信息',
  component: MedicalCostMouthDifPlacesOrg,
},
{
  label: '定点医疗机构医疗费用申报表',
  component: MedicalFeeDeclaration
},
{
  label: '门诊累计消费查询',
  component: resumeDetail
}]

export default {
  data () {
    return {
      panes: reports.map((pane, index) => Object.assign(pane, { name: String(index) })),
      activeName: '0'
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
