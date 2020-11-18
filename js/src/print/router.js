import Frame from './pages/printframe'
import printlist from './pages/printlist'
export default function () {
  return [
    {
      path: 'print',
      redirect: 'print/list',
      component: Frame,
      children: [
        {
          path: 'list',
          component: printlist,
          meta: {
            rid: 'Auth_menu_system_printercenter'
          }
        }
      ]
    }
  ]
}

