import shortvideo from '@/titancare/views/content/page/shortvideo.vue'
import videodetail from '@/titancare/views/content/page/video-detail.vue'
import goods from '@/titancare/views/content/page/goods.vue'
import liveindex from '@/titancare/views/content/live/live.index.vue'
import livepage from '@/titancare/views/content/live/live.page.vue'
import playback from '@/titancare/views/content/page/playback'
import article from '@/titancare/views/content/page/article.vue'
import articleDetail from '@/titancare/views/content/page/article-detail.vue'
import Frame from '@/login/page/pageframe.vue'
import Videoset from '@/titancare/views/business/page/videoset.vue'

export default [
  {
    name: 'content',
    path: 'content',
    component: Frame,
    meta: { noRequireAuth: true },
    redirect: '/titancare/content/shortvideo',
    children: [
      {
        path: 'playback',
        name: 'playback',
        component: playback,
      },
      {
        path: 'shortvideo',
        name: 'shortvideo',
        component: shortvideo,
      },
      {
        path: 'videodetail',
        name: 'videodetail',
        component: videodetail,
        meta: {
          thirdActiveIndex: '/titancare/content/shortvideo',
        }
      },
      {
        path: 'goods',
        name: 'goods',
        component: goods,
        meta: {
          thirdActiveIndex: '/titancare/content/shortvideo',
        }
      },
      {
        path: 'live',
        name: 'liveindexe',
        component: liveindex,
        meta: {
          thirdActiveIndex: '/titancare/content/live',
        }
      },
      {
        path: 'live/livepage',
        name: 'livepage',
        component: livepage,
        meta: {
          thirdActiveIndex: '/titancare/content/live',
        }
      },
      {
        path: 'liveplayback',
        name: 'liveplayback',
        component: livepage,
        meta: {
          thirdActiveIndex: '/titancare/content/playback',
        }
      },
      {
        path: 'article',
        name: 'article',
        component: article,
        meta: {
          thirdActiveIndex: '/titancare/content/article',
        }
      },
      {
        path: 'article-detail',
        name: 'articleDetail',
        component: articleDetail,
        meta: {
          thirdActiveIndex: '/titancare/content/article',
        }
      },
      // 短视频配置
      {
        path: 'videoset',
        name: 'videoset',
        component: Videoset,
        meta: {
          secActiveIndex: '/titancare/content',
        }
      },
    ]
  }
]
