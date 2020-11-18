/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-03-02 10:47:53
 * @Last Modified by:   xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-03-02 10:47:53
 */
import Order from '../order.vue'
import Welcome from '@/login/page/welcome'

import Tasks from '@/order/page/task/tasks'
import Task from '@/order/page/task/task'

export default [
  {
    path: '/order',
    redirect: '/order/tasks',
    name: 'order',
    component: Order,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        name: 'welcome',
        component: Welcome
      },
      {
        path: 'tasks',
        component: Tasks,
        name: 'tasks'
      },
      {
        path: 'task/:orderType/:code//:type',
        meta: {
          thirdActiveIndex: '/order/tasks'
        },
        component: Task,
        name: 'task'
      },
    ]
  }
]

