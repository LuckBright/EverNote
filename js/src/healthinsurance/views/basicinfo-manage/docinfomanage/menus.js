import { sysqzyyCode, sdllCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import operatorinfo from '@/healthinsurance/views/basicinfo-manage/docinfomanage/operatorinfo.vue'
import sdllDocInfo from './sdll-docinfo.vue'
const thirdActiveIndex = '/hi/basicConfigInfo/docInfoManage'
const Menus = [{
  id: 'operatorinfo',
  name: '医师信息上报',
  component: operatorinfo,
  include: [sysqzyyCode]
},
{
  id: 'sdllOperatorinfo',
  customName: '医师信息上报',
  name: '山东乐陵医师信息上报',
  component: sdllDocInfo,
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
