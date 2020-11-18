const managerRouter = [
  {
    path: 'ordermain',
    name: 'ordermain',
    component: () => import(/* webpackChunkName: "about" */ '../order.main'),
    redirect: '/titanmall/ordermain/manager',
    children: [
      {
        path: 'manager',
        name: 'manager',
        component: () => import(/* webpackChunkName: "about" */ '../manager'),
        meta: {
          secActiveIndex: '/titanmall/ordermain',
        }
      },
      {
        path: 'manager/sendgoods',
        name: 'sendgoods',
        component: () => import(/* webpackChunkName: "about" */ '../send.goods'),
        meta: {
          secActiveIndex: '/titanmall/ordermain',
        }
      },
      {
        path: 'manager/orderdetails',
        name: 'orderdetails',
        component: () =>
          import(/* webpackChunkName: "about" */ '../order.details'),
        meta: {
          secActiveIndex: '/titanmall/ordermain',
        }
      },
      {
        path: 'manager/returndetails',
        name: 'returndetails',
        component: () => import('../return.details'),
        meta: {
          secActiveIndex: '/titanmall/ordermain',
        }
      },
      {
        path: 'source',
        name: 'source',
        component: () => import('../source'),
        meta: {
          secActiveIndex: '/titanmall/ordermain',
        }
      },
    ],
  },
]
export default managerRouter
