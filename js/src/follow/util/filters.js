import Vue from 'vue'
import {genderList, jobTypeList, materialType, sendTypeList, runMethodType, commonStatusList, jobCreateTypeList, commonBooleanList, userTypeList, isSystemList, diseaseGroup} from '@/follow/util/model'
import {listDestValue} from '@/util/common'
const indentValue = value => `<div class="indent-content">${value || ''}</div>`
// 在全局挂载 filter： filterJobType
Vue.filter('filterJobType', function (value, type = '') {
  const _value = listDestValue(jobTypeList, value)
  if (type === '') {
    return _value
  } else if (type === 'indent') {
    return indentValue(_value)
  }
})
Vue.filter('filterMaterialType', function (value, type = '') {
  const _value = listDestValue(materialType, value)
  if (type === '') {
    return _value
  } else if (type === 'indent') {
    return indentValue(_value)
  }
})
Vue.filter('filterSendType', function (value, type = '') {
  const _value = listDestValue(sendTypeList, value)
  if (type === '') {
    return _value
  } else if (type === 'indent') {
    return indentValue(_value)
  }
})
Vue.filter('filterRunMethod', function (value, type = '') {
  const _value = listDestValue(runMethodType, value)
  if (type === '') {
    return _value
  } else if (type === 'indent') {
    return indentValue(_value)
  }
})
// 在全局挂载 filter： filterJobCreateType
Vue.filter('filterJobCreateType', function (value) {
  return listDestValue(jobCreateTypeList, value ? 1 : 0)
})
// 在全局挂载 filter： filterIsSystem
Vue.filter('filterIsSystem', function (value) {
  return listDestValue(isSystemList, value ? 1 : 0)
})
// 在全局挂载 filter： filterJobCreateType
Vue.filter('filterDiseaseGroup', function (value) {
  return listDestValue(diseaseGroup, value ? 1 : 0)
})
// 在全局挂载 filter： filterCommonBoolean
Vue.filter('filterCommonBoolean', function (value) {
  return listDestValue(commonBooleanList, value ? 1 : 0)
})
// 在全局挂载 filter： filterGenderId
Vue.filter('filterGenderId', function (value) {
  return listDestValue(genderList, value)
})
// 在全局挂载 filter： filterStatus
Vue.filter('filterStatus', function (value) {
  return listDestValue(commonStatusList, value ? 1 : 0)
})
// 在全局挂载 filter： filterAgeRange
Vue.filter('filterAgeRange', function (value) {
  let res = ''
  if (value.start.year === 0 && value.start.month === 0 && value.end.year === 130) {
    res = '不限'
  } else if ((value.start.year === 0 && value.start.month === 0)) {
    // 开始年龄不限
    res = `小于${value.end.year ? `${value.end.year}岁` : ''}${value.end.month ? `${value.end.month}个月` : ''}`
  } else if (value.end.year === 130) {
    // 结束年龄不限
    res = `大于${value.start.year ? `${value.start.year}岁` : ''}${value.start.month ? `${value.start.month}个月` : ''}`
  } else {
    res = `${value.start.year ? `${value.start.year}岁` : ''}${value.start.month ? `${value.start.month}个月` : ''} - ${value.end.year ? `${value.end.year}岁` : ''}${value.end.month ? `${value.end.month}个月` : ''}`
  }
  return res
})

// 在全局挂载 filter： filterCategoryObj
Vue.filter('filterCategoryObj', function (value) {
  if (value.length === 0 || value[0].name === undefined) {
    return ''
  }
  return value.map(item => item.name).join('/')
})
// 在全局挂载 filter： filterMultipleList 通用的多行展示
Vue.filter('filterMultipleList', function (value) {
  if (value.length === 0) {
    return '不限'
  }
  return value.map(item => `<div class="view-item">${item.name}</div>`).join('')
})
// 在全局挂载 filter： filterMultipleList 通用的行内展示
Vue.filter('filterMultipleInlineList', function (value) {
  if (value.length === 0) {
    return ''
  }
  return value.map(item => `<span class="view-inline-item">${item.name}</span>`).join('')
})
// 在全局挂载 filter： filterIndentValue 展示有缩进样式的内容
Vue.filter('filterIndentValue', function (value) {
  return indentValue(value)
})
// 在全局挂载 filter： filterGenderId
Vue.filter('filterUserType', function (value) {
  return listDestValue(userTypeList, value)
})
// 在全局挂载 filter： filterIndentValue 展示有缩进样式的内容
Vue.filter('filterAppointValue', function (value) {
  if (value && Object.keys(value).length > 0) {
    // Object.keys(value).map(v => {
    //   if (v.includes('name')) {
    //     console.log(value[v], 'name')
    //     return `<div class="indent-content">${value[v] || ''}</div>`
    //   }
    // })
    if (value.name) {
      return `<div class="indent-content">${value.name || ''}</div>`
    }
    if (value.orgSubjectName) {
      return `<div class="indent-content">${value.orgSubjectName || ''}</div>`
    }
    if (value.serviceName) {
      return `<div class="indent-content">${value.serviceName || ''}</div>`
    }
  }
})
