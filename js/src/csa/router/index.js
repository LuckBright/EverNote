import index from '@/csa/page/index.vue'
import plan from '@/csa/page/plan.vue'
import nurse from '@/csa/page/nurse.vue'
import anesthetist from '@/csa/page/anesthetist.vue'
import csaIndex from '@/csa/components/csa.index.vue'
import feeDetail from '@/csa/page/csa.fee.vue'
import advice from '@/csa/page/advice.csa.vue'
import docswrapper from '@/inpatient/page/docswrapper'
import execute from '@/csa/page/execute.csa.vue'
let csaRouter = [
  {
    name: 'csa',
    path: '/csa',
    component: index,
    redirect: '/csa/plan',
    meta: {
      space: 'nurse'
    },
    children: [
      {
        name: 'plan',
        path: 'plan',
        component: plan,
      },
      {
        name: 'nurse',
        path: 'nurse',
        component: nurse,
        redirect: '/csa/nurse/index',
        meta: {
          space: 'nurse',
          role: 2
        },
        children: [
          {
            name: 'index_nurse',
            path: 'index',
            component: csaIndex,
            meta: {
              secActiveIndex: '/csa/nurse'
            },
          },
          {
            name: 'exec_nurse',
            path: 'exec',
            component: execute,
            meta: {
              secActiveIndex: '/csa/nurse'
            },
          },
          {
            name: 'docs_nurse',
            path: 'docs',
            component: docswrapper,
            meta: {
              secActiveIndex: '/csa/nurse',
              prole: 2
            },
          },
          {
            name: 'fee_nurse',
            path: 'fee',
            component: feeDetail,
            meta: {
              secActiveIndex: '/csa/nurse'
            },
          },
          {
            name: 'advice_nurse',
            path: 'advice',
            component: advice,
            meta: {
              secActiveIndex: '/csa/nurse'
            },
          }
        ]
      },
      {
        name: 'anesthetist',
        path: 'anesthetist',
        component: anesthetist,
        redirect: '/csa/anesthetist/index',
        meta: {
          space: 'anesthetist',
          role: 1
        },
        children: [
          {
            name: 'index',
            path: 'index',
            component: csaIndex,
            meta: {
              secActiveIndex: '/csa/anesthetist'
            },
          },
          {
            name: 'exec',
            path: 'exec',
            component: execute,
            meta: {
              secActiveIndex: '/csa/anesthetist'
            },
          },
          {
            name: 'docs',
            path: 'docs',
            component: docswrapper,
            meta: {
              secActiveIndex: '/csa/anesthetist',
              prole: 1
            },
          },
          {
            name: 'fee',
            path: 'fee',
            component: feeDetail,
            meta: {
              secActiveIndex: '/csa/anesthetist'
            },
          },
          {
            name: 'advice',
            path: 'advice',
            component: advice,
            meta: {
              secActiveIndex: '/csa/anesthetist'
            },
          },
        ]
      }
    ]
  }
]

export default csaRouter

// /csa/anesthetist
// Auth_menu_csa_anesthetist
// 麻醉医生

// /csa/nurse
// Auth_menu_csa_nurse
// 手麻护士

// /csa/plan
// Auth_menu_csa_plan

// 手术安排
