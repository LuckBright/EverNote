import Frame from '@/login/page/pageframe.vue'
import doctor from '../doctor.examine/doctor.examine.list'
import doctorDetails from '../doctor.examine/doctor.examine.details'
// import prescriptionaudit from '../prescription.audit/index'
// import expressmanage from '../express.manage/index'
import extension from '@/titancare/views/operationmanage/extension/extension'
import extensiondetails from '@/titancare/views/operationmanage/extension/extension.details'
// 消息提醒
import Notice from '@/titancare/views/notice/page/notice.vue'
// 日报推送
import Apply from '@/titancare/views/business/page/apply.vue'

// 结算及退费
import Refund from '@/titancare/views/settlement/page/refund'
import RefundOrderdetail from '@/titancare/views/settlement/page/teletext/order-detail'
import RefundFee from '@/titancare/views/settlement/page/fee'
import RefundHistory from '@/titancare/views/settlement/page/history'
import OrderAddress from '@/titancare/views/settlement/page/teletext/order-address'

// 订单管理
import teletext from '@/titancare/views/operationmanage/teletext/index' // todo 文件名字谁起的，要跟业务有关联才行，后期改通顺了
import teletextdetails from '@/titancare/views/operationmanage/teletext/teletextdetails' // todo 文件名字谁起的，要跟业务有关联才行，后期改通顺了

export default [
  {
    name: 'operation',
    path: 'operation',
    component: Frame,
    meta: { noRequireAuth: true },
    redirect: '/titancare/operation/doctor',
    children: [
      {
        path: 'doctor',
        name: 'doctor',
        component: doctor,
        meta: {
          thirdActiveIndex: '/titancare/operation/doctor',
        }
      },
      {
        path: 'doctor/doctordetails',
        name: 'doctordetails',
        component: doctorDetails,
        meta: {
          thirdActiveIndex: '/titancare/operation/doctor',
        }
      },
      // {
      //   path: 'prescriptionaudit',
      //   name: 'prescriptionaudit',
      //   component: prescriptionaudit,
      //   meta: {
      //     thirdActiveIndex: '/titancare/operation/prescriptionaudit',
      //   }
      // },
      // {
      //   path: 'expressmanage',
      //   name: 'expressmanage',
      //   component: expressmanage,
      //   meta: {
      //     thirdActiveIndex: '/titancare/operation/expressmanage',
      //   }
      // },
      {
        path: 'extension',
        name: 'extension',
        component: extension,
        meta: {
          thirdActiveIndex: '/titancare/operation/extension'
        }
      },
      {
        path: 'extensiondetails',
        name: 'extensiondetails',
        component: extensiondetails,
        meta: {
          thirdActiveIndex: '/titancare/operation/extension'
        }
      },
      // 消息通知
      {
        path: 'notice',
        name: 'noticeset',
        component: Notice,
        meta: {
          secActiveIndex: '/titancare/operation'
        }
      },
      // 日报推送帐号
      {
        path: 'apply',
        name: 'apply',
        component: Apply,
        meta: {
          secActiveIndex: '/titancare/operation'
        }
      },
      // 结算及退费
      {
        path: 'refund',
        name: 'refund',
        component: Refund,
        meta: {
          secActiveIndex: '/titancare/operation',
        },
      },
      {
        path: 'refund/orderdetail',
        name: 'refundOrderdetail',
        component: RefundOrderdetail,
        meta: {
          thirdActiveIndex: '/titancare/operation/refund',
        }
      },
      {
        path: 'refund/fee',
        name: 'refundFee',
        component: RefundFee,
        meta: {
          thirdActiveIndex: '/titancare/operation/refund',
        }
      },
      {
        path: 'orderaddress',
        name: 'orderaddress',
        component: OrderAddress
      },
      {
        path: 'refund/history',
        name: 'refundHistory',
        component: RefundHistory,
        meta: {
          thirdActiveIndex: '/titancare/operation/refund',
        }
      },
      // 订单管理
      {
        path: 'teletext1',
        name: 'teletext',
        component: teletext,
        meta: {
          thirdActiveIndex: '/titancare/operation/teletext1',
        }
      },
      {
        path: 'teletext1/teletextdetails',
        name: 'teletextdetails',
        component: teletextdetails,
        meta: {
          thirdActiveIndex: '/titancare/operation/teletext1',
        }
      },
    ]
  }
]
