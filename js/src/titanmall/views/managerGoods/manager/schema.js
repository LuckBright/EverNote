const schema = [
  {
    name: 'name',
    comp: 'input',
    label: '商品名称',
    props: {
      clearable: true,
    },
    span: 10,
  },
  {
    name: 'groupId',
    comp: 'select',
    label: '商品分组',
    labelWidth: '78px',
    props: {
      options: [],
      clearable: true,
      filterable: true,
    },
    span: 6,
  },
  {
    name: 'type',
    comp: 'select',
    label: '商品类型',
    props: {
      options: [
        {
          value: '',
          name: '全部',
        },
        {
          value: 0,
          name: '商品',
        },
        {
          value: 1,
          name: '服务',
        },
      ],
      clearable: false,
    },
    newRow: true,
    span: 5,
  },
  {
    name: 'stockType',
    comp: 'select',
    label: '库存类型',
    props: {
      options: [
        {
          value: '',
          name: '全部',
        },
        {
          value: 0,
          name: 'THC库存',
        },
        {
          value: 1,
          name: '非THC库存',
        },
      ],
      clearable: false,
    },
    span: 5,
  },
  {
    name: 'minPrice',
    comp: 'input',
    label: '价格',
    labelWidth: '50px',
    props: {
      placeholder: '请输入',
      maxlength: 8,
      clearable: true,
    },
    span: 3,
  },
  {
    name: 'maxPrice',
    comp: 'input',
    label: '~',
    labelWidth: '40px',
    props: {
      placeholder: '请输入',
      maxlength: 8,
      clearable: true,
    },
    span: 3,
  },
  {
    name: 'button',
    comp: 'custom',
    labelWidth: '10px',
    span: 4,
  },
]
export default schema
