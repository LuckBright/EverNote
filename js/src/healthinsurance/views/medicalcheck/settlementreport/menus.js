import { sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import SettlementConfirm from '@/healthinsurance/views/medicalcheck/settlementreport/settlementconfirm.vue'
const thirdActiveIndex = '/hi/medicalcheck/settlementreport'
const Menus = [{
  id: 'confirm',
  name: '费用结算确认',
  component: SettlementConfirm,
  include: [sysqzyyCode]
}]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
