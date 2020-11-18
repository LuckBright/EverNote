import { jljhCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import jljhApproval from '@/rcm/otmdiscomponent/insurance-approval/disease-approval.vue'
const thirdActiveIndex = '/hi/control/approval'
const Menus = [{
  id: 'jljhApproval',
  name: '疾病审批上报',
  component: jljhApproval,
  include: [jljhCode]
}]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
