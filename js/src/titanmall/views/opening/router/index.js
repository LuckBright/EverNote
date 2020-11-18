const openingRouter = [
  {
    path: 'openexplain',
    name: 'explain',
    component: () => import('../open.explain'),
    meta: {
      showOpenMall: true,
    },
  },
  {
    path: 'open',
    name: 'open',
    component: () => import('../open.vue'),
    meta: {
      showOpenMall: true,
    },
  },
  {
    path: 'renew',
    name: 'renew',
    component: () => import('../renew'),
    meta: {
      showOpenMall: false,
    },
  },
]
export default openingRouter
