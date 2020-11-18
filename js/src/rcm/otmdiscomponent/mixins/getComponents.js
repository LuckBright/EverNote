/*
 * @Author: xiongzhiqing@everjiankang.com
 * @Date: 2020-07-06 09:50:09
 * @Last Modified by: xiongzhiqing@everjiankang.com
 * @Last Modified time: 2020-07-06 15:27:49
 * 住院医保管控
 * fix：component is 属性 和 webpack 无法动态获取组件
 */
import { orgList } from '@/rcm/otmdiscomponent/config-js/medicalorglist.js'

const cache = []

// 初始化orgList中定义的componentName,
~(function init () {
  Object.keys(orgList).forEach(key => {
    const { componentName } = orgList[key]
    if (componentName) cache.push(componentName)
  })
})()

/**
 * 获取orgList中
*/
const components = Object.create(null)
const context = require.context('../', true, /\.vue/)
context.keys().forEach(key => {
  const component = context(key)
  if (!component) return
  const componentName = component.name
  // 非orgList中指定的组件 不存储在componets中
  if (!componentName || (componentName && !cache.includes(componentName))) return
  components[componentName] = component
})

export default {
  components: {
    ...components
  }
}
