import Welcome from '@/login/page/welcome'
import Frame from '@/login/page/pageframe'
// import homeConfigRouter from '@/titancare/views/homeconfig/router'
// 预问诊模板管理路由
import visitRouter from '@/titancare/views/visit/router'
// import notice from '@/titancare/views/notice/router'
// 在线问诊设置路由
import graphic from '@/titancare/views/graphic/router'
// import business from '@/titancare/views/business/router'
// 患教内容管理路由文件
import content from '@/titancare/views/content/router'
// 运营管理路由文件
import operationManage from '@/titancare/views/operationmanage/router'
// 患者端设置
import patientClient from '@/titancare/views/patientclient/router'

export default [
  {
    path: '/titancare',
    redirect: '/titancare/welcome',
    component: Frame,
    children: [
      {
        path: 'welcome',
        name: 'titancare-welcome',
        component: Welcome,
        meta: {
          isWelcome: true,
          full: true
        }
      },
      // ...homeConfigRouter,
      ...visitRouter,
      // ...notice,
      ...graphic,
      // ...business,
      ...content,
      ...operationManage,
      ...patientClient
    ]
  }
]
