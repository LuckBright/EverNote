import AccountManage from '@/rcm/page/accountmanage/accountmanage'
import DiseaseSetting from '@/rcm/page/accountmanage/diseasesetting'
import DiseaseMapping from '@/rcm/page/accountmanage/diseasemapping'
export default [
  {
    path: '/accountmanage',
    name: 'accountmanage',
    component: AccountManage,
    children: [
      {
        path: 'diseasesetting',
        component: DiseaseSetting
      },
      {
        path: 'diseasemapping',
        component: DiseaseMapping
      }
    ]
  }
]
