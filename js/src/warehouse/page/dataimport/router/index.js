import DataImportLayout from '@/warehouse/page/dataimport/page/layout.vue'
import DataList from '@/warehouse/page/dataimport/page/list'
import DataLog from '@/warehouse/page/dataimport/page/datalog'

export default function (opt) {
  let thirdActiveIndex = opt.thirdActiveIndex || ''
  return [
    {
      path: 'dataimport',
      component: DataImportLayout,
      redirect: 'dataimport/list',
      children: [
        {
          name: 'dataimportlist',
          path: 'list',
          component: DataList,
          meta: {
            thirdActiveIndex,
            h: true,
          }
        },
        {
          name: 'datalog',
          path: 'log/:id',
          component: DataLog,
          meta: {
            thirdActiveIndex
          }
        },
      ]
    }
  ]
}
