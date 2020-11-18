import { hljybCode, sysqzyyCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import OperatorInfoQuery from './operatorinfo.vue'
import designated from '@/rcm/healthcare/views/organization/designated.vue'
import operation from '@/rcm/healthcare/views/organization/operation.vue'
import OrganInfo from './organinfo.vue'
const thirdActiveIndex = '/hi/basicConfigInfo/basicInfoQuery'
const Menus = [{
  id: 'designated',
  name: '定点机构信息查询',
  component: designated,
  include: [hljybCode]
},
{
  id: 'operation',
  name: '经办机构信息查询',
  component: operation,
  include: [hljybCode]
},
{
  id: 'operatorinfo',
  name: '医师操作员信息查询',
  component: OperatorInfoQuery,
  include: [sysqzyyCode]
},
{
  id: 'organinfo',
  // path重名
  // name: '定点机构信息查询',
  customName: '定点机构信息查询',
  component: OrganInfo,
  include: [sysqzyyCode]
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
