// import uuidv4 from 'uuid/v4'
export let messageCheckList = [
  {
    id: 'yizhu',
    name: '医嘱信息',
    type: 'yizhu',
    icon: '#icon-linshiyizhu'
  },
  {
    id: 'jianyan',
    name: '检验信息',
    type: 'jianyan',
    icon: '#icon-jianyanwancheng'
  },
  {
    id: 'jiancha',
    name: '检查信息',
    type: 'jiancha',
    icon: '#icon-jianchawancheng1'
  },
  {
    id: 'history',
    name: '既往病历',
    type: 'history',
    icon: '#icon-jiwangbingli'
  }
]
export let menus = [
  {
    name: 'infoCheck',
    order: '1',
    icon: '#icon-xinxichakan2',
    content: '信息查看'
  },
  {
    name: 'nurse',
    order: '2',
    icon: '#icon-huliwenshu2',
    content: '护理文书'
  },
  {
    name: 'doctor',
    order: '3',
    icon: '#icon-binglishuxie2',
    content: '病历书写'
  },
  {
    name: 'clinic',
    order: '4',
    icon: '#icon-binglishuxie',
    content: '门诊病历'
  }
]

export let getMenuList = function (spacename, visitType) {
  // 门诊只返回门诊病历
  if (Number(visitType) === 1) {
    return menus.slice(3)
  }
  let menuObj = {
    'resident': menus.slice(0, 3), // 住院医生
    'inpatient': menus.slice(0, 3), // 住院护士
    'anesthetist': menus.slice(0, 3), // 手术医生
    'nurse': menus.slice(0, 3)// 手术护士
  }
  return menuObj[spacename]
}

export let getNode = function (arr, id) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr[i]
    }
    if (arr[i].children) {
      var n = this.getNode(arr[i].children, id)
      if (n) {
        return n
      }
    }
  }
}

export let getInitCurNode = function (role, spaceName) { // 初始化tab时，需要初始化当前节点
  let spaceNames = ['anesthetist', 'nurse']
  if (spaceNames.includes(spaceName)) return null
  // 1医生 2 护士
  const binganCode = 'ZHU_YUAN_BING_AN_SHOU_YE'
  let nodes = {
    1: {
      code: binganCode,
      type: 'tpl',
      id: binganCode,
      title: '病案首页',
      isUpdate: false,
      recordType: 1,
      isRecall: 1
    },
    2: {
      code: 'TI_WEN_JI_LU_DAN',
      type: 'signcheck',
      id: 'TI_WEN_JI_LU_DAN',
      title: '体温单',
      isUpdate: false,
      recordType: 3
    }
  }

  return nodes[role]
}
export let getActiveTab = function (tabs, targetName) {
  let activeName = ''
  tabs.forEach((tab, index) => {
    if (tab.id === targetName) {
      let nextTab = tabs[index + 1] || tabs[index - 1]
      if (nextTab) {
        activeName = nextTab.id
      }
    }
  })
  return activeName
}

export let createTabItem = function (msg) { // 信息查看需要创建的tabItem
  return {
    id: msg.id,
    title: msg.name,
    name: msg.type,
    content: '',
    type: 'checkMessage'
  }
}

export let courseCodeOfDisease = function () {
  return [
    'BING_CHENG_JI_LU',
    'ZY_SHOU_CI_BING_CHENG_JI_LU',
    'CHA_FANG_JI_LU',
    'JIAO_JIE_BAN_JI_LU',
    'ZHUAN_KE_JI_LU',
    'HUI_ZHEN_JI_LU'
  ]
}
