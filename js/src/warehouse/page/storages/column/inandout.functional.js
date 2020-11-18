export default {
  name: 'inAndOutFunctional',
  functionail: true,
  props: {
    render: Function,
    row: Object,
    index: Number,
    tdKey: String // 列字符field
  },
  render (h, ctx) {
    const { row, toKey: key, render, index } = this
    // this.$options.parent => ctx  上下文
    return render(h, this.$options.parent, row, index) || h('span', row[key])
  }
}
