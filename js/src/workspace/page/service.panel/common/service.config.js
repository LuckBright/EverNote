// 服务看板图标列表
const SERVICE_ICON = [
  {
    name: 'arrival',
    label: '到院',
    icon: 'icon-daozhen1',
    sicon: 'icon-daozhen1',
    color: '#1C7BEF',
    openType: 'current',
    keys: ['checkment_arrival', 'medicaltreatment_arrival']
  },
  {
    name: 'yu_jian',
    label: '预检',
    icon: 'icon-yujian',
    sicon: 'icon-yiyujian',
    color: '#1C7BEF',
    openType: 'current',
    keys: ['checkment_physical', 'medicaltreatment_physical']
  },
  {
    name: 'jie_zhen',
    label: '接诊',
    icon: 'icon-jiezhen',
    sicon: 'icon-yijiezhen',
    color: '#1C7BEF',
    openType: 'jump',
    keys: ['checkment_encounter', 'checkment_reencounter', 'checkment_reencountered']
  },
  {
    name: 'kai_hao_cai',
    label: '开耗材',
    icon: 'icon-yiliaozhuguan',
    color: '#1C7BEF'
  },
  {
    name: 'fa_yao',
    label: '发药',
    icon: 'icon-yaopinjinxingzhong',
    icon1: 'icon-yaopinjinxingzhong1',
    sicon: 'icon-beiyaowancheng',
    color: '#1C7BEF',
    openType: 'jump',
    keys: ['takeMedicine_receivedrug', 'takeWeasternMedicine_receivedrug']
  },
  {
    name: 'jian_yan',
    label: '检验',
    icon: 'icon-jianyan',
    sicon: 'icon-jianyanwancheng',
    color: '#1C7BEF'
  },
  {
    name: 'jian_cha',
    label: '检查',
    icon: 'icon-jiancha',
    sicon: 'icon-jianchawancheng1',
    color: '#1C7BEF'
  },
  {
    name: 'chu_zhi',
    label: '处置',
    icon: 'icon-jiezhenzhong',
    sicon: 'icon-jiezhenwancheng',
    color: '#1C7BEF'
  },
  {
    name: 'bao_xian_jie_zhang',
    label: '保险结账',
    icon: 'icon-baoxianzhuanyuan1',
    color: '#1C7BEF',
    tag: 'rcm'
  },
  {
    name: 'jie_zhang',
    label: '结账',
    icon: 'icon-jiezhang',
    sicon: 'icon-jiezhangwancheng',
    color: '#1C7BEF',
    tag: 'rcm'
  },
  {
    name: 'li_yuan',
    label: '离院',
    color: '#1C7BEF',
    icon: 'icon-likai1',
    sicon: 'icon-yilikai'
  },
  {
    name: 'da_yin',
    label: '打印',
    icon: 'icon-dayinght',
    sicon: 'icon-jiancha-num',
    color: '#1C7BEF'
  },
  {
    name: 'wen_juan',
    label: '问卷',
    icon: 'icon-wenjuan',
    sicon: 'icon-jiancha-num',
    color: '#1C7BEF'
  },
  {
    name: 'cancel_appointment',
    label: '取消预约',
    icon: 'icon-zhuyuan-yizhu-bohui',
    color: '#1C7BEF',
    type: 'cancel'
  },
  {
    name: 'change_appointment',
    label: '修改预约',
    icon: 'icon-gaiyue1',
    color: '#1C7BEF',
    type: 'edit'
  },
  {
    name: 'changepoint',
    label: '修改挂号',
    icon: 'icon-gaiyue1',
    color: '#1C7BEF',
    type: 'edit'
  }
]
// 图标操作说明
const EXPLAIN_ICON = [[
  {
    label: '到院',
    icon: 'icon-daozhen1',
    color: '#1C7BEF'
  }],
[{
  label: '预检',
  icon: 'icon-yujian',
  color: '#1C7BEF'
},
{
  label: '预检已完成',
  icon: 'icon-yiyujian',
  color: '#28A94E'
},
{
  label: '预检不可用',
  icon: 'icon-yujian',
  color: '#BBBBBB'
}],
[{
  label: '接诊',
  icon: 'icon-jiezhen',
  color: '#1C7BEF'
},
{
  label: '接诊已完成',
  icon: 'icon-yijiezhen',
  color: '#28A94E'
}],
[{
  label: '医疗主管',
  icon: 'icon-yiliaozhuguan',
  color: '#1C7BEF'
},
{
  height: '37px'
},
{
  label: '医疗主管不可用',
  icon: 'icon-yiliaozhuguan',
  color: '#BBBBBB'
}],
[{
  label: '发药',
  icon: 'icon-yaopinjinxingzhong',
  color: '#1C7BEF'
},
{
  name: 'fa_yao',
  label: '发药已完成',
  icon: 'icon-beiyaowancheng',
  color: '#28A94E'
},
{
  label: '发药异常',
  icon: 'icon-yaopinjinxingzhong',
  color: '#EE4433'
}],
[{
  label: '检验',
  icon: 'icon-jianyan',
  color: '#1C7BEF'
},
{
  label: '检验已完成',
  icon: 'icon-jianyanwancheng',
  color: '#28A94E'
},
{
  label: '检验异常',
  icon: 'icon-jianyan',
  color: '#EE4433'
}],
[{
  label: '检查',
  icon: 'icon-jiancha2',
  color: '#1C7BEF'
},
{
  label: '检查已完成',
  icon: 'icon-jianchawancheng1',
  color: '#28A94E'
},
{
  label: '检查异常',
  icon: 'icon-jiancha',
  color: '#EE4433'
}],
[{
  label: '处置',
  icon: 'icon-jiezhenzhong',
  color: '#1C7BEF'
},
{
  label: '处置已完成',
  icon: 'icon-jiezhenwancheng',
  color: '#28A94E'
}],
[{
  label: '保险结账',
  icon: 'icon-baoxianzhuanyuan1',
  color: '#1C7BEF'
}],
[{
  label: '结账',
  icon: 'icon-jiezhang',
  color: '#1C7BEF'
},
{
  label: '结账已完成',
  icon: 'icon-jiezhangwancheng',
  color: '#28A94E'
}],
[{
  label: '离开',
  color: '#1C7BEF',
  icon: 'icon-likai1'
},
{
  label: '已离开',
  color: '#28A94E',
  icon: 'icon-yilikai'
}],
[{
  label: '打印',
  icon: 'icon-dayinght',
  color: '#1C7BEF'
}],
[{
  label: '问卷',
  icon: 'icon-wenjuan',
  color: '#1C7BEF'
},
{
  label: '问卷已完成',
  icon: 'icon-wenjuanyiwancheng',
  color: '#28A94E'
}],
[{
  label: '取消预约',
  icon: 'icon-zhuyuan-yizhu-bohui',
  color: '#1C7BEF'
}],
[{
  label: '修改预约',
  icon: 'icon-gaiyue1',
  color: '#1C7BEF'
}]]
export { SERVICE_ICON, EXPLAIN_ICON }
