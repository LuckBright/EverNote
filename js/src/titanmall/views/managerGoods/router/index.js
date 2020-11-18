const goodsRouter = [
  {
    path: 'goodsmain',
    name: 'goodsmain',
    component: () => import('../goods.main'),
    redirect: '/titanmall/goodsmain/goodsmanager',
    children: [
      {
        path: 'goodsmanager',
        name: 'goodsmanager',
        component: () => import('../manager/manager.goods'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
      {
        path: 'goodsmanager/goodsedit',
        name: 'goodsedit',
        component: () => import('../manager/goods.edit'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
      {
        path: 'goodsmanager/sourcecomp',
        name: 'sourcecomp',
        component: () => import('../manager/source.comp'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
      {
        path: 'goodsmanager/sourcedetail',
        name: 'sourcedetail',
        component: () => import('../manager/source.detail'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
      {
        path: 'goodsmanager/sourcetemplate',
        name: 'sourcetemplate',
        component: () => import('../manager/source.template'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
      {
        path: 'grouping',
        name: 'grouping',
        component: () => import('../grouping/grouping'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
      {
        path: 'source',
        name: 'source',
        component: () => import('../source/source'),
        meta: {
          secActiveIndex: '/titanmall/goodsmain',
        }
      },
    ],
  },
]
export default goodsRouter
