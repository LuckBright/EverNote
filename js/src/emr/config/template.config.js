/****
 * 该配置提供了
 * 1，模版管理的导航：getMenuList
 * 2，模版列表：getTemplateList
 * 3，新建和编辑需要获取的模版参数:getDialogParams
 * 4, baseRoute的配置
 * 5,resetEditorObj 获取当前模版的最新信息,
 * 6,getUrl区分医技和其他工作站获取url
 * 7，getEditorOpts  workshopTag: 区分医技和其他工作站获取编辑器的需要的参数; config: 配置该方法中新的参数，如：{copySettings: ['1']}
 * 8,输出右键菜单
 * */
import urlMap from '@/emr/urls'
import urlsfortechMap from '@/infusion/urlsfortech.js'
import storage from '@/util/storage'
import { editorBaseOpts, MEDICAL_EDITOR_OPTIONS } from '@/util/common'
// 角色的值级编码
const normalNurseCode = ['01_01', '01_02', '01_03']
const highNurseCode = ['01_04', '01_05']
const normalDoctorCode = ['06_01', '06_02', '06_03']
const highDoctorCode = ['06_04', '06_05']
export let toRole = function (role, workshopTag) {
  if (normalNurseCode.includes(role)) {
    return 'normalNurseOfHospital'
  } else if (highNurseCode.includes(role)) {
    return 'highNurseOfHospital'
  } else if (normalDoctorCode.includes(role)) {
    if (workshopTag === 'clinic') {
      return 'normalDoctorOfClinic'
    } else {
      return 'normalDoctorOfHospital'
    }
  } else if (highDoctorCode.includes(role)) {
    if (workshopTag === 'clinic') {
      return 'highDoctorOfClinic'
    } else {
      return 'highDoctorOfHospital'
    }
  } else {
    console.error('未找到对应的医生职称')
  }
}
export let levelTwoNames = {
  0: '集团模版',
  1: '机构模版',
  3: '科室模版',
  2: '个人模版'
}
export let levelThreeNames = {
  1: '住院模版',
  2: '门诊模版',
  3: '护理模版',
  4: '个人模版',
  5: '词条模版'
}
let menuList = [// 左侧的菜单
  {
    name: '集团模版',
    businessType: 0,
    businessId: storage.getLocalStorage('TENANTID'),
    isActive: false
  },
  {
    name: '机构模版',
    businessType: 1,
    businessId: storage.getLocalStorage('CLINICID'),
    isActive: false
  },
  {
    name: '科室模版',
    businessType: 3,
    businessId: '',
    isActive: false
  },
  {
    name: '个人模版',
    businessType: 2,
    businessId: storage.getLocalStorage('USERID'),
    isActive: false
  }
]
let workshops = ['orgSetting', 'tech', 'groupManage']
let getMenuByRole = function (menus, code, workshopTag) {
  if (workshops.includes(workshopTag)) return []
  if (!code) return []
  let role = toRole(code, workshopTag)
  let roleObj = {
    'normalDoctorOfClinic': menus.slice(3),
    'highDoctorOfClinic': menus.slice(2),
    'normalDoctorOfHospital': menus.slice(3),
    'highDoctorOfHospital': menus.slice(2),
    'normalNurseOfHospital': menus.slice(3),
    'highNurseOfHospital': menus.slice(2),
  }
  // 设置默认高亮
  let len = roleObj[role].length
  roleObj[role][len - 1].isActive = true
  return roleObj[role]
}
// 通过工作站设置模版管理的菜单项
export let getMenuList = function (workshopTag, code) {
  let menus = JSON.parse(JSON.stringify(menuList))
  let workShopObj = {
    'orgSetting': menus, // 机构设置
    'tech': menus.slice(0, 1).concat(menus.slice(3)), // 医技设置
    'groupManage': menus.slice(0, 1), // 集团管理
    'clinic': getMenuByRole(menus, code, workshopTag), // 门诊
    'hospitalForDoctor': getMenuByRole(menus, code, workshopTag), // 住院医生
    'hospitalForNurse': getMenuByRole(menus, code, workshopTag)// 住院护士
  }
  // console.log(workshopTag, 'workshopTag')
  // 🧍‍♂各个机构需要设置不同的高亮
  return workShopObj[workshopTag]
}

