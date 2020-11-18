import { hljybCode, sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
// 黑龙江的报表
import MedicalCostYear from '@/rcm/healthcare/views/insurancecheck/medical.cost.year.vue'
import MedicalCostYearSettlement from '@/rcm/healthcare/views/insurancecheck/medical.cost.year.settlement'
import MedicalCostYearReport from '@/rcm/healthcare/views/insurancecheck/medical.cost.year.report'
import MedicalCostMouthDifPlaces from '@/rcm/healthcare/views/insurancecheck/medical.cost.mouth.dif.places'
import MedicalCostMouthDifPlacesOrg from '@/rcm/healthcare/views/insurancecheck/medical.cost.mouth.dif.places.org'
import MedicalCostMouthDifPlacesPreSettlement from '@/rcm/healthcare/views/insurancecheck/medical.cost.mouth.dif.places.pre.settlement.vue'
import MedicalCostRefusePay from '@/rcm/healthcare/views/insurancecheck/medical.cost.refuse.pay'
import MedicalFeeDeclaration from '@/rcm/healthcare/views/insurancecheck/medical.fee.declaration.vue'
import resumeDetail from '@/rcm/healthcare/views/insurancecheck/resumedetail.vue'

// 三亚的报表
// 医疗费用明细信息查询
// import medicalFeeDetail from '@/rcm/otmdiscomponent/sysqzyy-medical/medicalcheck/medicalfee-detail.vue'
// import CostAggregation from './sysqreport/costaggregation.vue'
// import CostQuery from './sysqreport/costquery.vue'
// import CostDetailQuery from './sysqreport/costdetailquery.vue'

// 山东乐陵对账报表
import sdllSettlementQuery from './sdll/settlementquery.vue'
import sdllCheckQuery from './sdll/checkquery.vue'

const thirdActiveIndex = '/hi/medicalcheck/medicalcheckreport'
const Menus = [{
  id: 'MedicalCostYear',
  name: '医保年度结算对账表',
  component: MedicalCostYear,
  include: [hljybCode]
},
{
  id: 'MedicalCostYearReport',
  name: '医疗费用年度汇总表',
  component: MedicalCostYearReport,
  include: [hljybCode]
},
{
  id: 'MedicalCostMouthDifPlaces',
  name: '省内异地就医费用月申报表',
  component: MedicalCostMouthDifPlaces,
  include: [hljybCode]
},
{
  id: 'MedicalCostMouthDifPlacesPreSettlement',
  name: '省内异地就医费用预结算表',
  component: MedicalCostMouthDifPlacesPreSettlement,
  include: [hljybCode]
},
{
  id: 'MedicalCostYearSettlement',
  name: '省内异地就医费用年结算对账表（年度）',
  component: MedicalCostYearSettlement,
  include: [hljybCode]
},
{
  id: 'MedicalCostRefusePay',
  name: '拒付（扣款）明细信息查询',
  component: MedicalCostRefusePay,
  include: [hljybCode]
},
{
  id: 'MedicalCostMouthDifPlacesOrg',
  name: '省内异地就医发生费用参保地机构信息',
  component: MedicalCostMouthDifPlacesOrg,
  include: [hljybCode]
},
{
  id: 'MedicalFeeDeclaration',
  name: '定点医疗机构医疗费用申报表',
  component: MedicalFeeDeclaration,
  include: [hljybCode]
},
{
  id: 'resumeDetail',
  name: '门诊累计消费查询',
  component: resumeDetail,
  include: [hljybCode]
},
// {
//   id: 'medicalFeeDetail',
//   name: '医疗费用明细信息查询',
//   component: medicalFeeDetail,
//   include:[sysqzyyCode]
// },
// {
//   id: 'costaggregation',
//   name: '医保医疗费信息汇总',
//   component: CostAggregation,
//   include:[sysqzyyCode]
// },
// {
//   id: 'costquery',
//   name: '医疗费信息查询',
//   component: CostQuery,
//   include:[sysqzyyCode]
// },
// {
//   id: 'costdetailquery',
//   name: '医疗费用明细信息查询',
//   component: CostDetailQuery,
//   include:[sysqzyyCode]
// }
{
  id: 'sdllSettlementQuery',
  name: '山东乐陵结算信息查询',
  custom: '结算信息查询',
  component: sdllSettlementQuery,
  include: [sdllCode]
},
{
  id: 'sdllCheckQuery',
  name: '山东乐陵对账查询',
  custom: '对账查询',
  component: sdllCheckQuery,
  include: [sdllCode]
}
]

export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
