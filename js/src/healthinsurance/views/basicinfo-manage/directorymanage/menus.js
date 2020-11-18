import { jlccybCode, jlssbCode, hljybCode, jljhCode, sysqzyyCode, sdllCode, gdcfybCode } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'
import medialItemList from '@/rcm/otmdiscomponent/medicalitemlist.vue'
// 黑龙江
import directoryAdd from '@/rcm/healthcare/views/organization/catalogue.vue'
import directoryManage from '@/rcm/healthcare/views/organization/catalogue.download.vue'
// 山东乐陵
// import sdllDirectoryAdd from '@/healthinsurance/views/basicinfo-manage/directorymanage/sdll/new-or-update.vue'
// import sdllDirectoryManage from '@/healthinsurance/views/basicinfo-manage/directorymanage/sdll/searchitem.vue'

const thirdActiveIndex = '/hi/basicConfigInfo/directoryManage'
const Menus = [{
  id: 'medialItemList',
  name: '目录对照',
  component: medialItemList,
  include: [jlccybCode, jlssbCode, hljybCode, jljhCode, sysqzyyCode, sdllCode, gdcfybCode]
},
{
  id: 'hljDirectoryAdd',
  customName: '目录新增',
  name: '黑龙江目录新增',
  component: directoryAdd,
  include: [hljybCode]
},
{
  id: 'hljDirectoryManage',
  customName: '目录管理',
  name: '黑龙江目录管理',
  component: directoryManage,
  include: [hljybCode]
},
  // {
  //   id: 'sdllDirectoryAdd',
  //   customName: '医保目录更新',
  //   name: '山东乐陵医保目录更新',
  //   component: sdllDirectoryAdd,
  //   include: [sdllCode]
  // },
  // {
  //   id: 'sdllDirectoryManage',
  //   customName: '医保目录查询',
  //   name: '山东乐陵医保目录查询',
  //   component: sdllDirectoryManage,
  //   include: [sdllCode]
  // }
]
export default Menus.map(menu => {
  menu.path = menu.id
  menu.routerLink = `${thirdActiveIndex}/${menu.id}`
  menu.meta = {
    thirdActiveIndex: thirdActiveIndex
  }
  return menu
})
