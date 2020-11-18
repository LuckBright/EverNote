const capitalRouter = [
  {
    path: 'capital',
    name: 'capitalmain',
    component: () => import('../capital.main'),
    redirect: '/titanmall/capital/capitalbills',
    children: [
      {
        path: 'capitalbills',
        name: 'capitalbills',
        component: () => import('../capital.bills'),
        meta: {
          secActiveIndex: '/titanmall/capital',
        }
      },
      {
        path: 'capitalcheck',
        name: 'capitalcheck',
        component: () => import('../capital.check'),
        meta: {
          secActiveIndex: '/titanmall/capital',
        }
      },
    ],
  },
]
export default capitalRouter
