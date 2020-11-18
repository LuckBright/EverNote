export const demoTableColumnArr = [
  {
    prop: 'param',
    label: '参数/属性/事件',
    width: '180',
  },
  {
    prop: 'description',
    label: '说明',
  },
  {
    prop: 'type',
    label: '类型',
    width: '200',
  },
  {
    prop: 'required',
    label: '必填',
    width: '100',
    customCellSpanClassFormatter: ({ value }) => value ? 'demo-female' : '',
    formatter: ({ value }) => value ? '是' : ''
  },
  {
    prop: 'default',
    label: '默认值',
    width: '200',
  }
]
