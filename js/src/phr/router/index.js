import phr from '../page/index'
import main from '../page/main/index'
import datacontrol from '../page/datacontrol/index'
import dataswitch from '../page/dataswitch/index'
import datachannel from '../page/dataswitch/datachannel'
import indexcatalog from '@/bi/page/catalog'

import patientlist from '../page/patientlist/index'
import searchindex from '@/phr/page/patientlist/searchindex'
import patientdetailChild from './patientdetail'
import patientdetail from '@/phr/page/patientdetail/index'
import datainterface from '@/phr/page/datainterface'
import chart from '@/phr/page/analysis/chart/analysischart'
export default [
  {
    path: '/phr',
    name: 'phr',
    redirect: '/phr/main',
    component: phr,
    children: [
      {
        path: 'main',
        component: main
      },
      {
        path: 'dataswitch',
        component: dataswitch
      },
      {
        path: 'datachannel',
        component: datachannel
      },
      {
        path: 'datainterface',
        component: datainterface
      },
      {
        path: 'datacontrol',
        component: datacontrol
      },
      {
        path: 'chart',
        component: chart,
        name: 'biindex',
      },
      {
        path: 'analysis',
        component: indexcatalog,
        name: 'bicatalog',
        meta: {
          showCodeList: ['thc-phr'],
        }
      },
      {
        path: 'patientlist',
        name: 'patientlist',
        component: searchindex,
        meta: {
          full: true
        }
      },
      {
        path: 'patienttable',
        name: 'patienttable',
        component: patientlist,
        meta: {
        }
      },
      {
        path: 'patientdetail',
        component: patientdetail,
        children: [
          ...patientdetailChild
        ]
      }
    ]
  }
]
