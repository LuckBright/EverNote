export default {
  name: 'colTd',
  functional: true,
  props: {
    render: Function,
    row: Object,
    tdKey: String,
    tdKeyName: String
  },
  render (h, ctx) {
    let rowData = ctx.props.row
    let key = ctx.props.tdKey
    return ctx.props.render && ctx.props.render(h, ctx, rowData) || h('span', rowData[key])
  }
}
