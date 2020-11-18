import Bimain from '../page/bimain'
// import Welcome from '@/login/page/welcome'
// import UnifiedView from '../page/unified-view.vue'
// 分析报表注册
// import BiRouter from '@/bi/router/index.js'
// import CensusBoardHospitalization from '@/bi/page/censusboard/hospitalization.vue'
import index from '@/bi/page/index'
import indexcatalog from '@/bi/page/catalog'

export default [
  {
    path: '/bi',
    component: Bimain,
    redirect: '/bi/index',
    children: [
      // {
      //   path: 'welcome',
      //   meta: {
      //     full: true
      //   },
      //   component: Welcome
      // },
      // ...BiRouter({
      //   editMode: false,
      //   moduleSelect: false,
      //   searchMode: true,
      //   addMode: false,
      //   // secActiveIndex: '/bi/catalog'
      // }),
      // {
      //   path: 'unifiedview/:biroute',
      //   component: UnifiedView
      // },
      // {
      //   path: 'rcm_statistics',
      //   component: CensusBoardHospitalization,
      //   meta: {
      //     h: true
      //   }
      // },
      // 报表详情页面
      {
        path: 'catalog',
        name: 'bicatalog',
        component: indexcatalog,
        meta: {
          showCodeList: ['outpatient', 'medical_skills', 'hospitalization', 'medical_supplies', 'warehouse', 'internet_hospital', 'insurance'],
        }
      },
      // 环抱式中控台报表展示页面
      {
        path: 'index',
        component: index,
        name: 'biindex',
        meta: {
          full: true
        }
      },
    ]
  }
]
