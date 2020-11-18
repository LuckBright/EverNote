const marketingRouter = [
  {
    path: 'marketing',
    name: 'market',
    component: () => import('../index'),
    redirect: '/titanmall/marketing/coupon',
    children: [
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('../coupon/coupon'),
        meta: {
          secActiveIndex: '/titanmall/marketing',
        }
      },
      {
        path: 'share',
        name: 'share',
        component: () => import('../share/share'),
        meta: {
          secActiveIndex: '/titanmall/marketing',
        }
      },
      {
        path: 'distribution',
        name: 'distribution',
        component: () => import('../distribution/index'),
        meta: {
          secActiveIndex: '/titanmall/marketing'
        }
      },
      {
        path: 'details',
        name: 'distribution-detail',
        component: () => import('../distribution/distribution.detaile'),
        meta: {
          secActiveIndex: '/titanmall/marketing'
        }
      },
    ],
  },
  {
    path: 'marketing/couponedit',
    name: 'couponedit',
    component: () => import('../coupon/coupon.edit'),
    meta: {
      secActiveIndex: '/titanmall/marketing',
    }
  },
]

export default marketingRouter
