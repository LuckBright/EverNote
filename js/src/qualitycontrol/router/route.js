import qualityControlIndex from '@/qualitycontrol/page/quality.control.index'
import recallauditlevel3 from '@/qualitycontrol/page/recall.audit.level3'
export default [
  {
    name: 'qualitycontrol_index',
    path: '/qualitycontrol',
    component: qualityControlIndex,
    redirect: '/qualitycontrol/recallmanage/recallauditlevel3',
    meta: {
      // secActiveIndex: '/qualitycontrol/recallmanage/recallauditlevel3',
      space: 'qualitycontrol',
    },
    children: [
      {
        name: 'recallmanage',
        path: 'recallmanage/recallauditlevel3',
        component: recallauditlevel3,
        meta: {
          // secActiveIndex: '/qualitycontrol/recallmanage/recallauditlevel3'
        }
      }
    ]
  }
]
