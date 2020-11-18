export const ID_CARD_AGENCY_SCHEMA = [
  {
    name: 'name',
    label: '身份卡名称',
    props: {
      disabled: true
    }
  },
  {
    name: 'price',
    label: '价格',
    slots: [
      {
        name: 'append',
        template: '<span>元</span>'
      }
    ],
    props: {
      disabled: true
    }
  },
  {
    name: 'discountSelect',
    label: '优惠类型',
    props: {
      disabled: true
    }
  },
  {
    name: 'validPeriod',
    label: '有效期',
    slots: [
      {
        name: 'append',
        template: '<span>月</span>'
      }
    ],
    props: {
      disabled: true
    }
  }
]
