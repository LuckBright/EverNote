import Welcome from '@/login/page/welcome.vue'
import TestTitanCare from '@/titancare/views/index.vue'
export default [
  {
    path: '/titancare',
    name: 'titancare',
    redirect: '/titancare/welcome',
    component: TestTitanCare,
    children: [
      {
        path: 'welcome',
        name: 'titan-care-welcome',
        component: Welcome,
      }
    ]
  }
]
