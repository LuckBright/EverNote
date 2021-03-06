// 医疗待遇类别
export const treatType = {
  '11': '在职',
  '12': '在职公务员',
  '13': '在职省级以上劳模',
  '14': '在职保健对象',
  '16': '在职一级保健对象',
  '21': '退休',
  '22': '退休公务员',
  '23': '退休省级以上劳模',
  '24': '退休保健对象',
  '25': '建国前退休人员',
  '26': '退休一级保健对象',
  '31': '离休人员',
  '32': '老红军',
  '33': '二等乙级伤残军人',
  '34': '特殊全免人员',
  '71': '铁路通化在职',
  '72': '铁路通化在职公务员',
  '73': '铁路通化退休',
  '74': '铁路通化退休公务员',
  '81': '铁路吉林在职',
  '82': '铁路吉林在职公务员',
  '83': '铁路吉林退休',
  '84': '铁路吉林退休公务员',
  '91': '铁路长春在职',
  '92': '铁路长春在职公务员',
  '93': '铁路通化退休',
  '94': '铁路通化退休公务员',
}
// 在院状态
export const hosStatus = {
  '0': '不在院',
  '1': '在院',
}
// 统筹区域
export const overallArea = {
  '229900': '吉林省'
}
// 参保状态
export const medicalStatus = {
  '0': '未参保',
  '1': '参保缴费',
  '2': '暂停参保',
  '3': '终止参保',
}
// 医疗人员类别
export const personType = {
  '11': '在职',
  '21': '退休',
  '31': '离休',
  '33': '二等乙级伤残军人',
  '72': '城镇居民未成年人(在校)',
  '73': '城镇居民未成年人(非在校)',
  '74': '城镇居民成年人',
  '75': '城镇居民老年人',
  '76': '城镇居民大学生',
}
// 公务员标识
export const functionaryType = {
  '0': '非公务员',
  '1': '国家公务员',
  '2': '依照公务员',
  '3': '参照公务员',
}
// 保健对象标识
export const healthcareType = {
  '0': '非',
  '11': '一级(正省)',
  '12': '一级(副省)',
  '21': '二级(正厅)',
  '22': '二级(副厅)',
  '23': '二级(正高)',
}
// 特殊人员标识
export const specialPersonType = {
  '0': '非',
  '1': '建国前退休人员',
  '2': '省级省以上劳模',
  '3': '工伤人员',
  '4': '老红军',
  '5': '离休抗战正厅',
  '6': '离休抗战副厅',
  '7': '离休解放正厅',
  '8': '离休抗战处及处以下',
  '9': '离休解放副厅',
  '10': '离休正高',
}
// 险种类型
export const fundType = {
  '31': '基本医疗保险',
  '32': '大额医疗补助',
  '33': '公务员补充医疗保险',
  '35': '离休医疗保险',
  '36': '二等乙医疗保险',
  '3J': '保健对象补贴',
  '41': '工伤保险',
  '51': '生育保险',
}
// 单位类型
export const unitType = {
  '10': '企业',
  '11': '矿山类企业（煤矿类）',
  '12': '矿山类企业（非煤矿类）',
  '13': '建筑施工企业',
  '14': '餐饮类企业',
  '15': '住宿类企业',
  '30': '机关',
  '31': '参公管理单位',
  '50': '事业',
  '70': '社会团体',
  '80': '城镇个体工商户',
  '91': '民办非企业单位',
  '95': '社会化管理单位',
  '9A': '再就业服务中心',
  'B2': '异地就医平台虚拟单位',
  'B3': '铁路',
}
// 吉林医保的登记需要，“出院原因”为必填
export const leaveHospitalReason = [
  {
    id: '0', name: '正常治愈出院'
  },
  {
    id: '1', name: '未治愈出院'
  },
  {
    id: '2', name: '医院要求转院'
  },
  {
    id: '3', name: '病人要求转院'
  },
  {
    id: '6', name: '死亡'
  },
  {
    id: '9', name: '其他'
  }]

// 医保交易类型
export const jlsbTradeType = {
  '0': '预结算',
  '1': '结算',
  '2': '退费'
}

// 收费项目种类
export const itemType = {
  '1': '药品',
  '2': '诊疗项目',
  '3': '服务设施',
  '4': '费用大类(动态库不用)'
}
// 收费类别
export const itemClass = {
  '11': '西药',
  '12': '中成药',
  '13': '中草药',
  '21': '检查费',
  '22': '特殊检查费',
  '23': '输氧费',
  '24': '手术费',
  '25': '化验费',
  '26': '输血费',
  '27': '诊察费',
  '28': '一般诊疗费',
  '29': 'CT',
  '30': '核磁',
  '31': '治疗费',
  '32': '特殊治疗费',
  '33': '护理费',
  '34': '床位费',
  '35': '取暖费',
  '36': 'B超',
  '37': '注射费',
  '38': '透析费',
  '39': '化疗费',
  '41': '医疗服务费',
  '42': '麻醉费',
  '43': '安装器官',
  '44': '产前检查费',
  '45': '新生儿费',
  '46': 'X光费',
  '47': '处置费',
  '91': '其他费用',
  '92': '挂号费',
  '94': '材料费',
}
