export const managerSchema = [
  {
    name: 'paramType',
    comp: 'select',
    label: '订单搜索',
    props: {
      options: [
        {
          value: 0,
          name: '订单号',
        },
        {
          value: 1,
          name: '收货人姓名',
        },
        {
          value: 2,
          name: '收货人电话',
        },
      ],
    },
    span: 5,
  },
  {
    name: 'paramValue',
    labelWidth: '5px',
    span: 4,
  },
  {
    name: 'orderSourceId',
    comp: 'select',
    label: '订单来源',
    labelWidth: '80px',
    props: {
      options: [],
    },
    span: 6,
  },
  {
    name: 'orderStatus',
    comp: 'select',
    label: '订单状态',
    props: {
      options: [
        {
          value: '',
          name: '全部',
        },
        {
          value: 10,
          name: '待付款',
        },
        {
          value: 20,
          name: '待发货',
        },
        {
          value: 21,
          name: '部分发货',
        },
        {
          value: 22,
          name: '已发货',
        },
        {
          value: 30,
          name: '已完成',
        },
        {
          value: 40,
          name: '已取消',
        },
        {
          value: -20,
          name: '退款中',
        },
        {
          value: -30,
          name: '已退款',
        },
        {
          value: -40,
          name: '退款失败',
        },
      ],
      clearable: false,
    },
    newRow: true,
    span: 5,
  },
  {
    name: 'orderType',
    comp: 'select',
    label: '订单类型',
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
    name: 'amountStart',
    label: '价格',
    labelWidth: '50px',
    props: {
      placeholder: '价格区间',
      maxlength: 8,
    },
    span: 3,
  },
  {
    name: 'amountEnd',
    label: '~',
    labelWidth: '40px',
    props: {
      placeholder: '价格区间',
      maxlength: 8,
    },
    span: 3,
  },
  {
    name: 'button',
    comp: 'custom',
    labelWidth: '10px',
    span: 3,
  },
]
