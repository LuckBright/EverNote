/*
 * @Author: xujianwei
 * @Date: 2018-08-01 10:06:52
 * @Last Modified by: xujianwei
 * @Last Modified time: 2020-05-29 19:12:07
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from "./zh-ch.js"
import en from "./en.js"

Vue.use(VueI18n)

var factor = {
  cn: cn,
  en: en
}

Vue.config.productionTip = true

//通过修改localStorage里面的lang修改全局语言配置，修改后刷新页面
let lang = localStorage.getItem("LANG") || "cn"

let messages = {
  [lang]:factor[lang]
}
/**
 * @param choice {number} 由 $tc 输入的选择索引：`$tc('path.to.rule', choiceIndex)`
 * @param choicesLength {number} 总体可用选择
 * @returns 选择复数单词的最终选择索引
**/
VueI18n.prototype.getChoiceIndex = function (choice, choicesLength) {
  return choice > choicesLength - 1 ? choicesLength - 1 : choice
}

//配置选择项的键名不能修改
const i18n = new VueI18n({
  locale: lang,
  silentTranslationWarn: true, // 如果找不到字段表的key， true 不提示waring 默认false 提示warning
  messages
})
export default i18n
