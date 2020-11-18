/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-03 10:47:57
 * @Last Modified by:   xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-03 10:47:57
 */
import SupplyList from '../srm/supplylist.vue'
import Supply from '../srm/supply.vue'
export default [
  {
    path: 'supplys',
    name: 'SupplyList',
    component: SupplyList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: 'supply',
    name: 'Supply',
    component: Supply,
    meta: {
      thirdActiveIndex: '/warehouse/supplys'
    }
  }
]
