
const settingRouter = [
  {
    path: 'setting',
    name: 'settingmain',
    component: () => import('../setting.main'),
    redirect: '/titanmall/setting/mallinfo',
    children: [
      {
        path: 'mallinfo',
        name: 'mallinfo',
        component: () => import('../mall/mall.info'),
        meta: {
          secActiveIndex: '/titanmall/setting',
        }
      },
      {
        path: 'pay',
        name: 'paymain',
        component: () => import('../pay/pay.main'),
        children: [
          {
            path: '',
            name: 'pay',
            component: () => import('../pay/pay.setting'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
          {
            path: 'zfb',
            name: 'zfb',
            component: () => import('../pay/zfb.setting'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
          {
            path: 'zfbaccount',
            name: 'zfbaccount',
            component: () => import('../pay/zfb.account'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
          {
            path: 'wx',
            name: 'wx',
            component: () => import('../pay/wx.setting'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
          {
            path: 'wxaccount',
            name: 'wxaccount',
            component: () => import('../pay/wx.account'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
          {
            path: 'wxadd',
            name: 'wxadd',
            component: () => import('../pay/wx.add'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
          {
            path: 'qr',
            name: 'qr',
            component: () => import('../pay/qr.code'),
            meta: {
              secActiveIndex: '/titanmall/setting',
            }
          },
        ],
      },
      {
        path: 'returngoods',
        name: 'returngoods',
        component: () => import('../return/return.goods'),
        meta: {
          secActiveIndex: '/titanmall/setting',
        }
      },
      {
        path: 'transaction',
        name: 'transaction',
        component: () => import('../transaction/transaction'),
        meta: {
          secActiveIndex: '/titanmall/setting',
        }
      },
      {
        path: 'ordersource',
        name: 'ordersource',
        component: () => import('../order/order.source'),
        meta: {
          secActiveIndex: '/titanmall/setting',
        }
      },
    ],
  },
]
export default settingRouter
