/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-05-28 10:44:45
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-06-02 14:58:13
 */
import api from '@/rcm/store/tariffs/modify.price.api'
import price from '@/manages/components/price.manage/price.info.js'
import sysvalue from '@/warehouse/store/sysvalueapi'

const filterSysValue = function filterSysValue (list, codes, key = 'id') {
  return list.filter(item => {
    const data = item[key]
    let child = item.children || []
    if (child.length) {
      return (item.children = filterSysValue(child, codes, key))
    }
    return !codes.includes(data)
  })
}
export default {
  // 初始化获取价格列 和  价格维度
  initItemCol ({ commit }, sourceModule) {
    // 注入 来源 warehouse | cpoe
    commit('sourceModule', sourceModule)
    api.initItemCol({ sourceModule }).then(res => {
      const { code, data = {} } = res || {}
      if (code === 0) {
        commit('initItemCol', data)
      }
    })
  },
  // 查询系统分类值级
  initSysValue ({ commit }, filtercodes) {
    sysvalue.cascade('THC_WH_OBJECT_TYPE', filtercodes).then(res => {
      if (Array.isArray(res)) {
        // 过滤掉 值级中 341 骨耗材
        commit('initSysValue', filterSysValue(res, ['341']))
      }
    })
  },
  initGetPriceColumns ({ commit }) {
    price.getPriceBaseColumns().then(res => {
      if (Array.isArray(res)) {
        commit('setPriceColumns', price.getPriceColumns(res, {}, 'id', true))
      }
    })
  }
}
