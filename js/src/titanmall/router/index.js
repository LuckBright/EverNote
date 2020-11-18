import Index from '@/login/page/pageframe'
import Welcome from '@/titanmall/welcome.vue'
import managerRouter from '@/titanmall/views/managerOrder/router'
import goodsRouter from '@/titanmall/views/managerGoods/router'
import capitalRouter from '@/titanmall/views/managerCapital/router'
import settingRouter from '@/titanmall/views/setting/router'
import allInfoRouter from '@/titanmall/views/overview/router'
import mallRouter from '@/titanmall/views/managerMall/router'
import openingRouter from '@/titanmall/views/opening/router'
import marketingRouter from '@/titanmall/views/marketingTools/router'

export default [
  {
    path: '/titanmall',
    name: 'titanmall-home',
    component: Index,
    redirect: '/titanmall/welcome',
    children: [
      {
        path: 'welcome',
        name: 'titanmall-welcome',
        component: Welcome,
        meta: {
          full: true
        }
      },
      ...managerRouter,
      ...goodsRouter,
      ...capitalRouter,
      ...settingRouter,
      ...allInfoRouter,
      ...mallRouter,
      ...openingRouter,
      ...marketingRouter,
    ],
  },
]