let templateList = [// 模版列表
  {name: '门诊模版', id: '2', icon: 'icon-menzhenmoban'},
  {name: '住院模版', id: '1', icon: 'icon-zhuyuanmoban'},
  {name: '护理模版', id: '3', icon: 'icon-hulimoban'},
  {name: '词条模版', id: '5', icon: 'icon-citiaomoban'}
]
let techTemplateList = [// 医技模版列表
  {name: '检验模版', id: '1'},
  {name: '检查模版', id: '2'},
  {name: '词条模版', id: '5'}
]

let getTemplateListByRole = function (menus, code, workshopTag) {
  if (workshops.includes(workshopTag)) return []
  if (!code) return []
  let role = toRole(code, workshopTag)
  let roleObj = {
    'normalDoctorOfClinic': menus.slice(0, 1).concat(menus.slice(3)),
    'highDoctorOfClinic': menus.slice(0, 1).concat(menus.slice(3)),
    'normalDoctorOfHospital': menus.slice(1, 2).concat(menus.slice(3)),
    'highDoctorOfHospital': menus.slice(1, 2).concat(menus.slice(3)),
    'normalNurseOfHospital': menus.slice(2),
    'highNurseOfHospital': menus.slice(2),
  }
  // 设置默认高亮
  let len = roleObj[role].length
  roleObj[role][len - 1].isActive = true
  return roleObj[role]
}
export let getTemplateList = function (workshopTag, code) {
  let templateMenu = JSON.parse(JSON.stringify(templateList))
  let workShopObj = {
    'orgSetting': templateMenu, // 机构设置
    'tech': techTemplateList, // 医技设置
    'groupManage': templateMenu, // 集团管理
    'clinic': getTemplateListByRole(templateMenu, code, workshopTag), // 门诊
    'hospitalForDoctor': getTemplateListByRole(templateMenu, code, workshopTag), // 住院医生
    'hospitalForNurse': getTemplateListByRole(templateMenu, code, workshopTag)// 住院护士
  }
  return workShopObj[workshopTag]
}
// console.log('集团工作站菜单', getMenuList('groupManage'))
// console.log('集团工作站模版列表', getTemplateList('groupManage'))
// console.log('机构工作站菜单', getMenuList('orgSetting'))
// console.log('机构工作站模版列表', getTemplateList('orgSetting'))
// console.log('医技工作站菜单', getMenuList('tech'))
// console.log('医技工作站模版列表', getTemplateList('tech'))
// console.log('门诊普通医生工作站菜单', getMenuList('clinic', 'normalDoctorOfClinic'))
// console.log('门诊普通医生模版列表', getTemplateList('clinic', 'normalDoctorOfClinic'))
// console.log('门诊高级医生站菜单', getMenuList('clinic', 'highDoctorOfClinic'))
// console.log('门诊高级医生模版列表', getTemplateList('clinic', 'highDoctorOfClinic'))
// console.log('住院普通医生站菜单', getMenuList('hospitalForDoctor', 'normalDoctorOfHospital'))
// console.log('住院普通医生模版列表', getTemplateList('hospitalForDoctor', 'normalDoctorOfHospital'))
// console.log('住院高级医生站菜单', getMenuList('hospitalForDoctor', 'highDoctorOfHospital'))
// console.log('住院高级医生模版列表', getTemplateList('hospitalForDoctor', 'highDoctorOfHospital'))
// console.log('住院普通护士站菜单', getMenuList('hospitalForNurse', 'normalNurseOfHospital'))
// console.log('住院普通护士模版列表', getTemplateList('hospitalForNurse', 'normalNurseOfHospital'))
// console.log('住院高级护士站菜单', getMenuList('hospitalForNurse', 'highNurseOfHospital'))
// console.log('住院高级护士模版列表', getTemplateList('hospitalForNurse', 'highNurseOfHospital'))
export let getDialogParams = function (command, obj, businessType) {
  let tplObj = {} // 组合保存模版和新建模版需要的参数,新建和编辑的弹框里面会用到
  if (command === 'create') {
    // 新建的时候，鼠标肯定点击的是病历类型的节点，而不是模版
    tplObj = {
      categoryId: obj.id, // 该节点为病历类型节点
      businessType: businessType,
      businessId: obj.businessId,
      categoryName: obj.name,
      categoryDepts: [],
      code: obj.code,
      type: obj.type // 1住院，2门诊，3护理，4，其他，5词条
    }
  }
  if (command === 'edit') {
    tplObj = {
      designerId: obj.designerId,
      id: obj.id,
      anotherPage: obj.anotherPage,
      anotherRecord: obj.anotherRecord,
      autoInsertTime: obj.autoInsertTime,
      autoInsertTitle: obj.autoInsertTitle,
      name: obj.name,
      categoryId: obj.categoryId,
      businessType: obj.businessType,
      businessId: obj.businessId,
      formTemplateId: obj.formTemplateId,
      formDataId: obj.formDataId,
      categoryDepts: obj.categoryDepts,
      code: obj.code,
      type: obj.type // 1住院，2门诊，3护理，4，其他，5词条
    }
  }
  return tplObj
}

