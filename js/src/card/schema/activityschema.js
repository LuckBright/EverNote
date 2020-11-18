export const ACTIVITY_AGENCY_SCHEMA = [
  {
    name: 'name',
    label: '活动名称',
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
    name: 'activityTime',
    label: '活动起止时间',
    comp: 'custom'
  },
  {
    name: 'remark',
    label: '备注',
    props: {
      disabled: true
    }
  }
]
