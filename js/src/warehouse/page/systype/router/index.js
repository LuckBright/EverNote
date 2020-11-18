// 值集查看
import Setlist from '../page/setlist'
import Valuelist from '../page/valuelist'

let arr = [
  {
    path: 'setlist',
    name: 'setlist',
    component: Setlist,
    // meta: {
    //   rid: 'Auth_menu_systemset_valueset'
    // }
  },
  {
    path: 'valuelist/:setCode/:setName/:setVersion?',
    name: 'valuelist',
    component: Valuelist,
    meta: {
      setObj: {},
      secActiveIndex: '/systemset/setlist'
      // rid: 'Auth_menu_systemset_valueset'
    }
  }
]
export default arr
