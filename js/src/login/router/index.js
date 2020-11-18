import Main from '@/login/page/mainframe'
import Login from '@/login/page/login'
import Welcome from '@/login/page/welcome'
import MsgRouter from '@/message/router/msgrouter'
import forgotPwd from '@/login/page/password/forgot'
// import modifyPwd from '@/login/page/password/modify'
import ResetPwd from '@/login/page/password/resetpwd'
import MyClinic from '@/login/page/myclinic'
import Down from '@/login/page/download'
import Upgrade from '@/login/page/upgrade'

let array1 = [
  {
    path: '/',
    redirect: '/myclinic',
    meta: {
      full: true
    },
    component: Main
  },
  {
    path: '/welcome',
    meta: {
      full: true,
    },
    component: Welcome
  },
  {
    path: '/login',
    name: 'login',
    meta: { noRequireAuth: true },
    component: Login
  },
  {
    path: '/forgot',
    name: 'forgot',
    meta: { noRequireAuth: true },
    component: forgotPwd
  },
  {
    path: '/reset',
    name: 'reset',
    meta: { noRequireAuth: true },
    component: ResetPwd
  },
  // {
  //   path: '/password/modify',
  //   name: 'modifyPwd',
  //   component: modifyPwd
  // },
  {
    path: '/myclinic',
    name: 'myClinic',
    component: MyClinic,
    meta: {
      full: true
    }
  },
  {
    path: '/down',
    name: 'down',
    meta: {
      noRequireAuth: true,
      full: true
    },
    component: Down
  },
  {
    path: '/upgrade',
    name: 'upgrade',
    meta: {
      noRequireAuth: true,
      full: true
    },
    component: Upgrade
  },
  ...MsgRouter
]

array1 = array1.map(item => {
  if (!item.meta) {
    item.meta = {
      abandonRid: true
    }
  } else {
    item.meta.abandonRid = true
  }
  return item
})
export default array1
