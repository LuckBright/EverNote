import { jlccybCode, jlssbCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import OutpatientSettlementSummary from '@/healthinsurance/views/insurancestatistics/outpatient/settlementsummary/settlementinfo'
import OutpatientSettlementList from '@/healthinsurance/views/insurancestatistics/outpatient/settlementlist.vue'
import OutpatientPersonalInfo from '@/healthinsurance/views/insurancestatistics/outpatient/personal/personalinfo.vue'
const thirdActiveIndex = '/hi/insurancestatistics/outpatient'
const Menus = [
  {
    id: 'personalinfo',
    name: '个人账户查询',
    component: OutpatientSettlementSummary,
    include: [jlccybCode, jlssbCode]
  }, {
    id: 'list',
    name: '门诊日结查询',
    component: OutpatientSettlementList,
    include: [jlccybCode, jlssbCode]
  },
  {
    id: 'summary',
    name: '门诊日结汇总',
    component: OutpatientPersonalInfo,
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