export let getBaseRoute = function (workshopTag) {
  let baseRouteObj = {
    'orgSetting': '/warehouse/templatemanage/', // 机构设置工作站
    'tech': '/tech/medical_management/template/', // 医技工作站
    'groupManage': '/manages/templatemanage/', // 集团管理工作站
    'hospitalForDoctor': '/resident/prescription/template/templatemanage', // 住院医生工作站
    'hospitalForNurse': '/inpatient/tplmanage/templatemanage', // 住院护士工作站
    'clinic': '/workspace/prescription/template/templatemanage'// 门急诊医生工作站
  }
  if (!baseRouteObj[workshopTag])console.error(workshopTag + '没有配置baseRoute')
  return baseRouteObj[workshopTag]
}
// console.log('机构设置工作站baseRoute', getBaseRoute('orgSetting'))
// console.log('医技工作站baseRoute', getBaseRoute('tech'))
// console.log('集团工作站baseRoute', getBaseRoute('groupManage'))

export let resetEditorObj = function (node) {
  return {
    designerId: node.designerId,
    id: node.id,
    anotherPage: node.anotherPage,
    anotherRecord: node.anotherRecord,
    autoInsertTime: node.autoInsertTime,
    autoInsertTitle: node.autoInsertTitle,
    name: node.name,
    categoryId: node.categoryId,
    categoryName: node.categoryName,
    businessType: node.businessType, // 参考levelTwoNames
    businessId: node.businessId,
    formTemplateId: node.formTemplateId,
    formDataId: node.formDataId,
    categoryDepts: node.categoryDepts,
    type: node.type, // 参考levelThreeNames
    auditStatus: node.auditStatus
  }
}

export let getUrl = function (workshopTag) {
  if (workshopTag === 'tech') {
    return urlsfortechMap
  } else {
    return urlMap
  }
}

export let getEditorOpts = function (workshopTag) {
  let editorOpts = {
    ...editorBaseOpts,
    ...MEDICAL_EDITOR_OPTIONS
  }
  if (workshopTag === 'tech') {
    editorOpts.systemInsert.splice(1, 3)
  }
  return editorOpts
}

export let handleRoute = function (vm, {templateId, dataId, businessType, name}) {
  if (!vm.workshop) return console.error('请检查工作站标识workshop是否存在     ')
  let routeConfig = {
    path: getBaseRoute(vm.workshop),
    query: {
      name: name,
      templateId: templateId,
      dataId: dataId, // 表单模版会有dataId
      businessType: businessType
    }
  }
  vm.$router.replace(routeConfig)
}
export const printCommand = function (command, data) {
  // console.log(command, data)
}

// 如果病程记录里面增加了新的类型，需要配置此code
export const BING_CHENG_JI_LU_CODE = [
  'ZY_SHOU_CI_BING_CHENG_JI_LU',
  'CHA_FANG_JI_LU',
  'JIAO_JIE_BAN_JI_LU',
  'ZHUAN_KE_JI_LU',
  'HUI_ZHEN_JI_LU',
  'BING_CHENG_JI_LU'
]
