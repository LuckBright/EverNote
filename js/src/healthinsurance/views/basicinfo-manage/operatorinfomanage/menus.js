import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import operatorinfo from './sdll-operatorinfo.vue'
const thirdActiveIndex = '/hi/basicConfigInfo/OperatorManage'
const Menus = [{
  id: 'operatorinfo',
  name: '操作员信息上报',
  component: operatorinfo,
  include: [sdllCode]
},
]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
