/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-06-03 10:47:33
 * @Last Modified by:   xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-03 10:47:33
 */

import sysvalue from '@/warehouse/store/sysvalueapi'

export default {
  data () {
    return {
      width: 500,
      options: []
    }
  },
  methods: {
    getOptions () {
      return new Promise((resolve, reject) => {
        sysvalue.listOnce('THC_WH_SUPPLYRELATION_TYPE').then(result => {
          if (Array.isArray(result) && result.length) {
            this.options = result
            resolve(result)
          } else {
            resolve([])
          }
        })
      })
    }
  }
}
