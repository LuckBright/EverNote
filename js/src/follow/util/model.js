import { diction } from '@/store/common'
export const jobCreateTypeList = [
  {
    id: 0,
    name: '无需审核'
  },
  {
    id: 1,
    name: '审核'
  }
]
export const commonStatusList = [
  {
    id: 0,
    name: '禁用'
  },
  {
    id: 1,
    name: '启用'
  }
]
export const commonBooleanList = [
  {
    id: 0,
    name: '否'
  },
  {
    id: 1,
    name: '是'
  }
]
export const genderList = [
  {
    id: 0,
    name: '不限'
  },
  {
    id: 1,
    name: '男'
  },
  {
    id: 2,
    name: '女'
  },
]
export const jobTypeList = [
  {
    id: '1',
    name: '事件提醒'
  },
  {
    id: '2',
    name: '短信提醒'
  },
  {
    id: '3',
    name: '电话提醒'
  },
  {
    id: '4',
    name: '挂号'
  },
  {
    id: '5',
    name: '商城商品'
  },
  {
    id: '6',
    name: '保障计划'
  }
]
export const sendTypeList = [
  {
    id: 1,
    name: '短信'
  },
  {
    id: 2,
    name: '微信'
  }
]
export const executeTypeList = [
  {
    id: 1,
    name: '医护人员执行'
  },
  {
    id: 2,
    name: '患者执行'
  }
]
export const materialStatus = [
  {
    id: '',
    name: '全部',
    icon: '',
    color: ''
  },
  {
    id: 0,
    name: '待审核',
    icon: 'bGray',
    color: 'DEDEDE'
  },
  {
    id: 2,
    name: '执行中',
    icon: 'bOrange',
    color: '#FF9C00'
  },
  {
    id: 3,
    name: '已完成',
    icon: 'bGreen',
    color: '#00B636'
  },
  {
    id: 4,
    name: '已取消',
    icon: 'bBlue',
    color: '#1DBCB6'
  },
  {
    id: 7,
    name: '审核未通过',
    icon: 'bBlue',
    color: '#1DBCB6'
  }
]
export const taskStatus = [
  {
    id: '',
    name: '全部',
    icon: '',
    color: ''
  },
  {
    id: 1,
    name: '待执行',
    icon: 'bGray',
    color: '#DEDEDE'
  },
  {
    id: 2,
    name: '执行中',
    icon: 'bOrange',
    color: '#FF9C00'
  },
  {
    id: 3,
    name: '已完成',
    icon: 'bGreen',
    color: '#00B636'
  },
  {
    id: 4,
    name: '已取消',
    icon: 'bBlue',
    color: '#1DBCB6'
  }
]
export const pattern = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  CREATE: 'CREATE',
}
export const pattern2 = {
  VIEW: 'VIEW2',
  EDIT: 'EDIT2',
  CREATE: 'CREATE',
}
export const runMethodType = [
  {
    id: 0,
    name: '随计划启动'
  },
  {
    id: 1,
    name: '任务触发'
  },
  {
    id: 2,
    name: '事件触发'
  },
  {
    id: 3,
    name: '自定义'
  }
]
export const materialType = [
  {
    id: 1,
    name: '通知'
  },
  {
    id: 2,
    name: '医嘱'
  },
  {
    id: 3,
    name: '患教'
  },
  {
    id: 4,
    name: '问卷'
  },
  {
    id: 5,
    name: '商品'
  }
]
export const fromOrigin = {
  follow: 'follow',
}
export const eventType = {
  save: 'save'
}
export const userTypeList = [
  {
    id: 0,
    name: '全部'
  },
  {
    id: 1,
    name: '临时档患者'
  },
  {
    id: 2,
    name: '正式档患者'
  },
]
export const evenTypeList = [
  {
    id: 0,
    name: '普通'
  },
  {
    id: 1,
    name: '预约'
  }
]
export const isSystemList = [
  {
    id: 0,
    name: '系统自动'
  },
  {
    id: 1,
    name: '手动'
  }
]
export const allSystemList = [
  {
    id: '',
    name: '全部'
  },
  {
    id: 0,
    name: '系统自动'
  },
  {
    id: 1,
    name: '手动'
  }
]
export const diseaseGroup = [
  {
    id: 0,
    name: '定期复查指征组'
  },
  {
    id: 1,
    name: '抗病毒治疗指征组'
  }
]
export const relationList = [
  {
    id: 1,
    name: '等于'
  },
  {
    id: 2,
    name: '大于'
  },
  {
    id: 3,
    name: '小于'
  },
  {
    id: 4,
    name: '不等于'
  },
  {
    id: 5,
    name: '大于等于'
  },
  {
    id: 6,
    name: '小于等于'
  },
  {
    id: 7,
    name: '模糊匹配'
  },
  {
    id: 8,
    name: '两者之间'
  },
  {
    id: 9,
    name: '从属于'
  }
]

export const followMap = {
  design: `${diction.surveyIndex}/survey/design/0/`, // 预览问卷
  preview: `${diction.surveyIndex}/survey/preview/`, // 预览问卷
  answer: `${diction.surveyIndex}/survey/answer/` // 答题问卷 /:id/:aid
}

// 0设计中，1执行中，2已结束
export const surveyStatus = [
  {
    id: 0,
    name: '未发布'
  },
  {
    id: 1,
    name: '已发布'
  },
  {
    id: 2,
    name: '已结束'
  }
]
