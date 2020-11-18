export const HOSPITAL_SCHEMA = [
  {
    name: 'sort',
    label: '权重：',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '展示文案：',
    props: {
      placeholder: '不超过4个字',
      maxlength: 4,
      clearable: true
    }
  },
  {
    name: 'context',
    label: '链接地址：',
    comp: 'custom'
  },
  {
    name: 'status',
    comp: 'custom'
  }
]

export const PASS_SITE_SCHEMA = [
  {
    name: 'sort',
    label: '权重：',
    comp: 'custom'
  },
  {
    name: 'img',
    label: '展示图片：',
    comp: 'custom'
  },
  {
    name: 'context',
    label: '链接地址：',
    comp: 'custom'
  },
  {
    name: 'status',
    comp: 'custom'
  }
]

export const SQUARE_SITE_SCHEMA = [
  {
    name: 'sort',
    label: '权重：',
    comp: 'custom'
  },
  {
    name: 'name',
    label: '标题：',
    props: {
      placeholder: '不超过12个字',
      maxlength: 12,
      clearable: true
    }
  },
  {
    name: 'subTitle',
    label: '介绍：',
    props: {
      placeholder: '不超过30个字',
      maxlength: 30,
      type: 'textarea'
    }
  },
  {
    name: 'img',
    label: '展示图片：',
    comp: 'custom'
  },
  {
    name: 'context',
    label: '链接地址：',
    comp: 'custom'
  },
  {
    name: 'status',
    comp: 'custom'
  }
]

export const DOCTOR_INFO_SCHEMA = [
  {
    name: 'doctorInfo',
    label: '展示图片：',
    comp: 'custom'
  },
  {
    name: 'sort',
    label: '权重：',
    comp: 'custom'
  }
]
