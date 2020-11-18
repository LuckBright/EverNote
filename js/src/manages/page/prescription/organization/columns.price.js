export default [
  {
    prop: 'managerPermission',
    slotName: 'managerPermission',
    label: '管理权',
    display: true,
    width: '70px',
    render (h, ctx, row) {
      return h('span', row.managerPermission ? '开启' : '关闭')
    }
  }, {
    prop: 'usePermission',
    slotName: 'usePermission',
    label: '使用权',
    display: true,
    width: '70px',
    render (h, ctx, row) {
      return h('span', row.usePermission ? '开启' : '关闭')
    }
  }
]

