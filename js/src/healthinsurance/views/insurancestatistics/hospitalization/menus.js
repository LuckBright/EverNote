import { jlccybCode, jlssbCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

import HosSettlementSummary from '@/healthinsurance/views/insurancestatistics/hospitalization/settlementsummary/settlementinfo.vue'
import HosSettlementList from '@/healthinsurance/views/insurancestatistics/hospitalization/settlementlist'
import PersonalHistoryInfo from '@/healthinsurance/views/insurancestatistics/hospitalization/personalhistoryinfo'
import PatientCosts from '@/healthinsurance/views/insurancestatistics/hospitalization/patientcosts'
const thirdActiveIndex = '/hi/insurancestatistics/hospitalization'
const Menus = [
  {
    id: 'patientcosts',
    name: '在院患者费用查询',
    component: HosSettlementSummary,
    include: [jlccybCode, jlssbCode]
  },
  {
    id: 'personalhistory',
    name: '个人历史住院信息查询',
    component: HosSettlementList,
    include: [jlccybCode, jlssbCode]
  },
  {
    id: 'list',
    name: '住院日结查询',
    component: PersonalHistoryInfo,
    include: [jlccybCode, jlssbCode]
  },
  {
    id: 'summary',
    name: '住院日结汇总',
    component: PatientCosts,
    include: [jlccybCode, jlssbCode]
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
