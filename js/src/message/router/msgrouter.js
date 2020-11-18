import Main from '../page/mainframe.vue'
import List from '../page/msglist.vue'
import Content from '../page/msgcontent.vue'
export default [
  {
    path: '/msgcenter',
    name: 'msgcenter',
    component: Main,
    children: [
      {
        name: 'mgslist',
        path: 'list',
        component: List
      },
      {
        name: 'content',
        path: 'content',
        component: Content
      }
    ]
  }
]
