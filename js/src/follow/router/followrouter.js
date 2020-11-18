import Follow from '../page/followframe'
import Welcome from '@/login/page/welcome'
import FollowTemplate from '../page/template/followtemplate'
import newcreate from '../page/template/newcreate'
import FollowTemplateDetail from '../page/template/followtemplatedetail'
import FollowTask from '../page/task/followtask'
import FollowTaskDetail from '../page/task/followtaskdetail'
import FollowSubTask from '../page/task/followsubtask'
import Questionnaire from '../page/questionnaire/questionnaire'
import Questionnairedetail from '../page/questionnaire/questionnairedetail'
import Questionnaireiframe from '../page/questionnaire/questionnaireiframe'
import Personaltask from '../page/personal/task/index'
import Personaltemplate from '../page/personal/template/index'
import PhoneTemplate from '../page/material/phonetemplate'
export default [
  {
    path: '/follow',
    name: 'follow',
    redirect: '/follow/welcome',
    component: Follow,
    children: [
      {
        path: 'welcome',
        meta: {
          full: true
        },
        component: Welcome
      },
      {
        path: 'template',
        name: 'template',
        component: FollowTemplate
      },
      {
        path: 'material',
        name: 'material',
        component: Follow,
        redirect: '/follow/material/questionnaire/group/',
        children: [
          {
            path: 'questionnaire/:type?',
            name: 'questionnaire',
            component: Questionnaire,
            meta: {
              thirdActiveIndex: '/follow/material/questionnaire/group'
            }
          },
          {
            path: 'phonetemplate',
            name: 'phonetemplate',
            component: PhoneTemplate,
            meta: {
              secActiveIndex: '/follow/material/phonetemplate'
            }
          },
          {
            path: 'questionnaire/:type/detail/:id?/:categoryId?',
            name: 'questionnairedetail',
            component: Questionnairedetail,
            meta: {
              thirdActiveIndex: '/follow/material/questionnaire/group'
            }
          },
          {
            path: 'questionnaireiframe/group/:id',
            name: 'questionnaireiframe',
            component: Questionnaireiframe,
            meta: {
              thirdActiveIndex: '/follow/material/questionnaire/group'
            }
          }
        ],
        meta: {
          secActiveIndex: '/follow/material'
        }
      },
      {
        path: 'template/detail/:id?/:categoryId?',
        name: 'tplDetail',
        component: FollowTemplateDetail,
        meta: {
          secActiveIndex: '/follow/template'
        }
      },
      {
        path: 'template/newcreate/:id?/:categoryId?',
        name: 'tplcreate',
        component: newcreate,
        meta: {
          secActiveIndex: '/follow/template'
        }
      },
      {
        path: 'taskmanage',
        name: 'task',
        component: FollowTask
      },
      {
        path: 'taskmanage/detail/:id?',
        name: 'taskmanageDetail',
        component: FollowTaskDetail,
        meta: {
          secActiveIndex: '/follow/taskmanage'
        }
      },
      {
        path: 'tasksub',
        name: 'tasksub',
        component: FollowSubTask
      },
      {
        path: 'task',
        name: 'task1',
        component: FollowTask
      },
      {
        path: 'task/detail/:id?',
        name: 'taskDetail',
        component: FollowTaskDetail,
        meta: {
          secActiveIndex: '/follow/task'
        }
      },
      {
        path: 'personaltask',
        name: 'personaltask',
        component: Personaltask
      },
      {
        path: 'personaltask/detail/:id?',
        name: 'personaltaskDetail',
        component: FollowTaskDetail,
        meta: {
          secActiveIndex: '/follow/personaltask'
        }
      },
      {
        path: 'personaltemplate',
        name: 'personaltemplate',
        component: Personaltemplate
      },
      {
        path: 'personaltemplate/detail/:id?',
        name: 'personaltplDetail',
        component: FollowTemplateDetail,
        meta: {
          secActiveIndex: '/follow/personaltemplate'
        }
      },
    ]
  }
]
