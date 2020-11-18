import Center from '@/html5/center'
// import Index from '@/html5/pages/index'
// import Selfmachindex from '@/html5/pages/selfmachine/selfmachindex'
// import Selfmachlogin from '@/html5/pages/selfmachine/selfmachlogin'
// import Selfmachresult from '@/html5/pages/selfmachine/selfmachresult'
import Registerform from '@/html5/pages/patient/register'

export default [
  {
    path: '/html5',
    component: Center,
    // redirect: '/html5/demo',
    name: 'html5',
    children: [
      // {
      //   path: 'demo',
      //   component: Index
      // },
      // {
      //   path: 'selfmachindex',
      //   meta: { noRequireAuth: true },
      //   name: 'selfmachindex',
      //   component: Selfmachindex
      // },
      // {
      //   path: 'selfmachlogin',
      //   meta: { noRequireAuth: true },
      //   name: 'selfmachlogin',
      //   component: Selfmachlogin
      // },
      // {
      //   path: 'selfmachresult',
      //   meta: { noRequireAuth: true },
      //   name: 'selfmachresult',
      //   component: Selfmachresult
      // },
      {
        path: 'registerform/:id?',
        meta: { noRequireAuth: true },
        name: 'registerform',
        component: Registerform
      }
    ]
  }
]
