import { jlccybCode, jlssbCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

import outpatientQuery from '@/healthinsurance/views/medicalcheck/settlementquery/outpatientquery.vue'
import hospitalQuery from '@/healthinsurance/views/medicalcheck/settlementquery/hospitalquery.vue'

const thirdActiveIndex = '/hi/medicalcheck/settlementQuery'
const Menus = [{
  id: 'outpatientQuery',
  name: '门诊结算查询',
  component: outpatientQuery,
  include: [jlccybCode, jlssbCode]
},
{
  id: 'hospitalQuery',
  name: '住院结算查询',
  component: hospitalQuery,
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
