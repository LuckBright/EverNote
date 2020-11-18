/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2019-11-13 11:26:42
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-01-02 16:37:37
 */
export default {
  name: 'coltdFunctional',
  functionail: true,
  props: {
    render: Function,
    row: Object,
    index: Number,
    isHiddenTableBatchCol: Boolean, // 特殊字段 当前列表是否需要使用合并数量
    configColumns: { // 批次定价专用，一个列表的当前初始话的配置列
      type: Array,
      default: () => ([])
    },
    dataMap: Map, // 批次定价专用，当前列表数据的 Map
    pageType: Number, // 自定义业务需要页面标记(发药界面所属项 1、任务审核  2、任务列表／收方发药  3、缺货任务  4、发药记录)
    tdKey: String // 列字符field
  },
  render (h, ctx) {
    const { row, toKey: key, render, index, pageType, isHiddenTableBatchCol = false, dataMap, configColumns } = this
    // 合并页面标记pageType进入row
    // this.$options.parent => ctx  上下文
    return render(h, this.$options.parent, Object.assign(row, { pageType }), index, isHiddenTableBatchCol, dataMap, configColumns) || h('span', row[key])
  }
}
