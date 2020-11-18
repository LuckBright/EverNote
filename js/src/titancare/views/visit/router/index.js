import Frame from '@/login/page/pageframe.vue'
import group from '@/titancare/views/visit/page/list.vue'
import visitIframe from '@/titancare/views/visit/page/visitiframe.vue'
import setanswer from '@/titancare/views/visit/page/setanswer.vue'

export default [
  {
    path: 'visit',
    name: 'visit',
    component: Frame,
    redirect: '/titancare/visit/group',
    meta: { noRequireAuth: true },
    children: [
      // 预问诊模板 集团
      {
        path: 'group',
        name: 'group',
        component: group,
      },
      // 预问诊模板 机构
      {
        path: 'org',
        name: 'org',
        component: group,
      },
      // 预问诊模板 科室
      {
        path: 'dpt',
        name: 'dpt',
        component: group,
      },
      // 预问诊模板 个人
      {
        path: 'personage',
        name: 'personage',
        component: group,
      },
      // 预问诊模板 编辑页面 集团
      {
        path: 'groupedit',
        name: 'groupedit',
        component: visitIframe,
        meta: {
          thirdActiveIndex: '/titancare/visit/group'
        }
      },
      // 预问诊模板 编辑页面 机构
      {
        path: 'orgedit',
        name: 'orgedit',
        component: visitIframe,
        meta: {
          thirdActiveIndex: '/titancare/visit/org'
        }
      },
      // 预问诊模板 编辑页面 科室
      {
        path: 'dptedit',
        name: 'dptedit',
        component: visitIframe,
        meta: {
          thirdActiveIndex: '/titancare/visit/dpt'
        }
      },
      // 预问诊模板 编辑页面 个人
      {
        path: 'personageedit',
        name: 'personageedit',
        component: visitIframe,
        meta: {
          thirdActiveIndex: '/titancare/visit/personage'
        }
      },
      // {
      //   path: 'visitiframe',
      //   name: 'visitiframe',
      //   component: visitIframe,
      // },
      // {
      //   path: 'visitdetail/:id?/:categoryId?',
      //   name: 'visitdetail',
      //   component: visitIframe,
      // },
      // 预问诊模板 发布页面 集团
      {
        path: 'groupanswer/:id?/:categoryId?',
        name: 'groupanswer',
        component: setanswer,
        meta: {
          thirdActiveIndex: '/titancare/visit/group'
        }
      },
      // 预问诊模板 发布页面 机构
      {
        path: 'organswer/:id?/:categoryId?',
        name: 'organswer',
        component: setanswer,
        meta: {
          thirdActiveIndex: '/titancare/visit/org'
        }
      },
      // 预问诊模板 发布页面 科室
      {
        path: 'dptanswer/:id?/:categoryId?',
        name: 'dptanswer',
        component: setanswer,
        meta: {
          thirdActiveIndex: '/titancare/visit/dpt'
        }
      },
      // 预问诊模板 发布页面 个人
      {
        path: 'personageanswer/:id?/:categoryId?',
        name: 'personageanswer',
        component: setanswer,
        meta: {
          thirdActiveIndex: '/titancare/visit/personage'
        }
      },
      // {
      //   path: 'answer/:id?/:categoryId?',
      //   name: 'answer',
      //   component: setanswer,
      // }
    ]
  }
]
