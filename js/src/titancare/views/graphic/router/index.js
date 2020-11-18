import Frame from '@/login/page/pageframe.vue'
import Teletext from '@/titancare/views/graphic/page/teletext.vue'
import video from '@/titancare/views/video/page/index.vue'
import imagetext from '@/titancare/views/business/page/image-text'
// import teletextdetails from '@/titancare/views/operationmanage/teletext/teletextdetails'
import treaty from '@/titancare/views/business/page/treaty/treaty-source.vue'

export default [
  {
    name: 'graphic',
    path: 'graphic',
    component: Frame,
    redirect: '/titancare/graphic/team',
    children: [
      // {
      //   path: 'price',
      //   name: 'price',
      //   component: Price,
      //   meta: {
      //     thirdActiveIndex: '/graphic'
      //   }
      // },
      // 在线问诊设置-医生定价设置
      {
        path: 'teletext',
        name: 'teletext1',
        component: Teletext,
        meta: {
          // thirdActiveIndex: '/graphic',
          secActiveIndex: '/titancare/graphic',
        }
      },
      // 在线问诊设置-业务设置
      {
        path: 'imagetext',
        name: 'imagetext',
        component: imagetext,
        meta: {
          // thirdActiveIndex: '/graphic',
          secActiveIndex: '/titancare/graphic',
        }
      },
      // 在线问诊设置-会诊管理
      {
        path: 'video',
        name: 'video',
        component: video,
        meta: {
          // thirdActiveIndex: '/graphic',
          secActiveIndex: '/titancare/graphic',
        }
      },
      // {
      //   path: 'teletext1/teletextdetails',
      //   name: 'teletextdetails',
      //   component: teletextdetails,
      //   meta: {
      //     thirdActiveIndex: '/titancare/graphic/teletext1',
      //   }
      // },
      {
        path: 'treaty',
        name: 'treaty',
        component: treaty,
      },
    ]
  }
]
