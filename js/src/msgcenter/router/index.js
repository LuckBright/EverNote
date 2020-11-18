import MessageMain from '@/msgcenter/page/layout'
import MessageList from '@/msgcenter/page/msglist'
import Message from '@/msgcenter/page/message'
// import MessageDetail from '@/msgcenter/page/messagedetail'
import MessageSendRecord from '@/msgcenter/page/msgsendrecord'
// 充值管理
import smsrecharge from '@/manages/page/smsrecharge/index'
import recordlist from '@/manages/page/smsrecharge/recordlist'

// 集团 0  机构  1 optType
export default function (opt) {
  let thirdActiveIndex = opt.thirdActiveIndex || ''
  let msgListRid = opt.msgListRid || 'Auth_menu_clinic_messageset'
  return [
    {
      path: 'message',
      component: MessageMain,
      redirect: 'message/list',
      children: [
        {
          name: 'messagelist',
          path: 'list',
          component: MessageList,
          meta: {
            thirdActiveIndex,
            rid: msgListRid
          }
        },
        {
          name: 'messageedit',
          path: 'message/:id',
          component: Message,
          meta: {
            thirdActiveIndex
          }
        },
        // {
        //   name: 'messagedetail',
        //   path: 'detail/:id',
        //   component: MessageDetail,
        //   meta: {
        //     thirdActiveIndex
        //   }
        // },
        {
          name: 'messagesendrecord',
          path: 'record',
          component: MessageSendRecord
        },
        {
          name: 'smsrecharge',
          path: 'smsrecharge',
          component: smsrecharge,
        },
        {
          name: 'recordlist',
          path: 'recordlist',
          component: recordlist,
          meta: {
            thirdActiveIndex: '/manages/message/smsrecharge'
          }
        },
      ]
    }
  ]
}
