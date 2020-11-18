import { sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import sdlldepinfo from './sdll-deptinfo.vue'
const thirdActiveIndex = '/hi/basicConfigInfo/deptManage'
const Menus = [{
  id: 'sdlldeptinfo',
  name: '科室信息管理',
  component: sdlldepinfo,
  include: [sdllCode]
}]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
