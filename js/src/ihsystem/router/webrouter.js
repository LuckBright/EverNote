import webframe from '../page/index.vue'
import welcome from '../page/welcome.vue'
import ihList from '../page/list.vue'
import chatRoom from '../page/chatroom.vue'
import IhDetail from '@/titancare/views/operationmanage/teletext/teletextdetails'

export default [
  {
    path: '/ihsystem',
    name: 'ihsystem',
    component: webframe,
    redirect: '/ihsystem/welcome',
    children: [
      {
        path: 'welcome',
        meta: {
          full: true,
          noRequireAuth: true
        },
        component: welcome
      },
      {
        path: 'ihlist',
        name: 'ihlist',
        component: ihList
      },
      {
        path: 'chatroom',
        name: 'chatroom',
        component: chatRoom,
        meta: {
          secActiveIndex: '/ihsystem/ihlist',
        }
      },
      {
        path: 'ihdetail',
        name: 'ihdetail',
        component: IhDetail,
        meta: {
          secActiveIndex: '/ihsystem/ihlist',
        }
      },
    ]
  }
]
