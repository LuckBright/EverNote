// 客户编号设置
import Membernumberlist from '@/crm/page/membernumber/membernumberlist'
import Membernumberedit from '@/crm/page/membernumber/membernumberedit'

export default [
  {
    path: 'member',
    name: 'membernumberlist',
    component: Membernumberlist
  },
  {
    path: 'member/membernumberedit',
    name: 'membernumberedit',
    component: Membernumberedit,
    meta: {
      thirdActiveIndex: '/group/member'
    }
  }
]
