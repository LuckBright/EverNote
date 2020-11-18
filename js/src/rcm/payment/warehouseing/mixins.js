/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-11-02 11:38:05
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-11-03 14:59:17
 * 收付款页面 公共方法和属性
 */

export default {
  props: {
    type: String // 入库付款页面或者退库付款页面
  },
  methods: {
    // 过滤入库付款或者退库收款中表格列
    filter (arr, val) {
      return arr.filter(col => (col.use === val || !col.use))
    }
  },
  computed: {
    isEntry () { // 是否是入库付款页面
      return this.type === 'entry'
    },
    char () { //  根据不同页面展示 收 或者 付
      return this.isEntry ? '付' : '收'
    }
  },
}
